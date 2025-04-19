import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { fetchTopTransactions } from 'queries/transactions'
import { fetchPoolTransactions } from 'queries/transactions/pool'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 5 minutes fresh period (transactions data updates frequently but still benefits from caching)
 * - 5 minutes stale window (for background revalidation)
 */
const CACHE_DURATION = 300 // 5 minutes in seconds
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * Fetches recent transactions with Redis fallback caching:
 * 1. Attempts to fetch fresh data first
 * 2. Falls back to Redis cache if fresh fetch fails
 * 3. Returns error if both attempts fail
 *
 * @param chainId - Blockchain network ID
 * @param token - Optional token address filter (case-insensitive)
 * @returns Transactions data with error state
 */
const getRecentTransactionsWithRedis = async (chainId: number, token?: string, pool?: string) => {
  const normalizedAddress = token?.toLowerCase() || pool?.toLowerCase()
  const cacheKey = `transactions:${chainId}:${normalizedAddress || 'all'}`

  const { data } = await RedisClient.getWithFallback(
    cacheKey,
    async () => {
      const freshData = pool
        ? await fetchPoolTransactions(chainId, normalizedAddress)
        : await fetchTopTransactions(chainId, normalizedAddress)
      if (freshData.error) {
        throw new Error('Failed to fetch transactions data')
      }
      return freshData
    },
    CACHE_DURATION,
  )
  return data
}

/**
 * Creates a multi-layer cached transactions fetcher:
 * 1. Memory cache (unstable_cache) - fastest, per-instance
 * 2. Redis cache - persistent across instances/reboots
 * 3. Fresh data - ultimate source of truth
 */
const cachedGetTransactions = unstableCache(
  getRecentTransactionsWithRedis,
  ['transactions-cache'], // Cache key prefix for memory cache
  {
    revalidate: CACHE_DURATION,
    tags: ['transactions'], // For manual revalidation via On-Demand ISR
  },
)

/**
 * API Handler for Recent Transactions
 *
 * Endpoint: /api/transactions?chainName=<chainName>&token=<tokenAddress>
 *
 * Returns recent transactions for the specified blockchain network,
 * optionally filtered by token address, with multi-layer caching.
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, token, pool } = req.query as {
      chainName: string
      token?: string
      pool?: string
    }

    // Validate required parameters
    if (!chainName) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Missing required parameter: chainName',
        documentation: 'https://docs.your-api.com/transactions#parameters',
      })
    }

    // Validate chain support
    const chainId = multiChainId[chainName.toUpperCase()]
    if (!chainId) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: `Unsupported chain: ${chainName}`,
        supportedChains: Object.keys(multiChainId),
        documentation: 'https://docs.your-api.com/transactions#supported-chains',
      })
    }

    // Fetch data with caching
    const transactionsData = await cachedGetTransactions(chainId, token, pool)

    // Handle empty or error responses
    if (transactionsData.error || !transactionsData.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'No transactions found',
        documentation: 'https://docs.your-api.com/transactions#troubleshooting',
      })
    }

    // Apply cache headers for successful responses
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(transactionsData.data)
  } catch (error) {
    console.error('Transactions API Error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Internal server error'

    res.setHeader('Cache-Control', 'no-store')

    return res.status(500).json({
      error: 'Internal Server Error',
      message: errorMessage,
      requestId: res.getHeader('x-request-id'),
      timestamp: new Date().toISOString(),
      documentation: 'https://docs.your-api.com/transactions#errors',
    })
  }
}

export default handler
