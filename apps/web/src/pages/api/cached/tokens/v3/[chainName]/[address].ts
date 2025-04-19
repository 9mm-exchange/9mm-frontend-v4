import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { fetchTopTokens } from 'queries/tokens'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 5 minutes fresh period (token data updates moderately frequently)
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
 * Fetches token data with Redis fallback caching:
 * 1. Attempts to fetch fresh data first
 * 2. Falls back to Redis cache if fresh fetch fails
 * 3. Returns error if both attempts fail
 *
 * @param address - Token contract address (case-insensitive)
 * @param chainId - Blockchain network ID
 * @returns Token data with error state
 */
const getTokenDataWithRedis = async (address: string, chainId: number) => {
  const normalizedAddress = address.toLowerCase()
  const cacheKey = `token-data:${chainId}:${normalizedAddress}`

  const { data } = await RedisClient.getWithFallback(
    cacheKey,
    async () => {
      const freshData = await fetchTopTokens(normalizedAddress, chainId)
      if (freshData.error) {
        throw new Error('Failed to fetch token data')
      }
      return freshData
    },
    CACHE_DURATION,
  )

  return data
}

/**
 * Creates a multi-layer cached token data fetcher:
 * 1. Memory cache (unstable_cache) - fastest, per-instance
 * 2. Redis cache - persistent across instances/reboots
 * 3. Fresh data - ultimate source of truth
 */
const cachedGetTokenData = unstableCache(
  getTokenDataWithRedis,
  ['token-data-cache'], // Cache key prefix for memory cache
  {
    revalidate: CACHE_DURATION,
    tags: ['token-data'], // For manual revalidation via On-Demand ISR
  },
)

/**
 * API Handler for Token Data
 *
 * Endpoint: /api/token-data?chainName=<chainName>&address=<tokenAddress>
 *
 * Returns token data for the specified blockchain network and token address
 * with multi-layer caching for optimal performance.
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, address } = req.query as {
      chainName: string
      address: string
    }

    // Validate required parameters
    if (!chainName || !address) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['chainName', 'address'],
        documentation: 'https://docs.your-api.com/token-data#parameters',
      })
    }

    // Validate chain support
    const chainId = multiChainId[chainName.toUpperCase()]
    if (!chainId) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: `Unsupported chain: ${chainName}`,
        supportedChains: Object.keys(multiChainId),
        documentation: 'https://docs.your-api.com/token-data#supported-chains',
      })
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Invalid token address format',
        expectedFormat: '0x followed by 40 hexadecimal characters',
        documentation: 'https://docs.your-api.com/token-data#address-format',
      })
    }

    // Fetch data with caching
    const tokenData = await cachedGetTokenData(address, chainId)

    // Handle empty or error responses
    if (tokenData.error || !tokenData.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'Token data not found',
        documentation: 'https://docs.your-api.com/token-data#troubleshooting',
      })
    }

    // Apply cache headers for successful responses
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(tokenData.data[0])
  } catch (error) {
    console.error('Token Data API Error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Internal server error'

    res.setHeader('Cache-Control', 'no-store')

    return res.status(500).json({
      error: 'Internal Server Error',
      message: errorMessage,
      requestId: res.getHeader('x-request-id'),
      timestamp: new Date().toISOString(),
      documentation: 'https://docs.your-api.com/token-data#errors',
    })
  }
}

export default handler
