import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { getPoolData } from 'queries/pools'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 5 minutes fresh period (CACHE_DURATION)
 * - 5 minutes stale window (STALE_WINDOW)
 * - Redis cache as persistent fallback
 */
const CACHE_DURATION = 300 // 5 minutes in seconds
const STALE_WINDOW = 300 // 5 minutes in seconds
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${STALE_WINDOW}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

interface PoolDataResponse {
  data: any
  error: boolean
  isCached?: boolean
}

/**
 * Fetches pool data with Redis fallback caching strategy:
 * 1. First tries to get fresh data
 * 2. Falls back to Redis cache if available
 * 3. Returns error if both fail
 *
 * @param address - Pool address (case-insensitive)
 * @param chainId - Blockchain network ID
 * @returns Promise<PoolDataResponse>
 */
const getPoolDataWithRedis = async (address: string, chainId: number): Promise<PoolDataResponse> => {
  const normalizedAddress = address.toLowerCase()
  const cacheKey = `pool-data:${chainId}:${normalizedAddress}`

  try {
    const { data, fromCache } = await RedisClient.getWithFallback(cacheKey, async () => {
      const freshData = await getPoolData(normalizedAddress, chainId)
      if (freshData.error) {
        throw new Error('Failed to fetch pool data')
      }
      return freshData
    })

    return {
      data,
      error: false,
      isCached: fromCache,
    }
  } catch (error) {
    console.error('Redis fallback error:', error)
    return {
      data: null,
      error: true,
    }
  }
}

/**
 * Multi-layer cached Pool Data fetcher:
 * 1. Memory cache (unstable_cache) - fastest, per-instance
 * 2. Redis cache - persistent across instances/reboots
 * 3. Fresh data - ultimate source of truth
 */
const cachedGetPoolData = unstableCache(
  getPoolDataWithRedis,
  ['pool-data-cache'], // Cache key prefix for memory cache
  {
    revalidate: CACHE_DURATION,
    tags: ['pool-data'], // For manual revalidation via On-Demand ISR
  },
)

/**
 * API Handler for Pool Data
 *
 * Endpoint: /api/pool-data?chainName=<chainName>&address=<poolAddress>
 *
 * Returns pool data for the specified blockchain network and pool address
 * with multi-layer caching for optimal performance.
 */
const handler: NextApiHandler = async (req, res) => {
  // Set default headers
  res.setHeader('Content-Type', 'application/json')

  try {
    const { chainName, address } = req.query as {
      chainName: string
      address: string
    }

    // ----------------------------
    // Input Validation
    // ----------------------------
    if (!chainName || !address) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['chainName', 'address'],
        documentation: 'https://docs.your-api.com/pool-data#parameters',
      })
    }

    const chainId = multiChainId[chainName.toUpperCase()]
    if (!chainId) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Unsupported chain',
        supportedChains: Object.keys(multiChainId),
        documentation: 'https://docs.your-api.com/pool-data#supported-chains',
      })
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Invalid pool address format',
        expectedFormat: '0x followed by 40 hexadecimal characters',
        documentation: 'https://docs.your-api.com/pool-data#address-format',
      })
    }

    // ----------------------------
    // Data Fetching
    // ----------------------------
    const { data: poolData } = await cachedGetPoolData(address, chainId)

    if (poolData.error || !poolData.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'Pool data not found',
        isCached: poolData.isCached,
        documentation: 'https://docs.your-api.com/pool-data#troubleshooting',
      })
    }

    // ----------------------------
    // Successful Response
    // ----------------------------
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(poolData.data)
  } catch (error) {
    // ----------------------------
    // Error Handling
    // ----------------------------
    console.error('Pool Data API Error:', error)
    res.setHeader('Cache-Control', 'no-store')

    const errorMessage = error instanceof Error ? error.message : 'Internal server error'

    return res.status(500).json({
      error: 'Internal Server Error',
      message: errorMessage,
      requestId: res.getHeader('x-request-id'),
      timestamp: new Date().toISOString(),
      documentation: 'https://docs.your-api.com/pool-data#errors',
    })
  }
}

export default handler
