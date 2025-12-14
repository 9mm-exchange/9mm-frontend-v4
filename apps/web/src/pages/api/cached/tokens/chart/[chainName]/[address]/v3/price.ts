import RedisClient from 'lib/redis' // Your Redis client utility
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { fetchTokenPriceChartData } from 'queries/stats/price'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 15 minutes fresh period (price data changes frequently but not drastically)
 * - 15 minutes stale window (for background revalidation)
 * - Redis cache with compressed data storage
 */
const CACHE_DURATION = 900 // 15 minutes in seconds
const STALE_WINDOW = 900 // 15 minutes in seconds
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${STALE_WINDOW}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * Redis-backed Price Data fetcher with optimized caching strategy
 */
const getTokenPriceChartDataWithRedis = async (
  address: string,
  chainId: number,
  period?: '1D' | '1W' | '1M' | '6M' | '1Y',
) => {
  const cacheKey = `token-price:${chainId}:${address.toLowerCase()}:${period || 'default'}`

  try {
    const result = await RedisClient.getWithFallback(cacheKey, async () => {
      const freshData = await fetchTokenPriceChartData(address.toLowerCase(), chainId, period)
      if (freshData.error) throw new Error('Failed to fetch fresh token chart data')

      return freshData.data
    })

    // Decompress the data before returning
    return {
      data: result.data || null,
      error: null,
    }
  } catch (error) {
    console.error('Token price cache error:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Cache failed',
    }
  }
}

/**
 * Multi-layer cached Price Data fetcher
 */
const cachedFetchTokenPriceChartData = unstableCache(getTokenPriceChartDataWithRedis, ['token-price-chart'], {
  revalidate: CACHE_DURATION,
  tags: ['token-price'],
})

const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, address, period } = req.query

    // Validate input
    if (!chainName || !address) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['chainName', 'address'],
        documentation: 'https://docs.your-api.com/token-price#parameters',
      })
    }

    const chainId = multiChainId[chainName.toString().toUpperCase()]
    if (!chainId) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Unsupported chain',
        supportedChains: Object.keys(multiChainId),
        documentation: 'https://docs.your-api.com/token-price#supported-chains',
      })
    }

    if (typeof address !== 'string' || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Invalid token address',
        expectedFormat: '0x followed by 40 hexadecimal characters',
        documentation: 'https://docs.your-api.com/token-price#address-format',
      })
    }

    const validPeriods = ['1D', '1W', '1M', '6M', '1Y', undefined]
    if (period && !validPeriods.includes(period as string)) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Invalid time period',
        validPeriods: validPeriods.filter((p) => p !== undefined),
        documentation: 'https://docs.your-api.com/token-price#time-periods',
      })
    }

    // Fetch with caching
    const { data, error } = await cachedFetchTokenPriceChartData(
      address as string,
      chainId,
      period as '1D' | '1W' | '1M' | '6M' | '1Y' | undefined,
    )

    if (error || !data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: error || 'Price data not available',
        documentation: 'https://docs.your-api.com/token-price#troubleshooting',
        retryAfter: CACHE_DURATION,
      })
    }

    // Set cache headers
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(data)
  } catch (error) {
    console.error('Token price API error:', error)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({
      error: 'Internal server error',
      requestId: res.getHeader('x-request-id'),
      timestamp: new Date().toISOString(),
      documentation: 'https://docs.your-api.com/token-price#errors',
    })
  }
}

export default handler
