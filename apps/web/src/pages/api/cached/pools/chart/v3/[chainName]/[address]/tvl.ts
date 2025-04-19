import RedisClient from 'lib/redis' // Your Redis client utility
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { fetchPoolTvlChartData } from 'queries/stats/tvl'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 5 minutes fresh period (CACHE_DURATION)
 * - 25 minutes stale window (STALE_WINDOW)
 * - Redis cache as persistent fallback
 */
const CACHE_DURATION = 300 // 5 minutes in seconds
const STALE_WINDOW = 1500 // 25 minutes in seconds (300 * 5)
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${STALE_WINDOW}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * Redis-backed TVL data fetcher with fallback caching strategy:
 * 1. First tries to get fresh data
 * 2. Falls back to Redis cache if available
 * 3. Returns error if both fail
 *
 * @param address - Pool address
 * @param chainId - Blockchain network ID
 * @param period - Optional time period
 * @returns TVL chart data
 */
const getPoolTvlChartDataWithRedis = async (
  address: string,
  chainId: number,
  period?: '1D' | '1W' | '1M' | '6M' | '1Y',
) => {
  // Generate comprehensive cache key
  const cacheKey = `pool-tvl:${chainId}:${address.toLowerCase()}:${period || 'default'}`

  try {
    /**
     * Redis caching strategy:
     * - First tries to fetch fresh data
     * - On success, updates Redis cache
     * - On failure, falls back to Redis cached data if available
     */
    const result = await RedisClient.getWithFallback(
      cacheKey,
      async () => {
        const freshData = await fetchPoolTvlChartData(address.toLowerCase(), chainId, period)

        if (freshData.error) {
          throw new Error('Failed to fetch fresh TVL data')
        }

        return freshData
      },
      CACHE_DURATION, // Redis cache expiration matches HTTP cache
    )

    return result.data
  } catch (error) {
    console.error('Redis cache operation failed:', error)
    return { data: null, error: 'Failed to fetch TVL data with cache fallback' }
  }
}

/**
 * Multi-layer cached TVL data fetcher:
 * 1. Memory cache (unstable_cache) - fastest, per-instance
 * 2. Redis cache - persistent across instances/reboots
 * 3. Fresh data - ultimate source of truth
 */
const cachedFetchPoolTvlChartData = unstableCache(
  getPoolTvlChartDataWithRedis,
  ['pool-tvl-chart'], // Cache key prefix for memory cache
  {
    revalidate: CACHE_DURATION,
    tags: ['pool-tvl'], // For manual revalidation via On-Demand ISR
  },
)

const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, address, period } = req.query

    // ----------------------------
    // Input Validation
    // ----------------------------

    // Validate required parameters
    if (!chainName || !address) {
      return res.status(400).json({
        error: 'Missing required parameters: chainName and address are required',
        documentation: 'https://docs.your-api.com/endpoints/tvl#required-parameters',
      })
    }

    // Validate and get chain ID
    const chainId = multiChainId[(chainName as string).toUpperCase()]
    if (!chainId) {
      return res.status(400).json({
        error: 'Invalid chain name',
        supportedChains: Object.keys(multiChainId),
        documentation: 'https://docs.your-api.com/endpoints/tvl#supported-chains',
      })
    }

    // Validate Ethereum address format
    if (typeof address !== 'string' || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({
        error: 'Invalid pool address format',
        expectedFormat: '0x followed by 40 hexadecimal characters',
        documentation: 'https://docs.your-api.com/endpoints/tvl#address-format',
      })
    }

    // Validate period parameter if provided
    const validPeriods = ['1D', '1W', '1M', '6M', '1Y', undefined]
    if (period && !validPeriods.includes(period as string)) {
      return res.status(400).json({
        error: 'Invalid period parameter',
        validPeriods: validPeriods.filter((p) => p !== undefined),
        documentation: 'https://docs.your-api.com/endpoints/tvl#time-periods',
      })
    }

    // ----------------------------
    // Data Fetching with Caching
    // ----------------------------
    const tvlData = await cachedFetchPoolTvlChartData(
      address as string,
      chainId,
      period as '1D' | '1W' | '1M' | '6M' | '1Y' | undefined,
    )

    // Handle data not found scenario
    if (tvlData.error || !tvlData.data) {
      // Don't cache error responses
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'TVL data not found',
        details: tvlData.error || 'No data available for this pool',
        documentation: 'https://docs.your-api.com/endpoints/tvl#troubleshooting',
      })
    }

    // ----------------------------
    // Response Preparation
    // ----------------------------

    // Set cache headers for successful responses
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(tvlData.data)
  } catch (error) {
    // ----------------------------
    // Error Handling
    // ----------------------------
    console.error('API Route Error:', error)

    // Ensure error responses aren't cached
    res.setHeader('Cache-Control', 'no-store, max-age=0')

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    return res.status(500).json({
      error: 'Internal Server Error',
      details: errorMessage,
      documentation: 'https://docs.your-api.com/endpoints/tvl#server-errors',
      requestId: res.getHeader('x-request-id'), // Helpful for debugging
    })
  }
}

export default handler
