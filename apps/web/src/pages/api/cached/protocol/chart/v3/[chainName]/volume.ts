import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { fetchVolumeChartData } from 'queries/stats/volume'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 1 minute fresh period (volume data changes frequently)
 * - 1 minute stale window (for background revalidation)
 * - Redis cache as persistent fallback with shorter TTL
 */
const CACHE_DURATION = 60 // 1 minute in seconds
const STALE_WINDOW = 60 // 1 minute in seconds
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${STALE_WINDOW}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * Redis-backed Volume Data fetcher with optimized caching strategy:
 * 1. First tries to get fresh data
 * 2. Falls back to Redis cache with shorter TTL (1 minute)
 * 3. Returns error if both fail
 */

const getVolumeChartDataWithRedis = async (chainId: number) => {
  // Generate consistent cache key
  const cacheKey = `volume-chart:${chainId}`

  // Attempt to fetch data with Redis fallback
  const { data } = await RedisClient.getWithFallback(
    cacheKey,
    async () => {
      // Fetch fresh data from source
      const freshData = await fetchVolumeChartData(chainId)

      // Throw error if fresh data fetch fails
      if (freshData.error) {
        throw new Error('Failed to fetch protocol TVL data')
      }

      return freshData
    },
    CACHE_DURATION, // Cache duration in seconds
  )

  return data
}

/**
 * Multi-layer cached Volume Data fetcher optimized for frequent updates
 */
const cachedFetchVolumeChartData = unstableCache(getVolumeChartDataWithRedis, ['volume-chart-data'], {
  revalidate: CACHE_DURATION,
  tags: ['volume-data'],
})

const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName } = req.query

    // Validate input
    if (!chainName) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Missing chainName',
        documentation: 'https://docs.your-api.com/volume-chart',
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

    // Fetch with caching
    const volumeData = await cachedFetchVolumeChartData(chainId)

    // Handle data not found scenario
    if (volumeData.error || !volumeData.data) {
      // Don't cache error responses
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'Volume chart data not found',
        details: 'No data available for this chain',
        documentation: 'https://docs.your-api.com/endpoints/tvl-chart#troubleshooting',
      })
    }

    // Set cache headers
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(volumeData.data)
  } catch (error) {
    console.error('Volume chart API error:', error)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({
      error: 'Internal error',
      requestId: res.getHeader('x-request-id'),
      timestamp: new Date().toISOString(),
    })
  }
}

export default handler
