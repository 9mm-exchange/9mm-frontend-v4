import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { fetchPoolVolumeChartData } from 'queries/stats/v2/volume'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 5 minutes fresh period (300 seconds)
 * - 25 minutes stale window (1500 seconds)
 * - Redis cache as persistent fallback
 */
const CACHE_DURATION = 300 // 5 minutes in seconds
const STALE_WINDOW = 1500 // 25 minutes in seconds
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${STALE_WINDOW}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * Redis-backed volume data fetcher with fallback strategy
 */
const getPoolVolumeChartDataWithRedis = async (
  address: string,
  chainId: number,
  period?: '1D' | '1W' | '1M' | '6M' | '1Y',
) => {
  const cacheKey = `pool-volume-v2:${chainId}:${address.toLowerCase()}:${period || 'default'}`

  try {
    const result = await RedisClient.getWithFallback(
      cacheKey,
      async () => {
        const freshData = await fetchPoolVolumeChartData(address.toLowerCase(), chainId, period)

        if (freshData.error) {
          throw new Error('Failed to fetch fresh volume data')
        }

        return freshData
      },
      CACHE_DURATION,
    )

    return result.data
  } catch (error) {
    console.error('Redis cache operation failed:', error)
    return { data: null, error: 'Failed to fetch volume data with cache fallback' }
  }
}

/**
 * Multi-layer cached volume data fetcher
 */
const cachedFetchPoolVolumeChartData = unstableCache(getPoolVolumeChartDataWithRedis, ['pool-volume-chart-v2'], {
  revalidate: CACHE_DURATION,
  tags: ['pool-volume-v2'],
})

const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, address, period } = req.query

    // ----------------------------
    // Input Validation
    // ----------------------------
    if (!chainName || !address) {
      return res.status(400).json({
        error: 'Missing required parameters: chainName and address are required',
      })
    }

    const chainId = multiChainId[(chainName as string).toUpperCase()]
    if (!chainId) {
      return res.status(400).json({
        error: 'Invalid chain name',
        supportedChains: Object.keys(multiChainId),
      })
    }

    if (typeof address !== 'string' || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({
        error: 'Invalid pool address format',
        expectedFormat: '0x followed by 40 hexadecimal characters',
      })
    }

    const validPeriods = ['1D', '1W', '1M', '6M', '1Y', undefined]
    if (period && !validPeriods.includes(period as string)) {
      return res.status(400).json({
        error: 'Invalid period parameter',
        validPeriods: validPeriods.filter((p) => p !== undefined),
      })
    }

    // ----------------------------
    // Data Fetching with Caching
    // ----------------------------
    const volumeData = await cachedFetchPoolVolumeChartData(
      address as string,
      chainId,
      period as '1D' | '1W' | '1M' | '6M' | '1Y' | undefined,
    )

    if (volumeData.error || !volumeData.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'Volume data not found',
        details: volumeData.error || 'No volume data available for this pool',
      })
    }

    // ----------------------------
    // Response Preparation
    // ----------------------------
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(volumeData.data)
  } catch (error) {
    console.error('API Route Error:', error)
    res.setHeader('Cache-Control', 'no-store, max-age=0')

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    return res.status(500).json({
      error: 'Internal Server Error',
      details: errorMessage,
      documentation: 'https://docs.your-api.com/errors/pool-volume-data',
    })
  }
}

export default handler
