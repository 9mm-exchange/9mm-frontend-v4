import Redis from 'ioredis'

class RedisClient {
  private static instance: Redis

  private static lastSyncData: Map<string, any> = new Map()

  static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(process.env.SERVER_REDIS_URL || 'redis://localhost:6379')
      console.log('Redis client connected')
    }
    return RedisClient.instance
  }

  static async getWithFallback<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 300,
  ): Promise<{ data: T; fromCache: boolean }> {
    const redis = RedisClient.getInstance()

    try {
      // Try fetching live data
      const data = await fetchFn()

      // ✅ On success, persist to Redis and in-memory
      try {
        await redis.set(key, JSON.stringify(data)) // ❌ No TTL
        RedisClient.lastSyncData.set(key, data)
      } catch (setErr) {
        console.error('Redis set error:', setErr)
      }

      return { data, fromCache: false }
    } catch (fetchError) {
      console.warn('Live fetch failed, checking Redis:', fetchError)

      // 🔄 Check Redis
      try {
        const redisData = await redis.get(key)
        if (redisData) {
          const parsed = JSON.parse(redisData)
          return { data: parsed, fromCache: true }
        }
      } catch (redisErr) {
        console.error('Redis get error:', redisErr)
      }

      // 🔄 Fallback to in-memory last sync
      if (RedisClient.lastSyncData.has(key)) {
        return {
          data: RedisClient.lastSyncData.get(key),
          fromCache: true,
        }
      }

      // ❌ Nothing available
      throw new Error('Failed to fetch live data and no cached fallback available')
    }
  }
}

export default RedisClient
