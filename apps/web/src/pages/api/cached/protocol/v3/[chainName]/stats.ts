import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { getOverviewData } from 'queries/stats/overview'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 5 minutes TTL for cached data
 */
const CACHE_DURATION = 300 // 5 minutes in seconds
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * API Handler for Protocol Stats
 *
 * Endpoint: /api/cached/protocol/v3/[chainName]/stats
 *
 * Cache-first approach:
 * 1. Returns cached data immediately if available in Redis
 * 2. If not cached, fetches live data, caches it, and returns it
 * 3. After returning response, refreshes cache in background to keep it up-to-date
 *
 * Cache key format: protocol/v3/{chainName}/stats -> protocol-v3-{chainName}-stats
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName } = req.query

    // Validate input
    if (!chainName) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Missing chainName parameter',
      })
    }

    const chainId = multiChainId[chainName.toString().toUpperCase()]
    if (!chainId) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: `Unsupported chain: ${chainName}`,
        supportedChains: Object.keys(multiChainId),
      })
    }

    // Build API URL path for cache key generation
    // Example: protocol/v3/pulse/stats -> protocol-v3-pulse-stats
    const apiPath = `protocol/v3/${chainName}/stats`

    // Fetch data with cache-first approach using URL-based cache key
    // Cache persists indefinitely, refreshed in background
    const result = await RedisClient.fetchWithCache(apiPath, async () => {
      const freshData = await getOverviewData(chainId)
      if (freshData.error) {
        throw new Error('Error in fetching overview data')
      }
      return freshData
    })

    if (result.data.error || !result.data.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'No overview data available',
      })
    }

    // Set cache headers for successful responses
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    // Add cache status header for debugging
    res.setHeader('X-Cache-Status', result.fromCache ? 'HIT' : 'MISS')
    res.setHeader('X-Cache-Key', result.cacheKey)

    // Return cached or fresh data immediately
    // Background refresh is already triggered by fetchWithCache
    return res.status(200).json(result.data.data)
  } catch (error) {
    console.error('Protocol stats API error:', error)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    })
  }
}

export default handler
