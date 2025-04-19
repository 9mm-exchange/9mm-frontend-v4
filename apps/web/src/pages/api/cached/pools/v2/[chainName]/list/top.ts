import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { getPoolsData } from 'queries/pools/v2'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 1 minute fresh period (60 seconds) - shorter TTL for frequently changing pool data
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
 * Redis-backed pool data fetcher with fallback strategy
 */
const getPoolsDataWithRedis = async (chainId: number, tokenAddress?: string) => {
  const cacheKey = `v2-pools:${chainId}:${tokenAddress?.toLowerCase() || 'all'}`

  try {
    const result = await RedisClient.getWithFallback(
      cacheKey,
      async () => {
        const poolsData = await getPoolsData(chainId, tokenAddress?.toLowerCase())

        if (poolsData.error) {
          throw new Error('Failed to fetch pools data')
        }

        return poolsData
      },
      CACHE_DURATION,
    )

    return result.data
  } catch (error) {
    console.error('Redis cache operation failed:', error)
    return {
      data: null,
      error: {
        message: 'Failed to fetch pools data with cache fallback',
      },
    }
  }
}

/**
 * Multi-layer cached pools data fetcher
 */
const cachedFetchPoolsData = unstableCache(getPoolsDataWithRedis, ['v2-pools-data'], {
  revalidate: CACHE_DURATION,
  tags: ['v2-pools'],
})

const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, token } = req.query as {
      chainName: string
      token?: string
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

    if (token && !token.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({
        error: 'Invalid token address format',
        expectedFormat: '0x followed by 40 hexadecimal characters',
        documentation: 'https://docs.your-api.com/errors/invalid-token-format',
      })
    }

    // ----------------------------
    // Data Fetching with Caching
    // ----------------------------
    const poolsData = await cachedFetchPoolsData(chainId, token?.toLowerCase())

    if (poolsData.error || !poolsData.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'Pools data not found',
        details: 'No pools available for this query',
        documentation: 'https://docs.your-api.com/errors/no-pools-data',
      })
    }

    // ----------------------------
    // Response Preparation
    // ----------------------------
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(poolsData.data)
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
