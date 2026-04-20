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
   *  subgraph-derived value. Use for tokens whose `derivedETH` is broken. */
  livePrice?: boolean
  /** Remove this token from list responses entirely (scam / no real market). */
  hide?: boolean
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

/**
 * Apply per-chain overrides to a list of token rows.
 *
 * - If a token has `hide: true`, it is removed from the result.
 * - If a token has `livePrice: true`, fetch the price from price-api.9mm.pro
 *   and replace `priceUSD` with it; fall through to the original value on fetch failure.
 * - Tokens without an entry pass through unchanged.
 *
 * Returns a new array; does not mutate the input.
 */
export async function applyTokenOverrides<T extends { id: string; priceUSD: string }>(
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
    const live = livePrices[r.id.toLowerCase()]
    if (ov.livePrice && live != null) {
      return [...acc, { ...r, priceUSD: String(live) }]
    }
    return [...acc, r]
  }, [])
}
