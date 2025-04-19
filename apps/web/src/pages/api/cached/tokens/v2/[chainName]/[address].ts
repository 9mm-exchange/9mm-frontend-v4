import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { fetchTopTokens } from 'queries/tokens/v2'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 1 minute fresh period (60 seconds) - suitable for frequently changing token data
 * - 5 minutes stale window (300 seconds)
 * - Redis cache as persistent fallback
 */
const CACHE_DURATION = 60
const STALE_WINDOW = 300
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${STALE_WINDOW}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * Redis-backed token data fetcher with fallback strategy
 */
const getTokenDataWithRedis = async (address: string, chainId: number) => {
  const cacheKey = `token-data-v2:${chainId}:${address.toLowerCase()}`

  try {
    const result = await RedisClient.getWithFallback(
      cacheKey,
      async () => {
        const tokenData = await fetchTopTokens(address.toLowerCase(), chainId)

        if (tokenData.error || !tokenData.data?.[0]) {
          throw new Error('Token data not found')
        }

        return {
          data: tokenData.data[0],
          error: null,
        }
      },
      CACHE_DURATION,
    )

    return result.data
  } catch (error) {
    console.error('Redis cache operation failed:', error)
    return {
      data: null,
      error: {
        message: 'Failed to fetch token data with cache fallback',
      },
    }
  }
}

/**
 * Multi-layer cached token data fetcher
 */
const cachedFetchTokenData = unstableCache(getTokenDataWithRedis, ['token-data-v2'], {
  revalidate: CACHE_DURATION,
  tags: ['token-data-v2'],
})

const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, address } = req.query as {
      chainName: string
      address: string
    }

    // ----------------------------
    // Input Validation
    // ----------------------------
    if (!chainName || !address) {
      return res.status(400).json({
        error: 'Missing required parameters: chainName and address are required',
        documentation: 'https://docs.your-api.com/errors/missing-parameters',
      })
    }

    const chainId = multiChainId[chainName.toUpperCase()]
    if (!chainId) {
      return res.status(400).json({
        error: 'Invalid chain name',
        supportedChains: Object.keys(multiChainId),
        documentation: 'https://docs.your-api.com/errors/invalid-chain',
      })
    }

    if (typeof address !== 'string' || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({
        error: 'Invalid token address format',
        expectedFormat: '0x followed by 40 hexadecimal characters',
        documentation: 'https://docs.your-api.com/errors/invalid-token-format',
      })
    }

    // ----------------------------
    // Data Fetching with Caching
    // ----------------------------
    const tokenData = await cachedFetchTokenData(address.toLowerCase(), chainId)

    if (tokenData.error || !tokenData.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'Token data not found',
        details: 'No data available for this token',
        documentation: 'https://docs.your-api.com/errors/no-token-data',
      })
    }

    // ----------------------------
    // Response Preparation
    // ----------------------------
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(tokenData.data)
  } catch (error) {
    console.error('API Route Error:', error)
    res.setHeader('Cache-Control', 'no-store, max-age=0')

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    return res.status(500).json({
      error: 'Internal Server Error',
      details: errorMessage,
      documentation: 'https://docs.your-api.com/errors/internal-server-error',
    })
  }
}

export default handler
