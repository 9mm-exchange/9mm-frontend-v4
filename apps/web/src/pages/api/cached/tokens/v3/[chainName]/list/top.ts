import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { fetchTopTokens } from 'queries/tokens'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 25 minutes fresh period (token data updates moderately frequently)
 */
const CACHE_DURATION = 1500 // 25 minutes in seconds
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * Fetches top tokens with Redis fallback caching:
 * 1. Attempts to fetch fresh data first
 * 2. Falls back to Redis cache if fresh fetch fails
 * 3. Returns error if both attempts fail
 *
 * @param chainId - Blockchain network ID
 * @returns Top tokens data with error state
 */
const getTopTokensWithRedis = async (chainId: number) => {
  const cacheKey = `top-tokens:${chainId}`

  const { data } = await RedisClient.getWithFallback(
    cacheKey,
    async () => {
      const freshData = await fetchTopTokens(undefined, chainId)
      if (freshData.error || !freshData.data?.length) {
        throw new Error('Failed to fetch pools or top tokens data')
      }
      return freshData
    },
    CACHE_DURATION,
  )

  return data
}

/**
 * Creates a multi-layer cached tokens fetcher:
 * 1. Memory cache (unstable_cache) - fastest, per-instance
 * 2. Redis cache - persistent across instances/reboots
 * 3. Fresh data - ultimate source of truth
 */
const cachedGetTopTokens = unstableCache(
  getTopTokensWithRedis,
  ['top-tokens-cache'], // Cache key prefix for memory cache
  {
    revalidate: CACHE_DURATION,
    tags: ['top-tokens'], // For manual revalidation via On-Demand ISR
  },
)

/**
 * API Handler for Top Tokens
 *
 * Endpoint: /api/top-tokens?chainName=<chainName>
 *
 * Returns top tokens for the specified blockchain network
 * with multi-layer caching for optimal performance.
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName } = req.query

    // Validate required parameters
    if (!chainName) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Missing required parameter: chainName',
        documentation: 'https://docs.your-api.com/top-tokens#parameters',
      })
    }

    // Validate chain support
    const chainId = multiChainId[chainName.toString().toUpperCase()]
    if (!chainId) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: `Unsupported chain: ${chainName}`,
        supportedChains: Object.keys(multiChainId),
        documentation: 'https://docs.your-api.com/top-tokens#supported-chains',
      })
    }

    // Fetch data with caching
    const topTokensData = await cachedGetTopTokens(chainId)

    // Handle empty or error responses
    if (topTokensData.error || !topTokensData.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'No tokens found',
        documentation: 'https://docs.your-api.com/top-tokens#troubleshooting',
      })
    }

    // Apply cache headers for successful responses
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(topTokensData.data)
  } catch (error) {
    console.error('Top Tokens API Error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Internal server error'

    res.setHeader('Cache-Control', 'no-store')

    return res.status(500).json({
      error: 'Internal Server Error',
      message: errorMessage,
      requestId: res.getHeader('x-request-id'),
      timestamp: new Date().toISOString(),
      documentation: 'https://docs.your-api.com/top-tokens#errors',
    })
  }
}

export default handler
