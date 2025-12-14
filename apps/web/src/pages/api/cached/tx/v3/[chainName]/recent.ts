import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { fetchTopTransactions } from 'queries/transactions'
import { fetchPoolTransactions } from 'queries/transactions/pool'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 5 minutes TTL for cached data
 */
const CACHE_DURATION = 300
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * API Handler for Recent Transactions
 *
 * Endpoint: /api/cached/tx/v3/[chainName]/recent
 *
 * Cache-first approach:
 * 1. Returns cached data immediately if available in Redis
 * 2. If not cached, fetches live data, caches it, and returns it
 * 3. After returning response, refreshes cache in background to keep it up-to-date
 *
 * Cache key format: tx/v3/{chainName}/recent -> tx-v3-{chainName}-recent
 * With token/pool: tx/v3/{chainName}/recent/{token|pool} -> tx-v3-{chainName}-recent-{token|pool}
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, token, pool } = req.query as {
      chainName: string
      token?: string
      pool?: string
    }

    if (!chainName) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Missing required parameter: chainName',
      })
    }

    const chainId = multiChainId[chainName.toUpperCase()]
    if (!chainId) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: `Unsupported chain: ${chainName}`,
        supportedChains: Object.keys(multiChainId),
      })
    }

    // Build API URL path for cache key generation
    const normalizedAddress = token?.toLowerCase() || pool?.toLowerCase()
    const apiPath = normalizedAddress ? `tx/v3/${chainName}/recent/${normalizedAddress}` : `tx/v3/${chainName}/recent`

    // Fetch data with cache-first approach using URL-based cache key
    const result = await RedisClient.fetchWithCache(apiPath, async () => {
      const freshData = pool
        ? await fetchPoolTransactions(chainId, normalizedAddress)
        : await fetchTopTransactions(chainId, normalizedAddress)
      if (freshData.error) {
        throw new Error('Failed to fetch transactions data')
      }
      return freshData
    })

    if (result.data.error || !result.data.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'No transactions found',
      })
    }

    // Set cache headers for successful responses
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    // Return cached or fresh data immediately
    // Background refresh is already triggered by fetchWithCache
    return res.status(200).json(result.data.data)
  } catch (error) {
    console.error('Transactions API Error:', error)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({
      error: 'Internal Server Error',
      timestamp: new Date().toISOString(),
    })
  }
}

export default handler
