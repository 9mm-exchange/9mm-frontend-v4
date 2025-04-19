import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { getPoolsData } from 'queries/pools'
import { multiChainId } from 'state/info/constant'

interface PoolsDataResponse {
  data: any
  error: boolean
  isCached?: boolean
}

/**
 * Cache Configuration:
 * - 5 minutes fresh period
 * - 5 minutes stale window (for background revalidation)
 */
const CACHE_DURATION = 300 // 5 minutes in seconds
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * Fetches pools data with Redis fallback caching
 * @param chainId - Blockchain network ID
 * @param token - Optional token address filter
 * @returns Promise<PoolsDataResponse>
 */
const getPoolsDataWithRedis = async (chainId: number, token?: string): Promise<PoolsDataResponse> => {
  const normalizedToken = token?.toLowerCase()
  const cacheKey = `pools-data:${chainId}:${normalizedToken || 'all'}`

  try {
    const { data, fromCache } = await RedisClient.getWithFallback(
      cacheKey,
      async () => {
        const freshData = await getPoolsData(chainId, normalizedToken)
        if (freshData.error) {
          throw new Error('Failed to fetch pools data')
        }
        return freshData
      },
      CACHE_DURATION,
    )

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
 * Multi-layer cached pools data fetcher
 */
const cachedGetPoolsData = unstableCache(getPoolsDataWithRedis, ['pools-data-cache'], {
  revalidate: CACHE_DURATION,
  tags: ['pools-data'],
})

/**
 * API Handler for Pools Data
 *
 * Endpoint: /api/pools-data?chainName=<chainName>&token=<tokenAddress>
 *
 * Returns pools data for the specified blockchain network,
 * optionally filtered by token address.
 */
const handler: NextApiHandler = async (req, res) => {
  // Set default headers
  res.setHeader('Content-Type', 'application/json')

  try {
    const { chainName, token } = req.query as {
      chainName: string
      token?: string
    }

    // Input Validation
    if (!chainName) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Missing required parameter: chainName',
        documentation: 'https://docs.your-api.com/pools-data#parameters',
      })
    }

    const chainId = multiChainId[chainName.toUpperCase()]
    if (!chainId) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Unsupported chain',
        supportedChains: Object.keys(multiChainId),
        documentation: 'https://docs.your-api.com/pools-data#supported-chains',
      })
    }

    if (token && !/^0x[a-fA-F0-9]{40}$/.test(token)) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Invalid token address format',
        expectedFormat: '0x followed by 40 hexadecimal characters',
        documentation: 'https://docs.your-api.com/pools-data#address-format',
      })
    }

    // Data Fetching
    const { data: poolsData } = await cachedGetPoolsData(chainId, token)

    if (poolsData.error || !poolsData.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'Pools data not found',
        isCached: poolsData.isCached,
        documentation: 'https://docs.your-api.com/pools-data#troubleshooting',
      })
    }

    // Successful Response
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(poolsData.data)
  } catch (error) {
    // Error Handling
    console.error('Pools Data API Error:', error)
    res.setHeader('Cache-Control', 'no-store')

    const errorMessage = error instanceof Error ? error.message : 'Internal server error'

    return res.status(500).json({
      error: 'Internal Server Error',
      message: errorMessage,
      requestId: res.getHeader('x-request-id'),
      timestamp: new Date().toISOString(),
      documentation: 'https://docs.your-api.com/pools-data#errors',
    })
  }
}

export default handler
