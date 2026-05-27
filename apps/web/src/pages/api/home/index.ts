import { cacheByLRU } from '@pancakeswap/utils/cacheByLRU'
import { NextApiHandler } from 'next'
import { homePageChainsInfo, homePageCurrencies, partners } from './homePageDataQuery'
import { queryPools } from './queries/queryPools'
import { queryPredictionUser } from './queries/queryPrediction'
import { queryTokens } from './queries/queryTokens'
import { queryCakeRelated } from './queryCakeRelated'
import { querySiteStats } from './querySiteStats'
import { HomePageData } from './types'

// Per-subsystem isolation: PCS-only paths (CAKE staking, Prediction market)
// don't exist on 9mm, so they must fail independently instead of taking the
// whole response with them. Same for queryPools — a transient farm-API hiccup
// shouldn't 500 the homepage.
async function safeAwait<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[/api/home] subsystem failed, using fallback:', e instanceof Error ? e.message : e)
    return fallback
  }
}

async function _load() {
  const [tokensResult, cakeRelated, stats, topWinner] = await Promise.all([
    safeAwait(queryTokens, { tokenMap: {}, topTokens: [] }),
    safeAwait(queryCakeRelated, undefined as any),
    safeAwait(querySiteStats, undefined as any),
    safeAwait(queryPredictionUser, undefined as any),
  ])
  const { tokenMap, topTokens } = tokensResult
  // CAKE never appears in 9mm's topTokens — default to 0 so getCakeApr inside
  // queryPools degrades to "no CAKE rewards" instead of throwing on .price.
  const cake = topTokens.find((x) => x.symbol === 'CAKE')
  const cakePrice = cake?.price ?? 0
  const pools = await safeAwait(() => queryPools(cakePrice, tokenMap), [])
  const currencies = homePageCurrencies
  const chains = homePageChainsInfo()
  return {
    tokens: topTokens,
    pools,
    currencies,
    chains,
    cakeRelated,
    stats,
    partners,
    topWinner,
  } as HomePageData
}
export const loadHomePageData = cacheByLRU(_load, {
  ttl: 300 * 1000, // 5 minutes
  persist: {
    name: 'homepage',
    type: 'r2',
    version: 'v3',
  },
})

const handler: NextApiHandler = async (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=60, max-age=30, stale-while-revalidate=300')
  const data = await loadHomePageData()
  return res.status(200).json(data)
}

export default handler
