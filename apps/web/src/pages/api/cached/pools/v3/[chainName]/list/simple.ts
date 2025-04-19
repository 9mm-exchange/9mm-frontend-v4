import RedisClient from 'lib/redis' // Your Redis client utility
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { getPoolsDataByAddresses } from 'queries/pools'
import { createToken, getPoolsWithLiquidityByFeeTiers } from 'queries/pools/fee'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 5 minutes fresh period (CACHE_DURATION)
 * - 1 minute stale window (for background revalidation)
 * - Redis cache as persistent fallback
 */
const CACHE_DURATION = 60 // 1 minutes in seconds
const STALE_WINDOW = 60 // 1 minute in seconds
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${STALE_WINDOW}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * Redis-backed data fetchers with fallback caching strategy
 */

// For pools with liquidity data
const getPoolsWithLiquidityWithRedis = async (tokenA: any, tokenB: any, chainId: number) => {
  const cacheKey = `pools-liquidity:${chainId}:${tokenA.address}:${tokenB.address}`

  try {
    const result = await RedisClient.getWithFallback(
      cacheKey,
      async () => {
        const freshData = await getPoolsWithLiquidityByFeeTiers(tokenA, tokenB, chainId)
        return freshData.map((address) => address.toLowerCase())
      },
      CACHE_DURATION,
    )
    return { data: result.data, error: false }
  } catch (error) {
    console.error('Redis cache operation failed:', error)
    return { data: [], error: true }
  }
}

const getPoolsDataWithRedis = async (chainId: number, addresses: string[]) => {
  const cacheKey = `pools-detail:${chainId}:${addresses.sort().join(',')}`

  const { data, fromCache } = await RedisClient.getWithFallback(
    cacheKey,
    async () => {
      const freshData = await getPoolsDataByAddresses(chainId, addresses)
      if (freshData.error) {
        throw new Error('Error in fetching pool data')
      }

      return freshData
    },
    CACHE_DURATION,
  )

  return data
}

/**
 * Multi-layer cached data fetchers
 */
const cachedGetPoolsWithLiquidity = unstableCache(getPoolsWithLiquidityWithRedis, ['pools-with-liquidity'], {
  revalidate: CACHE_DURATION,
  tags: ['pools-liquidity'],
})

const cachedGetPoolsData = unstableCache(getPoolsDataWithRedis, ['pools-data'], {
  revalidate: CACHE_DURATION,
  tags: ['pools-data'],
})

const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, token0, token1 } = req.query

    // ----------------------------
    // Input Validation
    // ----------------------------

    // Validate required parameters
    if (!chainName || !token0 || !token1) {
      return res.status(400).json({
        error: 'Missing required parameters: chainName, token0 and token1 are required',
        documentation: 'https://docs.your-api.com/endpoints/pools-liquidity#required-parameters',
      })
    }

    // Validate and get chain ID
    const chainId = multiChainId[(chainName as string).toUpperCase()]
    if (!chainId) {
      return res.status(400).json({
        error: 'Invalid chain name',
        supportedChains: Object.keys(multiChainId),
        documentation: 'https://docs.your-api.com/endpoints/pools-liquidity#supported-chains',
      })
    }

    // Validate token address format
    if (
      typeof token0 !== 'string' ||
      !token0.match(/^0x[a-fA-F0-9]{40}$/) ||
      typeof token1 !== 'string' ||
      !token1.match(/^0x[a-fA-F0-9]{40}$/)
    ) {
      return res.status(400).json({
        error: 'Invalid token address format',
        expectedFormat: '0x followed by 40 hexadecimal characters',
        documentation: 'https://docs.your-api.com/endpoints/pools-liquidity#token-format',
      })
    }

    // ----------------------------
    // Data Processing
    // ----------------------------

    // Create tokens (uncached as these are simple transformations)
    const tokenA = createToken(chainId, token0 as string, 18, '')
    const tokenB = createToken(chainId, token1 as string, 6, '')

    // ----------------------------
    // Data Fetching with Caching
    // ----------------------------

    // Fetch pools with liquidity
    const liquidityResults = await cachedGetPoolsWithLiquidity(tokenA, tokenB, chainId)

    if (liquidityResults.error || !liquidityResults.data?.length) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'No pools found with liquidity',
        details: liquidityResults.error || 'No liquidity pools for this token pair',
        documentation: 'https://docs.your-api.com/endpoints/pools-liquidity#no-liquidity',
      })
    }

    // Fetch detailed pools data
    const poolsData = await cachedGetPoolsData(chainId, liquidityResults.data)

    if (poolsData.error || !poolsData.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'Pools data not found',
        details: poolsData.error || 'No detailed data available for these pools',
        documentation: 'https://docs.your-api.com/endpoints/pools-liquidity#no-pool-data',
      })
    }

    // ----------------------------
    // Response Preparation
    // ----------------------------

    // Set cache headers for successful responses
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json({
      startCursor: 'dHZsVVNEPTIyMTgwNjguMzE0MDg0NzQzNg',
      endCursor: 'dHZsVVNEPTUyOC44MjkzNDcxOTk1OTY5',
      hasNextPage: false,
      rows: poolsData.data,
    })
  } catch (error) {
    // ----------------------------
    // Error Handling
    // ----------------------------
    console.error('API Route Error:', error)

    // Ensure error responses aren't cached
    res.setHeader('Cache-Control', 'no-store, max-age=0')

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    return res.status(500).json({
      error: 'Internal Server Error',
      details: errorMessage,
      documentation: 'https://docs.your-api.com/endpoints/pools-liquidity#server-errors',
      requestId: res.getHeader('x-request-id'),
    })
  }
}

export default handler
