import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { fetchTokenPriceChartData } from 'queries/stats/v2/price'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 5 minutes fresh period (300 seconds) - longer TTL suitable for price data
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
 * Redis-backed price data fetcher with fallback strategy
 */
const getTokenPriceChartDataWithRedis = async (
  address: string,
  chainId: number,
  period?: '1D' | '1W' | '1M' | '6M' | '1Y',
) => {
  const cacheKey = `token-price-v2:${chainId}:${address.toLowerCase()}:${period || 'default'}`

  try {
    const result = await RedisClient.getWithFallback(cacheKey, async () => {
      const priceData = await fetchTokenPriceChartData(address.toLowerCase(), chainId, period)

      if (priceData.error) {
        throw new Error('Failed to fetch price data')
      }

      return priceData
    })

    return result.data
  } catch (error) {
    console.error('Redis cache operation failed:', error)
    return {
      data: null,
      error: {
        message: 'Failed to fetch price data with cache fallback',
      },
    }
  }
}

/**
 * Multi-layer cached price data fetcher
 */
const cachedFetchTokenPriceChartData = unstableCache(getTokenPriceChartDataWithRedis, ['token-price-chart-v2'], {
  revalidate: CACHE_DURATION,
  tags: ['token-price-v2'],
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
    const priceData = await cachedFetchTokenPriceChartData(address, chainId, period)

    if (priceData.error || !priceData.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'Price data not found',
        details: 'No price data available for this token',
        documentation: 'https://docs.your-api.com/errors/no-price-data',
      })
    }

    // ----------------------------
    // Response Preparation
    // ----------------------------
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(priceData.data)
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
