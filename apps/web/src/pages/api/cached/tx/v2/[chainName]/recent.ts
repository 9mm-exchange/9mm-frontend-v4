import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { fetchTopTransactions } from 'queries/transactions/v2'
import { fetchPoolTransactions } from 'queries/transactions/v2/pool'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 1 minute fresh period (60 seconds) - suitable for frequently changing transaction data
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
 * Redis-backed transactions data fetcher with fallback strategy
 */
const getTransactionsDataWithRedis = async (chainId: number, tokenAddress?: string, pool?: string) => {
  const normalizedAddress = tokenAddress?.toLowerCase() || pool?.toLowerCase()
  const cacheKey = `transactions-v2:${chainId}:${normalizedAddress || 'all'}`

  try {
    const result = await RedisClient.getWithFallback(cacheKey, async () => {
      const transactionsData = pool
        ? await fetchPoolTransactions(chainId, normalizedAddress)
        : await fetchTopTransactions(chainId, normalizedAddress)

      if (transactionsData.error) {
        throw new Error('Failed to fetch transactions data')
      }

      return transactionsData
    })

    return result.data
  } catch (error) {
    console.error('Redis cache operation failed:', error)
    return {
      data: null,
      error: {
        message: 'Failed to fetch transactions data with cache fallback',
      },
    }
  }
}

/**
 * Multi-layer cached transactions data fetcher
 */
const cachedFetchTransactionsData = unstableCache(getTransactionsDataWithRedis, ['transactions-data-v2'], {
  revalidate: CACHE_DURATION,
  tags: ['transactions-v2'],
})

const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, token, pool } = req.query as {
      chainName: string
      token?: string
      pool?: string
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

    if (token && !token.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({
        error: 'Invalid token address format',
        expectedFormat: '0x followed by 40 hexadecimal characters',
        documentation: 'https://docs.your-api.com/errors/invalid-token-format',
      })
    }

    // ----------------------------
    // Data Fetching with Caching
    // ----------------------------
    const transactionsData = await cachedFetchTransactionsData(chainId, token?.toLowerCase(), pool?.toLowerCase())

    if (transactionsData.error || !transactionsData.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'Transactions data not found',
        details: 'No transactions available',
        documentation: 'https://docs.your-api.com/errors/no-transactions-data',
      })
    }

    // ----------------------------
    // Response Preparation
    // ----------------------------
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    return res.status(200).json(transactionsData.data)
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
