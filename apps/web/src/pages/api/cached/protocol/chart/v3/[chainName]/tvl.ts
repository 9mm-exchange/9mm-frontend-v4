import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { fetchTvlChartData } from 'queries/stats/tvl'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 5 minutes TTL for cached data
 */
const CACHE_DURATION = 300
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * API Handler for Protocol TVL Chart
 *
 * Endpoint: /api/cached/protocol/chart/v3/[chainName]/tvl
 *
 * Cache-first approach:
 * 1. Returns cached data immediately if available in Redis
 * 2. If not cached, fetches live data, caches it, and returns it
 * 3. After returning response, refreshes cache in background to keep it up-to-date
 *
 * Cache key format: protocol/chart/v3/{chainName}/tvl -> protocol-chart-v3-{chainName}-tvl
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName } = req.query

    if (!chainName) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Missing required parameter: chainName',
      })
    }

    const chainId = multiChainId[(chainName as string).toUpperCase()]
    if (!chainId) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Invalid chain name',
        supportedChains: Object.keys(multiChainId),
      })
    }

    // Build API URL path for cache key generation
    const apiPath = `protocol/chart/v3/${chainName}/tvl`

    // Fetch data with cache-first approach using URL-based cache key
    const result = await RedisClient.fetchWithCache(apiPath, async () => {
      const freshData = await fetchTvlChartData(chainId)
      if (freshData.error) {
        throw new Error('Failed to fetch protocol TVL data')
      }
      return freshData
    })

    if (result.data.error || !result.data.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'TVL chart data not found',
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
    console.error('TVL chart API error:', error)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({
      error: 'Internal Server Error',
      timestamp: new Date().toISOString(),
    })
  }
}

export default handler
