import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { getOverviewData } from 'queries/stats/v2/overview'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 1 minute TTL for cached data
 */
const CACHE_DURATION = 60
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * API Handler for Protocol Stats V2
 *
 * Endpoint: /api/cached/protocol/v2/[chainName]/stats
 *
 * Cache-first approach:
 * 1. Returns cached data immediately if available in Redis
 * 2. If not cached, fetches live data, caches it, and returns it
 * 3. After returning response, refreshes cache in background to keep it up-to-date
 *
 * Cache key format: protocol/v2/{chainName}/stats -> protocol-v2-{chainName}-stats
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName } = req.query as {
      chainName: string
    }

    if (!chainName) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Missing required parameter: chainName',
      })
    }

    const chainId = multiChainId[chainName.toUpperCase()]
    if (!chainId) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Invalid chain name',
        supportedChains: Object.keys(multiChainId),
      })
    }

    // Build API URL path for cache key generation
    const apiPath = `protocol/v2/${chainName}/stats`

    // Fetch data with cache-first approach using URL-based cache key
    const result = await RedisClient.fetchWithCache(apiPath, async () => {
      const overviewData = await getOverviewData(chainId)
      if (overviewData.error) {
        throw new Error('Failed to fetch overview data')
      }
      return overviewData
    })

    if (result.data.error || !result.data.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'Overview data not found',
      })
    }

    // Set cache headers for successful responses
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

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
