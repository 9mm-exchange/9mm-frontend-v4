import { ChainId, getChainIdByChainName } from '@pancakeswap/chains'
import { cacheByLRU } from '@pancakeswap/utils/cacheByLRU'
import { NextApiHandler } from 'next'
import {
  fetchV2ChartsTvlData,
  fetchV2ChartsVolumeData,
  fetchV2PoolsForToken,
  fetchV2TokenData,
  fetchV2TransactionData,
  V2TokenDataQuery,
} from 'state/info/dataQuery'
import { fetchPoolsForToken } from 'state/info/queries/tokens/fetchPoolsForToken'
import { fetchTokenChartData } from 'state/info/queries/tokens/fetchTokenChartData'
import { fetchedTokenData } from 'state/info/queries/tokens/fetchTokenData'
import { fetchTokenTransactions } from 'views/V3Info/data/token/transactions'

type SupportedType = 'swap' | 'v3' | 'stableSwap'

const chainNameForQuery = (chain: string) => {
  switch (chain) {
    case 'eth':
      return 'ethereum'
    case 'polygon-zkevm':
      return 'polygon-zkevm'
    case 'zksync':
      return 'zksync'
    case 'arb':
      return 'arbitrum'
    case 'linea':
      return 'linea'
    case 'base':
      return 'base'
    case 'pulse':
      return 'pulse'
    case 'sonic':
      return 'sonic'
    case 'optipulse':
      return 'optipulse'
    case 'opbnb':
      return 'opbnb'
    default:
      return 'pulse'
  }
}

const resultsOrUdef = <T>(result: PromiseSettledResult<T>) => (result.status === 'fulfilled' ? result.value : undefined)

async function _loadData(chain?: string, address?: string, type?: SupportedType) {
  if (!chain || !address || !type) {
    return null
  }

  const queryChainName = chainNameForQuery(chain)!

  switch (type) {
    case 'stableSwap':
    case 'swap': {
      const chainId = getChainIdByChainName(chain) || ChainId.PULSECHAIN
      const query: V2TokenDataQuery = {
        chainName: queryChainName as 'pulse' | 'ethereum' | 'arbitrum',
        chainId: parseInt(chainId as any as string),
        address,
        type,
      }
      const result = await Promise.allSettled([
        fetchV2TokenData(query),
        fetchV2PoolsForToken(query),
        fetchV2TransactionData(query),
        fetchV2ChartsVolumeData(query),
        fetchV2ChartsTvlData(query),
      ])

      const [token, pool, transactions, chartVolume, chartTvl] = result

      return {
        token: resultsOrUdef(token),
        pool: resultsOrUdef(pool),
        transactions: resultsOrUdef(transactions),
        chartVolume: resultsOrUdef(chartVolume),
        chartTvl: resultsOrUdef(chartTvl),
      }
    }

    case 'v3': {
      const result = await Promise.allSettled([
        fetchPoolsForToken(address, queryChainName),
        fetchedTokenData(queryChainName, address),
        fetchTokenTransactions(address, queryChainName),
        fetchTokenChartData('v3', queryChainName, address),
      ])
      const poolsData = resultsOrUdef(result[0])
      const token = resultsOrUdef(result[1])
      const transactions = resultsOrUdef(result[2])
      const charts = resultsOrUdef(result[3])

      return {
        token: token?.data,
        pool: poolsData?.data,
        transactions: transactions?.data,
        charts: charts?.data,
      }
    }
    default: {
      return null
    }
  }
}

const loadData = cacheByLRU(_loadData, {
  ttl: 300_1000,
  maxCacheSize: 10000,
})

const handler: NextApiHandler = async (req, res) => {
  const { chain, token, type } = req.query

  const result = await loadData(String(chain), String(token), type as SupportedType | undefined)
  res.setHeader('Cache-Control', 's-maxage=60, max-age=30, stale-while-revalidate=300')

  return res.status(200).json(result)
}

export default handler
