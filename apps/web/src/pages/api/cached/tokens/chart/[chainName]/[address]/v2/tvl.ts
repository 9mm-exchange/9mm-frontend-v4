import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { fetchTokenTvlChartData } from 'queries/stats/v2/tvl'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 5 minutes fresh period (300 seconds) - suitable for TVL data
 * - 25 minutes stale window (1500 seconds)
 * - Redis cache as persistent fallback
 */
const CACHE_DURATION = 300
const STALE_WINDOW = 1500
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${STALE_WINDOW}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * Redis-backed TVL data fetcher with fallback strategy
 */
const getTokenTvlChartDataWithRedis = async (
  address: string,
  chainId: number,
  period?: '1D' | '1W' | '1M' | '6M' | '1Y',
) => {
  const cacheKey = `token-tvl-v2:${chainId}:${address.toLowerCase()}:${period || 'default'}`

  try {
    const result = await RedisClient.getWithFallback(
      cacheKey,
      async () => {
        const tvlData = await fetchTokenTvlChartData(address.toLowerCase(), chainId, period)

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
const cachedFetchTokenTvlChartData = unstableCache(getTokenTvlChartDataWithRedis, ['token-tvl-chart-v2'], {
  revalidate: CACHE_DURATION,
  tags: ['token-tvl-v2'],
})

const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, address, period } = req.query as {
      chainName: string
      address: string
      period?: '1D' | '1W' | '1M' | '6M' | '1Y'
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

    const validPeriods = ['1D', '1W', '1M', '6M', '1Y', undefined]
    if (period && !validPeriods.includes(period)) {
      return res.status(400).json({
        error: 'Invalid period parameter',
        validPeriods: validPeriods.filter((p) => p !== undefined),
        documentation: 'https://docs.your-api.com/errors/invalid-period',
      })
    }

    // ----------------------------
    // Data Fetching with Caching
    // ----------------------------
    const tvlData = await cachedFetchTokenTvlChartData(address, chainId, period)

    if (tvlData.error || !tvlData.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'TVL data not found',
        details: 'No TVL data available for this token',
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
