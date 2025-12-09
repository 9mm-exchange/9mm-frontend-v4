import Redis from 'ioredis'

class RedisClient {
  private static instance: Redis

  private static lastSyncData: Map<string, any> = new Map()

  // Track ongoing refresh tasks to prevent duplicate refreshes
  private static refreshTasks: Map<string, Promise<void>> = new Map()

  static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(process.env.SERVER_REDIS_URL || 'redis://localhost:6379')
      console.log('Redis client connected')
    }
    return RedisClient.instance
  }

  /**
   * Background refresh task - updates cache without blocking
   */
  private static async refreshCacheInBackground<T>(key: string, fetchFn: () => Promise<T>, ttl: number): Promise<void> {
    const redis = RedisClient.getInstance()

    try {
      const data = await fetchFn()

      // Update Redis and in-memory cache
      try {
        await redis.set(key, JSON.stringify(data), 'EX', ttl)
        RedisClient.lastSyncData.set(key, data)
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
   */
  static async getWithFallback<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 300,
  ): Promise<{ data: T; fromCache: boolean }> {
    const redis = RedisClient.getInstance()

    // 🔄 Step 1: Check Redis cache first (cache-first approach)
    try {
      const redisData = await redis.get(key)
      if (redisData) {
        const parsed = JSON.parse(redisData)

        // ✅ Cache hit - trigger background refresh (non-blocking)
        // Only start refresh if not already refreshing
        if (!RedisClient.refreshTasks.has(key)) {
          const refreshPromise = this.refreshCacheInBackground(key, fetchFn, ttl)
          RedisClient.refreshTasks.set(key, refreshPromise)
          // Don't await - let it run in background
          refreshPromise.catch(() => {
            // Error already logged in refreshCacheInBackground
          })
        }

        return { data: parsed, fromCache: true }
      }
    } catch (redisErr) {
      console.error('Redis get error:', redisErr)
      // Continue to check in-memory cache
    }

    // 🔄 Step 2: Fallback to in-memory cache
    if (RedisClient.lastSyncData.has(key)) {
      const cachedData = RedisClient.lastSyncData.get(key)

      // ✅ In-memory cache hit - trigger background refresh (non-blocking)
      if (!RedisClient.refreshTasks.has(key)) {
        const refreshPromise = this.refreshCacheInBackground(key, fetchFn, ttl)
        RedisClient.refreshTasks.set(key, refreshPromise)
        refreshPromise.catch(() => {
          // Error already logged
        })
      }

      return { data: cachedData, fromCache: true }
    }

    // ✅ Step 3: Cache miss - fetch fresh data and cache it
    try {
      const data = await fetchFn()

      // Persist to Redis with TTL and in-memory
      try {
        await redis.set(key, JSON.stringify(data), 'EX', ttl)
        RedisClient.lastSyncData.set(key, data)
      } catch (setErr) {
        console.error('Redis set error:', setErr)
      }

      return { data, fromCache: false }
    } catch (fetchError) {
      console.warn('Live fetch failed:', fetchError)

      // ❌ Nothing available
      throw new Error('Failed to fetch live data and no cached fallback available')
    }
  }
}

export default RedisClient
