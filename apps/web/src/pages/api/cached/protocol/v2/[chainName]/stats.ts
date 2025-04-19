import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { getOverviewData } from 'queries/stats/v2/overview'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 1 minute fresh period (60 seconds) - balances freshness with performance
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
 * Redis-backed overview data fetcher with fallback strategy
 */
const getOverviewDataWithRedis = async (chainId: number) => {
  const cacheKey = `overview-data-v2:${chainId}`

  try {
    const result = await RedisClient.getWithFallback(
      cacheKey,
      async () => {
        const overviewData = await getOverviewData(chainId)

        if (overviewData.error) {
          throw new Error('Failed to fetch overview data')
        }

        return overviewData
      },
      CACHE_DURATION,
    )

    return result.data
  } catch (error) {
    console.error('Redis cache operation failed:', error)
    return {
      data: null,
      error: {
        message: 'Failed to fetch overview data with cache fallback',
      },
    }
  }
}

/**
 * Multi-layer cached overview data fetcher
 */
const cachedFetchOverviewData = unstableCache(getOverviewDataWithRedis, ['overview-data-v2'], {
  revalidate: CACHE_DURATION,
  tags: ['overview-data-v2'],
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
    const overviewData = await cachedFetchOverviewData(chainId)

    if (overviewData.error || !overviewData.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'Overview data not found',
        details: 'No overview data available for this chain',
        documentation: 'https://docs.your-api.com/errors/no-overview-data',
      })
    }

    // ----------------------------
    // Response Preparation
    // ----------------------------
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(overviewData.data)
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
