import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { getBlockByTimestamp } from 'queries/blocks'
import { multiChainId } from 'state/info/constant'

const CACHE_DURATION = 3600 // 1 hour
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

const isValidTimestamp = (timestamp: number): boolean => {
  // Check if timestamp is a positive number and within reasonable bounds
  return (
    Number.isFinite(timestamp) && timestamp > 0 && timestamp < Date.now() / 1000 + 86400 // Allow timestamps up to 1 day in future
  )
}

/**
 * API Handler for Block by Timestamp
 *
 * Endpoint: /api/cached/block/[chainName]/[timeStamp]
 *
 * Cache-first approach:
 * 1. Returns cached data immediately if available in Redis
 * 2. If not cached, fetches live data, caches it, and returns it
 * 3. After returning response, refreshes cache in background to keep it up-to-date
 *
 * Cache key format: block/{chainName}/{timeStamp} -> block-{chainName}-{timeStamp}
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, timeStamp } = req.query

    // Validate required parameters
    if (typeof chainName !== 'string' || typeof timeStamp !== 'string') {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({ error: 'Missing or invalid required parameters' })
    }

    // Get and validate chain ID
    const chainId = multiChainId[chainName.toUpperCase()]
    if (chainId === undefined) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({ error: 'Invalid chain name' })
    }

    // Validate timestamp format
    const timestamp = Number(timeStamp)
    if (!isValidTimestamp(timestamp)) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({ error: 'Invalid timestamp format' })
    }

    // Build API URL path for cache key generation
    const apiPath = `block/${chainName}/${timeStamp}`

    // Fetch data with cache-first approach using URL-based cache key
    // Cache persists indefinitely, refreshed in background
    const result = await RedisClient.fetchWithCache(apiPath, async () => {
      const block = await getBlockByTimestamp(timestamp, chainId)
      if (!block) {
        throw new Error('Block not found for the given timestamp')
      }
      return {
        height: Number(block.number),
        timestamp: Number(block.timestamp),
      }
    })

    // Set cache headers for successful responses
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    // Add cache status header for debugging
    res.setHeader('X-Cache-Status', result.fromCache ? 'HIT' : 'MISS')
    res.setHeader('X-Cache-Key', result.cacheKey)

    // Return cached or fresh data immediately
    // Background refresh is already triggered by fetchWithCache
    return res.status(200).json(result.data)
  } catch (error) {
    console.error('Block API Error:', error)
    res.setHeader('Cache-Control', 'no-store')
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return res.status(500).json({
      error: 'Internal Server Error',
      details: errorMessage,
      timestamp: new Date().toISOString(),
    })
  }
}

export default handler
