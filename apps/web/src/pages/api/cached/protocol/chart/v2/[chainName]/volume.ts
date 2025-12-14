import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { fetchVolumeChartData } from 'queries/stats/v2/volume'
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
 * API Handler for Protocol Volume Chart V2
 *
 * Endpoint: /api/cached/protocol/chart/v2/[chainName]/volume
 *
 * Cache-first approach:
 * 1. Returns cached data immediately if available in Redis
 * 2. If not cached, fetches live data, caches it, and returns it
 * 3. After returning response, refreshes cache in background to keep it up-to-date
 *
 * Cache key format: protocol/chart/v2/{chainName}/volume -> protocol-chart-v2-{chainName}-volume
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
    const apiPath = `protocol/chart/v2/${chainName}/volume`

    // Fetch data with cache-first approach using URL-based cache key
    const result = await RedisClient.fetchWithCache(apiPath, async () => {
      const volumeData = await fetchVolumeChartData(chainId)
      if (volumeData.error) {
        throw new Error('Failed to fetch volume data')
      }
      return volumeData
    })

    if (result.data.error || !result.data.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'Volume data not found',
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
      error: 'Internal Server Error',
      timestamp: new Date().toISOString(),
    })
  }
}

export default handler
