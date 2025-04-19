import RedisClient from 'lib/redis' // Your Redis client utility
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { fetchTokenTvlChartData } from 'queries/stats/tvl'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 15 minutes fresh period (TVL data changes less frequently than price)
 * - 60 minutes stale window (for background revalidation)
 * - Redis cache with optimized storage
 */
const CACHE_DURATION = 900 // 15 minutes in seconds
const STALE_WINDOW = 900 // 15 minutes in seconds
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${STALE_WINDOW}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * Redis-backed Token TVL Data fetcher with optimized caching strategy
 */
const getTokenTvlChartDataWithRedis = async (
  address: string,
  chainId: number,
  period?: '1D' | '1W' | '1M' | '6M' | '1Y',
) => {
  const normalizedAddress = address.toLowerCase()
  const cacheKey = `token-tvl:${chainId}:${normalizedAddress}:${period || 'default'}`

  try {
    const result = await RedisClient.getWithFallback(
      cacheKey,
      async () => {
        const freshData = await fetchTokenTvlChartData(normalizedAddress, chainId, period)
        if (freshData.error) throw new Error('Failed to fetch fresh TOKEN TVL chart data')

        // Optimize TVL data storage by reducing precision
        const optimizedData = optimizeTvlData(freshData.data)
        return optimizedData
      },
      CACHE_DURATION,
    )

    return {
      data: result ? restoreTvlData(result.data) : null,
      error: null,
      isCached: false,
    }
  } catch (error) {
    console.error('Token TVL cache error:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Cache failed',
      isCached: false,
    }
  }
}

// Optimize TVL data by reducing precision to save space
function optimizeTvlData(data: any) {
  if (!data || !data.seriesData) return data

  return {
    ...data,
    seriesData: data.seriesData.map((point: any) => ({
      ...point,
      // Reduce to 4 decimal places
      value: parseFloat(point.value.toFixed(4)),
    })),
  }
}

function restoreTvlData(data: any) {
  return data // No transformation needed when restoring
}

/**
 * Multi-layer cached Token TVL Data fetcher
 */
const cachedFetchTokenTvlChartData = unstableCache(getTokenTvlChartDataWithRedis, ['token-tvl-chart'], {
  revalidate: CACHE_DURATION,
  tags: ['token-tvl'],
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
        documentation: 'https://docs.your-api.com/token-tvl#parameters',
      })
    }

    const chainId = multiChainId[chainName.toString().toUpperCase()]
    if (!chainId) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Unsupported chain',
        supportedChains: Object.keys(multiChainId),
        documentation: 'https://docs.your-api.com/token-tvl#supported-chains',
      })
    }

    if (typeof address !== 'string' || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Invalid token address',
        expectedFormat: '0x followed by 40 hexadecimal characters',
        documentation: 'https://docs.your-api.com/token-tvl#address-format',
      })
    }

    const validPeriods = ['1D', '1W', '1M', '6M', '1Y', undefined]
    if (period && !validPeriods.includes(period as string)) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Invalid time period',
        validPeriods: validPeriods.filter((p) => p !== undefined),
        documentation: 'https://docs.your-api.com/token-tvl#time-periods',
      })
    }

    // Fetch with caching
    const { data, error, isCached } = await cachedFetchTokenTvlChartData(
      address as string,
      chainId,
      period as '1D' | '1W' | '1M' | '6M' | '1Y' | undefined,
    )

    if (error || !data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: error || 'TVL data not available',
        documentation: 'https://docs.your-api.com/token-tvl#troubleshooting',
        retryAfter: CACHE_DURATION,
      })
    }

    // Set cache headers
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(data)
  } catch (error) {
    console.error('Token TVL API error:', error)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({
      error: 'Internal server error',
      requestId: res.getHeader('x-request-id'),
      timestamp: new Date().toISOString(),
      documentation: 'https://docs.your-api.com/token-tvl#errors',
    })
  }
}

export default handler
