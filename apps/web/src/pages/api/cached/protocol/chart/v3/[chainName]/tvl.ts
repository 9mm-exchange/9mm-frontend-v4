import RedisClient from 'lib/redis' // Redis client utility
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { fetchTvlChartData } from 'queries/stats/tvl'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration Constants
 * - CACHE_DURATION: 5 minutes (300 seconds) fresh period
 * - STALE_WINDOW: 5 minutes (300 seconds) stale window for background revalidation
 */
const CACHE_DURATION = 300 // 5 minutes in seconds
const STALE_WINDOW = 300 // 5 minutes in seconds

/**
 * Cache Headers Configuration
 * - Sets appropriate caching headers for CDN and browser caching
 * - Uses stale-while-revalidate pattern for optimal performance
 */
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${STALE_WINDOW}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * Fetches TVL chart data with Redis fallback caching strategy:
 * 1. First attempts to fetch fresh data
 * 2. Falls back to Redis cache if fresh fetch fails
 * 3. Returns error if both attempts fail
 *
 * @param chainId - Blockchain network ID
 * @returns TVL chart data with error state
 */
const getTvlChartDataWithRedis = async (chainId: number) => {
  // Generate consistent cache key
  const cacheKey = `tvl-chart:${chainId}`

  // Attempt to fetch data with Redis fallback
  const { data } = await RedisClient.getWithFallback(
    cacheKey,
    async () => {
      // Fetch fresh data from source
      const freshData = await fetchTvlChartData(chainId)

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
 * Creates a multi-layer cached TVL data fetcher:
 * 1. Memory cache (unstable_cache) - fastest, per-instance
 * 2. Redis cache - persistent across instances/reboots
 * 3. Fresh data - ultimate source of truth
 *
 * Uses tags for manual revalidation via On-Demand ISR
 */
const cachedFetchTvlChartData = unstableCache(
  getTvlChartDataWithRedis,
  ['tvl-chart-data'], // Cache key prefix for memory cache
  {
    revalidate: CACHE_DURATION, // Revalidation period
    tags: ['tvl-data'], // Tags for manual revalidation
  },
)

/**
 * API Handler for TVL Chart Data
 *
 * Endpoint: /api/tvl-chart?chainName=<chainName>
 *
 * Returns TVL chart data for the specified blockchain network
 * with multi-layer caching for optimal performance.
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName } = req.query

    // ----------------------------
    // Input Validation
    // ----------------------------

    // Validate required parameter exists
    if (!chainName) {
      return res.status(400).json({
        error: 'Missing required parameter: chainName',
        documentation: 'https://docs.your-api.com/endpoints/tvl-chart#required-parameters',
      })
    }

    // Validate and get chain ID from chain name
    const chainId = multiChainId[(chainName as string).toUpperCase()]
    if (!chainId) {
      return res.status(400).json({
        error: 'Invalid chain name',
        supportedChains: Object.keys(multiChainId),
        documentation: 'https://docs.your-api.com/endpoints/tvl-chart#supported-chains',
      })
    }

    // ----------------------------
    // Data Fetching with Caching
    // ----------------------------
    const tvlData = await cachedFetchTvlChartData(chainId)

    // Handle data not found scenario
    if (tvlData.error || !tvlData.data) {
      // Don't cache error responses
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'TVL chart data not found',
        details: 'No data available for this chain',
        documentation: 'https://docs.your-api.com/endpoints/tvl-chart#troubleshooting',
      })
    }

    // ----------------------------
    // Response Preparation
    // ----------------------------

    // Set cache headers for successful responses
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    // Return successful response with data
    return res.status(200).json(tvlData.data)
  } catch (error) {
    // ----------------------------
    // Error Handling
    // ----------------------------
    console.error('API Route Error:', error)

    // Ensure error responses aren't cached
    res.setHeader('Cache-Control', 'no-store, max-age=0')

    // Format error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    // Return error response
    return res.status(500).json({
      error: 'Internal Server Error',
      details: errorMessage,
      documentation: 'https://docs.your-api.com/endpoints/tvl-chart#server-errors',
      requestId: res.getHeader('x-request-id'), // Helpful for debugging
    })
  }
}

export default handler
