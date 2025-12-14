import RedisClient from 'lib/redis' // Assuming you have a Redis client utility
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { fetchPoolFeeChartData } from 'queries/stats/fee'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 5 minutes fresh period
 * - 25 minutes stale window (served while revalidating)
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
 * Redis-backed data fetcher with fallback caching strategy:
 * 1. First tries to get fresh data
 * 2. Falls back to Redis cache if available
 * 3. Returns error if both fail
 *
 * @param address - Pool address
 * @param chainId - Blockchain network ID
 * @param period - Optional time period
 * @returns Fee chart data
 */
const getPoolFeeChartDataWithRedis = async (
  address: string,
  chainId: number,
  period?: '1D' | '1W' | '1M' | '6M' | '1Y',
) => {
  // Generate cache key incorporating all parameters
  const cacheKey = `pool-fee:${chainId}:${address.toLowerCase()}:${period || 'default'}`

  try {
    /**
     * Redis caching strategy:
     * - First tries to fetch fresh data
     * - On success, updates Redis cache
     * - On failure, falls back to Redis cached data if available
     */
    const result = await RedisClient.getWithFallback(cacheKey, async () => {
      const freshData = await fetchPoolFeeChartData(address.toLowerCase(), chainId, period)

      if (freshData.error) {
        throw new Error('Failed to fetch fresh fee data')
      }

      return freshData
    })

    return result.data
  } catch (error) {
    console.error('Redis cache operation failed:', error)
    return { data: null, error: 'Failed to fetch data with cache fallback' }
  }
}

/**
 * Multi-layer cached data fetcher:
 * 1. Memory cache (unstable_cache) - fastest, per-instance
 * 2. Redis cache - persistent across instances/reboots
 * 3. Fresh data - ultimate source of truth
 */
const cachedFetchPoolFeeChartData = unstableCache(
  getPoolFeeChartDataWithRedis,
  ['pool-fee-chart'], // Cache key prefix for memory cache
  {
    revalidate: CACHE_DURATION,
    tags: ['pool-fee'], // For manual revalidation via On-Demand ISR
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
      })
    }

    // Validate and get chain ID
    const chainId = multiChainId[(chainName as string).toUpperCase()]
    if (!chainId) {
      return res.status(400).json({
        error: 'Invalid chain name',
        supportedChains: Object.keys(multiChainId),
      })
    }

    // Validate Ethereum address format
    if (typeof address !== 'string' || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({
        error: 'Invalid pool address format',
        expectedFormat: '0x followed by 40 hexadecimal characters',
      })
    }

    // Validate period parameter if provided
    const validPeriods = ['1D', '1W', '1M', '6M', '1Y', undefined]
    if (period && !validPeriods.includes(period as string)) {
      return res.status(400).json({
        error: 'Invalid period parameter',
        validPeriods: validPeriods.filter((p) => p !== undefined),
      })
    }

    // ----------------------------
    // Data Fetching with Caching
    // ----------------------------
    const feeData = await cachedFetchPoolFeeChartData(
      address as string,
      chainId,
      period as '1D' | '1W' | '1M' | '6M' | '1Y' | undefined,
    )

    // Handle data not found scenario
    if (feeData.error || !feeData.data) {
      // Don't cache error responses
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'Fee data not found',
        details: feeData.error || 'No data available for this pool',
      })
    }

    // ----------------------------
    // Response Preparation
    // ----------------------------

    // Set cache headers for successful responses
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(feeData.data)
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
      // Include documentation link for debugging
      documentation: 'https://docs.your-api.com/errors/pool-fee-data',
    })
  }
}

export default handler
