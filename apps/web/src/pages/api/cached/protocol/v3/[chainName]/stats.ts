import RedisClient from 'lib/redis' // Your Redis client utility
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { getOverviewData } from 'queries/stats/overview'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 5 minutes fresh period (overview data changes less frequently)
 * - 5 minutes stale window (for background revalidation)
 */
const CACHE_DURATION = 300 // 5 minutes in seconds
const STALE_WINDOW = 300 // 5 minutes in seconds
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${STALE_WINDOW}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * Fetches overview data with Redis fallback caching strategy:
 * 1. First tries to get fresh data
 * 2. Falls back to Redis cache if available
 * 3. Returns error if both fail
 *
 * @param chainId - Blockchain network ID
 * @returns Overview data
 */
const getOverviewDataWithRedis = async (chainId: number) => {
  const cacheKey = `overview-data:${chainId}`

  const { data } = await RedisClient.getWithFallback(
    cacheKey,
    async () => {
      const freshData = await getOverviewData(chainId)
      if (freshData.error) {
        throw new Error('Error in fetching overview data')
      }
      return freshData
    },
    CACHE_DURATION,
  )

  return data
}

/**
 * Creates a multi-layer cached overview data fetcher:
 * 1. Memory cache (unstable_cache) - fastest, per-instance
 * 2. Redis cache - persistent across instances/reboots
 * 3. Fresh data - ultimate source of truth
 */
const cachedGetOverviewData = unstableCache(
  getOverviewDataWithRedis,
  ['overview-data'], // Cache key prefix for memory cache
  {
    revalidate: CACHE_DURATION,
    tags: ['overview'], // For manual revalidation via On-Demand ISR
  },
)

/**
 * API Handler for Overview Data
 *
 * Endpoint: /api/overview?chainName=<chainName>
 *
 * Returns overview statistics for the specified blockchain network
 * with multi-layer caching for optimal performance.
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName } = req.query

    // Validate input
    if (!chainName) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Missing chainName parameter',
        documentation: 'https://docs.your-api.com/overview#parameters',
      })
    }

    const chainId = multiChainId[chainName.toString().toUpperCase()]
    if (!chainId) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Unsupported chain',
        supportedChains: Object.keys(multiChainId),
        documentation: 'https://docs.your-api.com/overview#supported-chains',
      })
    }

    // Fetch data with caching
    const overviewData = await cachedGetOverviewData(chainId)

    if (overviewData.error || !overviewData.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'No overview data available',
        documentation: 'https://docs.your-api.com/overview#troubleshooting',
      })
    }

    // Set cache headers for successful responses
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(overviewData.data)
  } catch (error) {
    console.error('Overview API error:', error)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({
      error: 'Internal server error',
      requestId: res.getHeader('x-request-id'),
      timestamp: new Date().toISOString(),
      documentation: 'https://docs.your-api.com/overview#errors',
    })
  }
}

export default handler
