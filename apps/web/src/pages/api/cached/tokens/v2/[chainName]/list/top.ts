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
 * Redis-backed top tokens fetcher with fallback strategy
 */
const getTopTokensWithRedis = async (chainId: number) => {
  const cacheKey = `top-tokens-v2:${chainId}`

  try {
    const result = await RedisClient.getWithFallback(
      cacheKey,
      async () => {
        const tokensData = await fetchTopTokens(undefined, chainId)

        if (tokensData.error) {
          throw new Error('Failed to fetch top tokens')
        }

        return tokensData
      },
      CACHE_DURATION,
    )

    return result.data
  } catch (error) {
    console.error('Redis cache operation failed:', error)
    return {
      data: null,
      error: {
        message: 'Failed to fetch top tokens with cache fallback',
      },
    }
  }
}

/**
 * Multi-layer cached top tokens fetcher
 */
const cachedFetchTopTokens = unstableCache(getTopTokensWithRedis, ['top-tokens-v2'], {
  revalidate: CACHE_DURATION,
  tags: ['top-tokens-v2'],
})

const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName } = req.query as {
      chainName: string
    }

    // ----------------------------
    // Input Validation
    // ----------------------------
    if (!chainName) {
      return res.status(400).json({
        error: 'Missing required parameter: chainName is required',
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

    // ----------------------------
    // Data Fetching with Caching
    // ----------------------------
    const tokensData = await cachedFetchTopTokens(chainId)

    if (tokensData.error || !tokensData.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'Top tokens data not found',
        details: 'No token data available for this chain',
        documentation: 'https://docs.your-api.com/errors/no-tokens-data',
      })
    }

    // ----------------------------
    // Response Preparation
    // ----------------------------
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(tokensData.data)
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
