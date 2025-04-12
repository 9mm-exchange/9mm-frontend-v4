import { V2_SUBGRAPHS } from '@pancakeswap/chains'
import { gql, request } from 'graphql-request'
import { getBlocksByTimestamp } from 'queries/blocks'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'

interface OverviewData {
  totalFeeUSD: string
  totalFeeUSD24h: string
  totalFeeUSD48h: string
  totalFeeUSD30d: string
  totalProtocolFeeUSD: string
  totalProtocolFeeUSD24h: string
  totalProtocolFeeUSD48h: string
  totalProtocolFeeUSD30d: string
  tvlUSD: string
  tvlUSD24h: string
  tvlUSD48h: string
  tvlUSD30d: string
  totalVolumeUSD: string
  volumeUSD24h: string
  volumeUSD48h: string
  volumeUSD30d: string
  totalTxCount: number
  txCount24h: number
  txCount48h: number
  txCount30d: number
}

interface FactoryData {
  totalLiquidityUSD: string
  totalVolumeUSD: string
  totalTransactions: string
}

interface PoolDataResponse {
  pancakeFactories: FactoryData[]
}

const DEFAULT_FACTORY_DATA: FactoryData = {
  totalLiquidityUSD: '0',
  totalVolumeUSD: '0',
  totalTransactions: '0',
}

const STATS_QUERY = (block: number | undefined) => gql`
  query factories {
    pancakeFactories(${block ? `block: {number: ${block}}` : ''}, first: 1) {
      totalLiquidityUSD
      totalVolumeUSD
      totalTransactions
    }
  }
`

const fetchFactoryData = async (url: string, block: number | undefined): Promise<FactoryData> => {
  try {
    const data = await request<PoolDataResponse>(url, STATS_QUERY(block))
    return data.pancakeFactories[0] || DEFAULT_FACTORY_DATA
  } catch (error) {
    console.error('GraphQL query failed:', error)
    return DEFAULT_FACTORY_DATA
  }
}

const calculateDifference = (current: string, historical: string): string => {
  return (parseFloat(current) - parseFloat(historical)).toString()
}

const calculateDifferenceInt = (current: string, historical: string): number => {
  return parseInt(current, 10) - parseInt(historical, 10)
}

export const getOverviewData = async (
  chainId: number,
): Promise<{
  error: boolean
  data: OverviewData | undefined
}> => {
  try {
    const subgraphUrl = V2_SUBGRAPHS[chainId]
    if (!subgraphUrl) {
      throw new Error(`No subgraph URL found for chainId ${chainId}`)
    }

    const [t24, t48, t30d] = getDeltaTimestamps()
    const blocks = await getBlocksByTimestamp([t24, t48, t30d], chainId)
    const [block24, block48, block30d] = blocks ?? []

    const [current, historical24, historical48, historical30d] = await Promise.all([
      fetchFactoryData(subgraphUrl, undefined),
      fetchFactoryData(subgraphUrl, block24?.number),
      fetchFactoryData(subgraphUrl, block48?.number),
      fetchFactoryData(subgraphUrl, block30d?.number),
    ])

    // For V2, all fee-related fields should be zero
    const result: OverviewData = {
      totalFeeUSD: '0',
      totalFeeUSD24h: '0',
      totalFeeUSD48h: '0',
      totalFeeUSD30d: '0',

      totalProtocolFeeUSD: '0',
      totalProtocolFeeUSD24h: '0',
      totalProtocolFeeUSD48h: '0',
      totalProtocolFeeUSD30d: '0',

      tvlUSD: current.totalLiquidityUSD,
      tvlUSD24h: historical24.totalLiquidityUSD,
      tvlUSD48h: historical48.totalLiquidityUSD,
      tvlUSD30d: historical30d.totalLiquidityUSD,

      totalVolumeUSD: current.totalVolumeUSD,
      volumeUSD24h: calculateDifference(current.totalVolumeUSD, historical24.totalVolumeUSD),
      volumeUSD48h: calculateDifference(current.totalVolumeUSD, historical48.totalVolumeUSD),
      volumeUSD30d: calculateDifference(current.totalVolumeUSD, historical30d.totalVolumeUSD),

      totalTxCount: parseInt(current.totalTransactions, 10),
      txCount24h: calculateDifferenceInt(current.totalTransactions, historical24.totalTransactions),
      txCount48h: calculateDifferenceInt(current.totalTransactions, historical48.totalTransactions),
      txCount30d: calculateDifferenceInt(current.totalTransactions, historical30d.totalTransactions),
    }

    return { error: false, data: result }
  } catch (error) {
    console.error('Failed to fetch overview data', error)
    return { error: true, data: undefined }
  }
}
