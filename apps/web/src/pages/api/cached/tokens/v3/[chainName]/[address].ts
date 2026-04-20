import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { fetchTopTokens } from 'queries/tokens'
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
 * API Handler for Token Data
 *
 * Endpoint: /api/cached/tokens/v3/[chainName]/[address]
 *
 * Cache-first approach:
 * 1. Returns cached data immediately if available in Redis
 * 2. If not cached, fetches live data, caches it, and returns it
 * 3. After returning response, refreshes cache in background to keep it up-to-date
 *
 * Cache key format: tokens/v3/{chainName}/{address} -> tokens-v3-{chainName}-{address}
 */
const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, address } = req.query as {
      chainName: string
      address: string
    }

    if (!chainName || !address) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Missing required parameters',
        required: ['chainName', 'address'],
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

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({
        error: 'Invalid token address format',
        expectedFormat: '0x followed by 40 hexadecimal characters',
      })
    }

    // Build API URL path for cache key generation
    const normalizedAddress = address.toLowerCase()
    const apiPath = `tokens/v3/${chainName}/${normalizedAddress}`

    // Fetch data with cache-first approach using URL-based cache key
    const result = await RedisClient.fetchWithCache(apiPath, async () => {
      const freshData = await fetchTopTokens(normalizedAddress, chainId)
      if (freshData.error) {
        throw new Error('Failed to fetch token data')
      }
      return freshData
    })

    // `result.data.data` can be an empty array when a hidden override (e.g.
    // MULE on Pulse) filters the only result out — treat that as 404 so the
    // detail page doesn't render with `undefined` body.
    if (result.data.error || !result.data.data || result.data.data.length === 0) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(404).json({
        error: 'Token data not found',
      })
    }

    // Set cache headers for successful responses
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    // Return cached or fresh data immediately
    // Background refresh is already triggered by fetchWithCache
    return res.status(200).json(result.data.data[0])
  } catch (error) {
    console.error('Token Data API Error:', error)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({
      error: 'Internal Server Error',
      timestamp: new Date().toISOString(),
    })
  }
}

export default handler
