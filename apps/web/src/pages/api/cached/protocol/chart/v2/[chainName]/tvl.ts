import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { fetchTvlChartData } from 'queries/stats/v2/tvl'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 1 minute fresh period (60 seconds) - suitable for frequently changing TVL data
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
 * Redis-backed TVL data fetcher with fallback strategy
 */
const getTvlChartDataWithRedis = async (chainId: number) => {
  const cacheKey = `tvl-chart-v2:${chainId}`

  try {
    const result = await RedisClient.getWithFallback(
      cacheKey,
      async () => {
        const tvlData = await fetchTvlChartData(chainId)

        if (tvlData.error) {
          throw new Error('Failed to fetch TVL data')
        }

        return tvlData
      },
      CACHE_DURATION,
    )

    return result.data
  } catch (error) {
    console.error('Redis cache operation failed:', error)
    return {
      data: null,
      error: {
        message: 'Failed to fetch TVL data with cache fallback',
      },
    }
  }
}

/**
 * Multi-layer cached TVL data fetcher
 */
const cachedFetchTvlChartData = unstableCache(getTvlChartDataWithRedis, ['tvl-chart-data-v2'], {
  revalidate: CACHE_DURATION,
  tags: ['tvl-chart-v2'],
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
    const tvlData = await cachedFetchTvlChartData(chainId)

    if (tvlData.error || !tvlData.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'TVL data not found',
        details: 'No TVL data available for this chain',
        documentation: 'https://docs.your-api.com/errors/no-tvl-data',
      })
    }

    // ----------------------------
    // Response Preparation
    // ----------------------------
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(tvlData.data)
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
