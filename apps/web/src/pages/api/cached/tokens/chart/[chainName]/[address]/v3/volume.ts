import RedisClient from 'lib/redis' // Your Redis client utility
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { fetchTokenVolumeChartData } from 'queries/stats/volume'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 5 minutes fresh period (volume data changes frequently)
 * - 25 minutes stale window (for background revalidation)
 * - Redis cache with optimized storage format
 */
const CACHE_DURATION = 300 // 5 minutes in seconds
const STALE_WINDOW = 1500 // 25 minutes in seconds
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${STALE_WINDOW}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * Redis-backed Token Volume Data fetcher with optimized caching strategy
 */
const getTokenVolumeChartDataWithRedis = async (
  address: string,
  chainId: number,
  period?: '1D' | '1W' | '1M' | '6M' | '1Y',
) => {
  const normalizedAddress = address.toLowerCase()
  const cacheKey = `token-volume:${chainId}:${normalizedAddress}:${period || 'default'}`

  try {
    const result = await RedisClient.getWithFallback(cacheKey, async () => {
      const freshData = await fetchTokenVolumeChartData(normalizedAddress, chainId, period)
      if (freshData.error) throw new Error('Failed to fetch fresh TOKEN Volume chart data')

      // Optimize volume data storage by reducing precision and removing unnecessary fields
      const optimizedData = optimizeVolumeData(freshData.data)
      return optimizedData
    })

    return {
      data: result ? restoreVolumeData(result.data) : null,
      error: null,
      isCached: false,
    }
  } catch (error) {
    console.error('Token volume cache error:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Cache failed',
      isCached: false,
    }
  }
}

// Optimize volume data by reducing precision and removing unnecessary fields
function optimizeVolumeData(data: any) {
  if (!data || !data.seriesData) return data

  return {
    ...data,
    seriesData: data.seriesData.map((point: any) => ({
      time: point.time,
      // Reduce to 2 decimal places for volume values
      value: parseFloat(point.value.toFixed(2)),
    })),
  }
}

function restoreVolumeData(data: any) {
  return data // No transformation needed when restoring
}

/**
 * Multi-layer cached Token Volume Data fetcher
 */
const cachedFetchTokenVolumeChartData = unstableCache(getTokenVolumeChartDataWithRedis, ['token-volume-chart'], {
  revalidate: CACHE_DURATION,
  tags: ['token-volume'],
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
        documentation: 'https://docs.your-api.com/token-volume#parameters',
      })
    }

    const chainId = multiChainId[chainName.toString().toUpperCase()]
    if (!chainId) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Unsupported chain',
        supportedChains: Object.keys(multiChainId),
        documentation: 'https://docs.your-api.com/token-volume#supported-chains',
      })
    }

    if (typeof address !== 'string' || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Invalid token address',
        expectedFormat: '0x followed by 40 hexadecimal characters',
        documentation: 'https://docs.your-api.com/token-volume#address-format',
      })
    }

    const validPeriods = ['1D', '1W', '1M', '6M', '1Y', undefined]
    if (period && !validPeriods.includes(period as string)) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Invalid time period',
        validPeriods: validPeriods.filter((p) => p !== undefined),
        documentation: 'https://docs.your-api.com/token-volume#time-periods',
      })
    }

    // Fetch with caching
    const { data, error, isCached } = await cachedFetchTokenVolumeChartData(
      address as string,
      chainId,
      period as '1D' | '1W' | '1M' | '6M' | '1Y' | undefined,
    )

    if (error || !data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: error || 'Volume data not available',
        documentation: 'https://docs.your-api.com/token-volume#troubleshooting',
        retryAfter: CACHE_DURATION,
      })
    }

    // Set cache headers
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(data)
  } catch (error) {
    console.error('Token volume API error:', error)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({
      error: 'Internal server error',
      requestId: res.getHeader('x-request-id'),
      timestamp: new Date().toISOString(),
      documentation: 'https://docs.your-api.com/token-volume#errors',
    })
  }
}

export default handler
