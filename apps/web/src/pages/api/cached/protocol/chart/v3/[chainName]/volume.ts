import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { fetchVolumeChartData } from 'queries/stats/volume'
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
 * API Handler for Protocol Volume Chart
 *
 * Endpoint: /api/cached/protocol/chart/v3/[chainName]/volume
 *
 * Cache-first approach:
 * 1. Returns cached data immediately if available in Redis
 * 2. If not cached, fetches live data, caches it, and returns it
 * 3. After returning response, refreshes cache in background to keep it up-to-date
 *
 * Cache key format: protocol/chart/v3/{chainName}/volume -> protocol-chart-v3-{chainName}-volume
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName } = req.query

    if (!chainName) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Missing chainName',
      })
    }

    const chainId = multiChainId[chainName.toString().toUpperCase()]
    if (!chainId) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Invalid chain',
        supportedChains: Object.keys(multiChainId),
      })
    }

    // Build API URL path for cache key generation
    const apiPath = `protocol/chart/v3/${chainName}/volume`

    // Extract query parameters that affect the response
    const { groupBy, period } = req.query
    const queryParams: Record<string, string | undefined> = {}
    if (groupBy) queryParams.groupBy = groupBy as string
    if (period) queryParams.period = period as string

    // Fetch data with cache-first approach using URL-based cache key with query params
    // Cache persists indefinitely, refreshed in background
    const result = await RedisClient.fetchWithCache(
      apiPath,
      async () => {
        const freshData = await fetchVolumeChartData(chainId)
        if (freshData.error) {
          throw new Error('Failed to fetch protocol volume data')
        }
        return freshData
      },
      {
        queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
      },
    )

    if (result.data.error || !result.data.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'Volume chart data not found',
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
    console.error('Volume chart API error:', error)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({
      error: 'Internal error',
      timestamp: new Date().toISOString(),
    })
  }
}

export default handler
