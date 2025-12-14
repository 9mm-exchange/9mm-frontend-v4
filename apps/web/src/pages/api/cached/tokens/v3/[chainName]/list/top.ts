import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { fetchTopTokens } from 'queries/tokens'
import { multiChainId } from 'state/info/constant'

/**
 * Cache Configuration:
 * - 25 minutes TTL for cached data
 */
const CACHE_DURATION = 1500
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * API Handler for Top Tokens
 *
 * Endpoint: /api/cached/tokens/v3/[chainName]/list/top
 *
 * Cache-first approach:
 * 1. Returns cached data immediately if available in Redis
 * 2. If not cached, fetches live data, caches it, and returns it
 * 3. After returning response, refreshes cache in background to keep it up-to-date
 *
 * Cache key format: tokens/v3/{chainName}/list/top -> tokens-v3-{chainName}-list-top
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName } = req.query

    if (!chainName) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Missing required parameter: chainName',
      })
    }

    const chainId = multiChainId[chainName.toString().toUpperCase()]
    if (!chainId) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: `Unsupported chain: ${chainName}`,
        supportedChains: Object.keys(multiChainId),
      })
    }

    // Build API URL path for cache key generation
    const apiPath = `tokens/v3/${chainName}/list/top`

    // Fetch data with cache-first approach using URL-based cache key
    // Cache persists indefinitely, refreshed in background
    const result = await RedisClient.fetchWithCache(apiPath, async () => {
      const freshData = await fetchTopTokens(undefined, chainId)
      if (freshData.error || !freshData.data?.length) {
        throw new Error('Failed to fetch pools or top tokens data')
      }
      return freshData
    })

    if (result.data.error || !result.data.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'No tokens found',
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
    console.error('Top Tokens API Error:', error)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({
      error: 'Internal Server Error',
      timestamp: new Date().toISOString(),
    })
  }
}

export default handler
