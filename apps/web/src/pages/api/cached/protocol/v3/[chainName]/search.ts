import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'

/**
 * Cache Configuration:
 * - 60s TTL — search is user-driven, keep it fresh but shield the backend from
 *   per-keystroke bursts (the client already debounces 600ms).
 */
const CACHE_DURATION = 60
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION}`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

/**
 * Server-side explorer-api REST base for the search passthrough.
 *
 * ⚠ MUST be a real explorer-api host — NOT the client's NEXT_PUBLIC_EXPLORE_API_ENDPOINT
 * (= https://dex.9mm.pro/api), which points back at THIS route and would infinite-loop.
 * The explorer-api's /cached/protocol/v3/{chain}/search is already case-insensitive
 * (LOWER(symbol) LIKE lower(text)) and returns the exact { tokens, pools } shape the
 * client (views/V3Info/data/search) expects, so we passthrough rather than re-implement.
 */
const EXPLORER_API_BASE = process.env.EXPLORE_API_SERVER_ENDPOINT || 'https://info-api.9mm.pro'

// Loop-safety guard: the frontend's own client endpoints must never be the upstream.
const CLIENT_ENDPOINT_HOSTS = ['dex.9mm.pro', 'dex-dev.9mm.pro']

// The explorer-api chain router is tolerant (base / pulse / pulsechain / eth / ethereum /
// sonic all resolve), so we validate the slug shape and pass it through by NAME — we never
// need the numeric chainId here (unlike the GraphQL query routes that key on multiChainId).
const CHAIN_SLUG_RE = /^[a-z0-9-]{2,32}$/i

/**
 * API Handler for V3 Info search (tokens + pairs).
 *
 * Endpoint: /api/cached/protocol/v3/[chainName]/search?text=<query>
 *
 * This route was missing entirely — every /cached/* endpoint the frontend calls has a
 * matching Next.js proxy file except search, so the client 404'd and silently showed
 * "No results" for every query on every chain. This restores it.
 */
const handler: NextApiHandler = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')

  try {
    // Loop-safety: a misconfigured server base pointing back at the client /api would recurse.
    if (CLIENT_ENDPOINT_HOSTS.some((h) => EXPLORER_API_BASE.toLowerCase().includes(h))) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(500).json({ error: 'Misconfigured EXPLORE_API_SERVER_ENDPOINT (would loop)' })
    }

    const { chainName, text } = req.query as { chainName?: string; text?: string }

    if (!chainName || typeof chainName !== 'string' || !CHAIN_SLUG_RE.test(chainName)) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({ error: 'Missing or invalid chainName' })
    }

    const query = (text ?? '').toString().trim()
    // Empty / too-short: return an empty (but valid) result, don't hit the backend.
    if (query.length < 2) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).json({ tokens: [], pools: [] })
    }

    const slug = chainName.toLowerCase()
    const apiPath = `protocol/v3/${slug}/search/${query.toLowerCase()}`

    const result = await RedisClient.fetchWithCache(apiPath, async () => {
      const url = `${EXPLORER_API_BASE}/cached/protocol/v3/${encodeURIComponent(slug)}/search?text=${encodeURIComponent(
        query,
      )}`
      const upstream = await fetch(url)
      if (!upstream.ok) {
        throw new Error(`search upstream ${upstream.status}`)
      }
      const data = (await upstream.json()) as { tokens?: unknown[]; pools?: unknown[] }
      return { error: false, data: { tokens: data?.tokens ?? [], pools: data?.pools ?? [] } }
    })

    if (result.data.error || !result.data.data) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).json({ tokens: [], pools: [] })
    }

    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      res.setHeader(key, value)
    })
    res.setHeader('X-Cache-Status', result.fromCache ? 'HIT' : 'MISS')

    return res.status(200).json(result.data.data)
  } catch (error) {
    console.error('Protocol search API error:', error)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({ error: 'Internal server error', timestamp: new Date().toISOString() })
  }
}

export default handler
