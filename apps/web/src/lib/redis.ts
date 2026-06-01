import Redis from 'ioredis'
import { createCacheKey } from './cache-utils'

class RedisClient {
  private static instance: Redis

  // In-memory fallback; entries carry an expiry so a dead background-refresh
  // can't serve data forever (see CACHE_TTL_MS).
  private static lastSyncData: Map<string, { data: any; exp: number }> = new Map()

  // Cache stringified data to avoid re-stringifying (optimization)
  private static stringifiedCache: Map<string, string> = new Map()

  // Max cache staleness. Background refresh keeps entries warm under traffic, but
  // if refreshes stop succeeding (e.g. upstream down) entries EXPIRE instead of
  // being served indefinitely — a no-TTL cache served 12-day-old PulseChain
  // transactions when refreshes failed silently. Override via env.
  private static readonly CACHE_TTL_SECONDS = Number(process.env.REDIS_CACHE_TTL_SECONDS ?? 300)

  private static get CACHE_TTL_MS(): number {
    return RedisClient.CACHE_TTL_SECONDS * 1000
  }

  // Track ongoing refresh tasks to prevent duplicate refreshes
  private static refreshTasks: Map<string, Promise<void>> = new Map()

  // Track ongoing fetch tasks to prevent duplicate fetches (request deduplication)
  private static fetchTasks: Map<string, Promise<any>> = new Map()

  // Limit in-memory cache size to prevent memory leaks (keep last 1000 entries)
  private static readonly MAX_MEMORY_CACHE_SIZE = 1000

  static getInstance(): Redis {
    if (!RedisClient.instance) {
      const redisUrl = process.env.SERVER_REDIS_URL || 'redis://localhost:6379'
      RedisClient.instance = new Redis(redisUrl, {
        connectTimeout: 5000, // 5 second connection timeout
        retryStrategy: (times) => {
          if (times > 3) {
            console.error('Redis connection failed after 3 retries')
            return null // Stop retrying
          }
          return Math.min(times * 200, 2000) // Exponential backoff
        },
        maxRetriesPerRequest: 3,
        lazyConnect: false,
      })

      // Add error handlers
      RedisClient.instance.on('error', (err) => {
        console.error('Redis connection error:', err.message)
      })

      RedisClient.instance.on('connect', () => {
        console.log('Redis client connecting...')
      })

      RedisClient.instance.on('ready', () => {
        console.log('Redis client ready and connected')
      })

      RedisClient.instance.on('close', () => {
        console.warn('Redis connection closed')
      })
    }
    return RedisClient.instance
  }

  /**
   * Background refresh task - updates cache without blocking.
   * Re-sets the TTL on every successful refresh, so warm keys stay alive while
   * refreshes succeed and expire once they stop.
   */
  private static async refreshCacheInBackground<T>(key: string, fetchFn: () => Promise<T>): Promise<void> {
    const redis = RedisClient.getInstance()

    try {
      const data = await fetchFn()

      // Update Redis and in-memory cache, bounding staleness with a TTL.
      try {
        const stringified = JSON.stringify(data)
        await redis.set(key, stringified, 'EX', RedisClient.CACHE_TTL_SECONDS)
        RedisClient.lastSyncData.set(key, { data, exp: Date.now() + RedisClient.CACHE_TTL_MS })
        RedisClient.stringifiedCache.set(key, stringified)
        console.log(`✅ Background cache refresh completed for ${key}`)
      } catch (setErr) {
        console.error('Redis set error during background refresh:', setErr)
      }
    } catch (fetchError) {
      console.warn('Background refresh failed for key:', key, fetchError)
      // Don't throw - this is background, we don't want to break the flow
    } finally {
      // Remove from refresh tasks map when done
      RedisClient.refreshTasks.delete(key)
    }
  }

  /**
   * Cache-first with background refresh:
   * 1. Returns cached data immediately if available
   * 2. Triggers background refresh to update cache (non-blocking)
   * 3. If no cache, fetches fresh data and caches it
   *
   * Cache is TTL-bounded (REDIS_CACHE_TTL_SECONDS, default 300s) and kept warm
   * by background refresh; expires if refreshes stop succeeding.
   */
  static async getWithFallback<T>(key: string, fetchFn: () => Promise<T>): Promise<{ data: T; fromCache: boolean }> {
    const redis = RedisClient.getInstance()

    // 🔄 Step 1: Check Redis cache first (cache-first approach)
    const cacheStartTime = Date.now()
    try {
      // Use a timeout to prevent Redis from blocking too long (2 seconds for GET operations)
      let timeoutId: NodeJS.Timeout | null = null
      const timeoutPromise = new Promise<string | null>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Redis get timeout after 2s')), 2000)
      })

      let redisData: string | null = null
      try {
        redisData = (await Promise.race([redis.get(key), timeoutPromise])) as string | null
      } finally {
        if (timeoutId) clearTimeout(timeoutId)
      }

      const cacheTime = Date.now() - cacheStartTime

      if (redisData) {
        try {
          const parsed = JSON.parse(redisData)
          console.log(`✅ Redis CACHE HIT: ${key} (${cacheTime}ms) - returning cached data immediately`)

          // Update in-memory cache with the data we just got from Redis
          RedisClient.lastSyncData.set(key, { data: parsed, exp: Date.now() + RedisClient.CACHE_TTL_MS })
          RedisClient.stringifiedCache.set(key, redisData) // Cache the stringified version

          // ✅ Cache hit - trigger background refresh (non-blocking)
          // Only start refresh if not already refreshing
          if (!RedisClient.refreshTasks.has(key)) {
            const refreshPromise = this.refreshCacheInBackground(key, fetchFn)
            RedisClient.refreshTasks.set(key, refreshPromise)
            // Don't await - let it run in background
            refreshPromise.catch(() => {
              // Error already logged in refreshCacheInBackground
            })
          }

          // Return cached data immediately - background refresh will update cache
          return { data: parsed, fromCache: true }
        } catch (parseErr) {
          console.error(`⚠️ Failed to parse cached data for ${key}:`, parseErr)
          // Continue to fetch fresh data
        }
      } else {
        console.log(`❌ Redis CACHE MISS: ${key} (${cacheTime}ms) - no data in Redis`)
      }
    } catch (redisErr) {
      const cacheTime = Date.now() - cacheStartTime
      const errorMsg = redisErr instanceof Error ? redisErr.message : String(redisErr)
      if (errorMsg.includes('timeout')) {
        console.warn(`⚠️ Redis timeout for ${key} (${cacheTime}ms) - falling back to in-memory/fresh fetch`)
      } else {
        console.error(`⚠️ Redis get error for ${key} (${cacheTime}ms):`, errorMsg)
      }
      // Continue to check in-memory cache
    }

    // 🔄 Step 2: Fallback to in-memory cache (only if not expired — never serve
    // unboundedly-stale data when Redis is unavailable)
    const memEntry = RedisClient.lastSyncData.get(key)
    if (memEntry && memEntry.exp > Date.now()) {
      console.log(`✅ In-Memory CACHE HIT: ${key}`)

      // ✅ In-memory cache hit - trigger background refresh (non-blocking)
      if (!RedisClient.refreshTasks.has(key)) {
        const refreshPromise = this.refreshCacheInBackground(key, fetchFn)
        RedisClient.refreshTasks.set(key, refreshPromise)
        refreshPromise.catch(() => {
          // Error already logged
        })
      }

      return { data: memEntry.data, fromCache: true }
    }
    if (memEntry) {
      // expired — drop it so we fetch fresh below
      RedisClient.lastSyncData.delete(key)
      RedisClient.stringifiedCache.delete(key)
    }

    // ✅ Step 3: Cache miss - fetch fresh data and cache it
    // Check if there's already a fetch in progress for this key (request deduplication)
    if (RedisClient.fetchTasks.has(key)) {
      console.log(`⏳ Waiting for ongoing fetch for: ${key}`)
      try {
        const data = await RedisClient.fetchTasks.get(key)
        // Data is already being cached by the original fetch, just return it
        return { data, fromCache: false }
      } catch (fetchError) {
        // If the original fetch failed, continue to try our own fetch
        console.warn(`Original fetch failed for ${key}, retrying...`)
        RedisClient.fetchTasks.delete(key)
      }
    }

    const fetchStartTime = Date.now()
    // Create a fetch promise and store it to deduplicate concurrent requests
    const fetchPromise = (async () => {
      try {
        console.log(`🔄 Fetching fresh data for: ${key}`)
        const data = await fetchFn()
        const fetchTime = Date.now() - fetchStartTime
        console.log(`✅ Fresh data fetched for ${key} (${fetchTime}ms)`)
        return data
      } finally {
        // Remove from fetch tasks when done
        RedisClient.fetchTasks.delete(key)
      }
    })()

    // Store the fetch promise for deduplication
    RedisClient.fetchTasks.set(key, fetchPromise)

    try {
      const data = await fetchPromise

      // Set in-memory cache immediately (instant, synchronous)
      // Limit cache size to prevent memory leaks
      if (RedisClient.lastSyncData.size >= RedisClient.MAX_MEMORY_CACHE_SIZE) {
        // Remove oldest entry (first key in Map)
        const firstKey = RedisClient.lastSyncData.keys().next().value
        if (firstKey) {
          RedisClient.lastSyncData.delete(firstKey)
          RedisClient.stringifiedCache.delete(firstKey)
        }
      }

      const stringified = JSON.stringify(data)
      RedisClient.lastSyncData.set(key, { data, exp: Date.now() + RedisClient.CACHE_TTL_MS })
      RedisClient.stringifiedCache.set(key, stringified)
      console.log(`✅ In-memory cache set for ${key}`)

      // Cache in Redis in background (non-blocking) - don't wait for it.
      // TTL-bounded so a stalled background refresh can't serve it forever.
      const cacheInBackground = async () => {
        try {
          const redisCacheStartTime = Date.now()
          await Promise.race([
            redis.set(key, stringified, 'EX', RedisClient.CACHE_TTL_SECONDS),
            new Promise<void>((_, reject) => {
              setTimeout(() => reject(new Error('Redis set timeout')), 2000)
            }),
          ])
          const redisCacheTime = Date.now() - redisCacheStartTime
          console.log(`✅ Data cached in Redis for ${key} (${redisCacheTime}ms, ttl ${RedisClient.CACHE_TTL_SECONDS}s)`)
        } catch (cacheErr) {
          const errorMsg = cacheErr instanceof Error ? cacheErr.message : String(cacheErr)
          if (errorMsg.includes('timeout')) {
            console.warn(`⚠️ Redis cache set timeout for ${key} - will retry in background`)
          } else {
            console.error(`⚠️ Redis cache set error for ${key}:`, errorMsg)
          }
          // Retry caching in background after a short delay
          setTimeout(() => {
            redis.set(key, stringified, 'EX', RedisClient.CACHE_TTL_SECONDS).catch(() => {
              // Silent fail on retry
            })
          }, 1000)
        }
      }

      // Start caching in background (don't await)
      cacheInBackground().catch(() => {
        // Error already logged
      })

      // Trigger background refresh to keep cache up-to-date (non-blocking)
      // This ensures cache stays fresh without blocking the response
      if (!RedisClient.refreshTasks.has(key)) {
        const refreshPromise = this.refreshCacheInBackground(key, fetchFn)
        RedisClient.refreshTasks.set(key, refreshPromise)
        refreshPromise.catch(() => {
          // Error already logged in refreshCacheInBackground
        })
      }

      // Return immediately - cache is being set in background
      return { data, fromCache: false }
    } catch (fetchError) {
      const fetchTime = Date.now() - fetchStartTime
      console.error(
        `❌ Live fetch failed for ${key} (${fetchTime}ms):`,
        fetchError instanceof Error ? fetchError.message : fetchError,
      )

      // ❌ Nothing available
      throw new Error('Failed to fetch live data and no cached fallback available')
    }
  }

  /**
   * Cache-first API fetch with automatic cache key generation from URL
   *
   * Converts API URLs to cache keys automatically:
   * - "protocol/v3/pulse/stats" -> "protocol-v3-pulse-stats"
   * - "protocol/v3/pulse/stats" with { groupBy: '1D' } -> "protocol-v3-pulse-stats-groupBy-1D"
   * - "https://api.example.com/protocol/v3/pulse/stats" -> "protocol-v3-pulse-stats"
   *
   * Cache is TTL-bounded (REDIS_CACHE_TTL_SECONDS, default 300s) and kept warm
   * by background refresh; expires if refreshes stop succeeding.
   *
   * @param url - API endpoint URL or path
   * @param fetchFn - Function that fetches the data
   * @param options - Optional configuration
   * @param options.queryParams - Query parameters to include in cache key (e.g., { groupBy: '1D', period: '1W' })
   * @returns Promise with cached or fresh data
   */
  static async fetchWithCache<T>(
    url: string,
    fetchFn: () => Promise<T>,
    options?: {
      queryParams?: Record<string, string | string[] | undefined>
    },
  ): Promise<{ data: T; fromCache: boolean; cacheKey: string }> {
    const queryParams = options?.queryParams
    const cacheKey = createCacheKey(url, queryParams)
    const result = await RedisClient.getWithFallback<T>(cacheKey, fetchFn)

    return {
      ...result,
      cacheKey,
    }
  }
}

export default RedisClient
