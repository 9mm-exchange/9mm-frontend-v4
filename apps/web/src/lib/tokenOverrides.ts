/**
 * Targeted per-token corrections applied at the Next.js API-route layer.
 *
 * The V3 subgraph's `derivedETH` accumulator can pick a skewed low-liquidity
 * pool as the price anchor for certain tokens (common on PulseChain where
 * bridged tokens have non-18 decimals or where a tier-1 stable pool has a
 * stale marginal tick). The correct fix is in the subgraph mappings, but that
 * requires a full re-sync on graph-node — this file is the tactical layer so
 * we can correct visible inflation in minutes without touching Ponder / the
 * subgraph / explorer-api.
 *
 * Scope: Pulse only. Other chains' entries are intentionally empty so their
 * data flows through unchanged.
 */

import { multiChainPriceAPIPaths } from 'state/info/constant'

export type TokenOverride = {
  /** Pull the live price from price-api.9mm.pro instead of trusting the
   *  subgraph-derived value. Use for tokens whose `derivedETH` is broken.
   *  When set, the override also rewrites `tvlUSD` (from token-unit `tvl` ×
   *  live price) and flattens the three historical price fields to the live
   *  value so the UI's "% change" delta doesn't render as -99.99...%. */
  livePrice?: boolean
  /** Remove this token from list responses entirely (scam / no real market). */
  hide?: boolean
}

/** Public hook for endpoints that fetch a single token's live price —
 *  e.g. price-chart / tvl-chart handlers that don't go through
 *  `fetchTopTokens`. Returns null when no override exists for that (chain,
 *  address) pair, so the caller can short-circuit only for known offenders. */
export async function getOverrideLivePrice(chainId: number, address: string): Promise<number | null> {
  const ov = TOKEN_OVERRIDES[chainId]?.[address.toLowerCase()]
  if (!ov?.livePrice) return null
  return fetchLivePrice(chainId, address)
}

/** True when a token should be treated as hidden by single-token detail
 *  endpoints. */
export function isTokenHidden(chainId: number, address: string): boolean {
  return TOKEN_OVERRIDES[chainId]?.[address.toLowerCase()]?.hide === true
}

export const TOKEN_OVERRIDES: Record<number, Record<string, TokenOverride>> = {
  // ChainId 369 — PulseChain
  369: {
    // Wrapped BTC from Ethereum — subgraph prices this at ~$1.4e22 due to a
    // skewed pool. Real value ~$73k from price-api.
    '0xb17d901469b9208b17d916112988a3fed19b5ca1': { livePrice: true },
    // ナナナ The M.U.L.E. — scam; $79M reported TVL is not real market.
    '0xaa46fa6cf4f81b087ec3a968946fb2e705c6b89e': { hide: true },
  },
}

async function fetchLivePrice(chainId: number, address: string): Promise<number | null> {
  const path = (multiChainPriceAPIPaths as Record<number, string>)[chainId]
  if (!path) return null
  try {
    const res = await fetch(`https://price-api.9mm.pro/api/price${path}/?address=${address}`, {
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return null
    const body = (await res.json()) as { price?: string | number }
    if (body?.price == null) return null
    const n = typeof body.price === 'string' ? parseFloat(body.price) : body.price
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

/** Minimal shape the override helper cares about. Rows may carry other
 *  fields (volumeUSD*, feeUSD*, txCount*, etc.) — those pass through
 *  untouched. Only `priceUSD`, the historical price fields, and `tvlUSD`
 *  are rewritten when an override applies. */
type OverridableTokenRow = {
  id: string
  priceUSD: string
  priceUSD24h?: string
  priceUSD48h?: string
  priceUSD7d?: string
  /** Token-unit TVL (sum of reserves across all pools for this token). The
   *  subgraph computes this correctly from raw amounts; only the USD
   *  conversion is broken. So `tvlUSD = tvl * livePrice` is a clean rewrite. */
  tvl?: string
  tvlUSD?: string
}

/**
 * Apply per-chain overrides to a list of token rows.
 *
 * Per-row behaviour:
 *   - `hide: true`   → row is removed from the result.
 *   - `livePrice: true` with successful fetch → `priceUSD`, `priceUSD24h`,
 *     `priceUSD48h`, `priceUSD7d` all replaced with the live price (flattens
 *     historical deltas to 0%, which is more truthful than the -99.99% the
 *     broken derivedETH would produce). `tvlUSD` is recomputed as
 *     `tvl * livePrice` when both fields exist. On fetch failure, the row
 *     passes through unchanged (failure-safe).
 *   - Rows without an entry → untouched.
 *
 * Returns a new array; does not mutate the input. Rows for chains that have
 * no overrides (`TOKEN_OVERRIDES[chainId]` undefined) are returned as-is.
 */
export async function applyTokenOverrides<T extends OverridableTokenRow>(
  chainId: number,
  rows: T[],
): Promise<T[]> {
  const overrides = TOKEN_OVERRIDES[chainId]
  if (!overrides) return rows

  const livePrices: Record<string, number | null> = {}
  await Promise.all(
    rows
      .filter((r) => overrides[r.id.toLowerCase()]?.livePrice)
      .map(async (r) => {
        livePrices[r.id.toLowerCase()] = await fetchLivePrice(chainId, r.id)
      }),
  )

  return rows.reduce<T[]>((acc, r) => {
    const ov = overrides[r.id.toLowerCase()]
    if (ov?.hide) return acc
    if (!ov) return [...acc, r]
    if (ov.livePrice) {
      const live = livePrices[r.id.toLowerCase()]
      if (live == null) return [...acc, r]
      const priceStr = String(live)
      const next: T = { ...r, priceUSD: priceStr }
      if (r.priceUSD24h !== undefined) next.priceUSD24h = priceStr
      if (r.priceUSD48h !== undefined) next.priceUSD48h = priceStr
      if (r.priceUSD7d !== undefined) next.priceUSD7d = priceStr
      if (r.tvl !== undefined) {
        const tvlTokens = parseFloat(r.tvl)
        if (Number.isFinite(tvlTokens)) next.tvlUSD = String(tvlTokens * live)
      }
      return [...acc, next]
    }
    return [...acc, r]
  }, [])
}
