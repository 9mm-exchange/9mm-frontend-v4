import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'

/**
 * Test endpoint to verify Redis cache is working
 * GET /api/cached/test-redis
 */
const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const testKey = 'test-redis-connection'
    const testData = { message: 'Redis is working!', timestamp: new Date().toISOString() }

    // Test 1: Set data in Redis
    const redis = RedisClient.getInstance()
    const setStart = Date.now()
    await redis.set(testKey, JSON.stringify(testData), 'EX', 60)
    const setTime = Date.now() - setStart

    // Test 2: Get data from Redis
    const getStart = Date.now()
    const cachedData = await redis.get(testKey)
    const getTime = Date.now() - getStart

    // Test 3: Test fetchWithCache
    const cacheTestStart = Date.now()
    const result = await RedisClient.fetchWithCache('test/cache/key', async () => {
      return { test: 'data', fetched: new Date().toISOString() }
    })
    const cacheTestTime = Date.now() - cacheTestStart

    // Test 4: Get it again to test cache hit
    const cacheHitStart = Date.now()
    const result2 = await RedisClient.fetchWithCache('test/cache/key', async () => {
      return { test: 'data', fetched: new Date().toISOString() }
    })
    const cacheHitTime = Date.now() - cacheHitStart

    return res.status(200).json({
      success: true,
      redis: {
        connection: 'connected',
        set: {
          success: true,
          time: `${setTime}ms`,
        },
        get: {
          success: !!cachedData,
          time: `${getTime}ms`,
          data: cachedData ? JSON.parse(cachedData) : null,
        },
      },
      fetchWithCache: {
        firstCall: {
          fromCache: result.fromCache,
          cacheKey: result.cacheKey,
          time: `${cacheTestTime}ms`,
        },
        secondCall: {
          fromCache: result2.fromCache,
          cacheKey: result2.cacheKey,
          time: `${cacheHitTime}ms`,
        },
      },
      message: 'Redis cache is working correctly!',
    })
  } catch (error) {
    console.error('Redis test error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Redis cache test failed',
    })
  }
}

export default handler
