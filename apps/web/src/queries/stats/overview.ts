import { V3_SUBGRAPHS } from '@pancakeswap/chains'
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

interface PoolDataResponse {
  factories: {
    totalFeesUSD: string
    totalProtocolFeesUSD: string
    totalValueLockedUSD: string
    totalVolumeUSD: string
    txCount: string
  }[]
}

const STATS_QUERY = (block: number | undefined) => gql`
  query factories {
    factories(${block ? `block: {number: ${block}}` : ''}, first: 1) {
      totalFeesUSD
      totalProtocolFeesUSD
      totalValueLockedUSD
      totalVolumeUSD
      txCount
    }
  }
`

const fetchWithFallback = async <T>(url: string, query: string): Promise<T | null> => {
  try {
    return await request<T>(url, query)
  } catch (error) {
    console.error('GraphQL query failed:', error)
    return null
  }
}

export const getOverviewData = async (
  chainId: number,
): Promise<{
  error: boolean
  data: OverviewData | undefined
}> => {
  try {
    const [t24, t48, t30d] = getDeltaTimestamps()
    const subgraphUrl = V3_SUBGRAPHS[chainId]
    const blocks = await getBlocksByTimestamp([t24, t48, t30d], chainId)
    const [block24, block48, block30d] = blocks ?? []

    const [currentData, data24, data48, data30d] = await Promise.all([
      fetchWithFallback<PoolDataResponse>(subgraphUrl, STATS_QUERY(undefined)),
      fetchWithFallback<PoolDataResponse>(subgraphUrl, STATS_QUERY(block24?.number)),
      fetchWithFallback<PoolDataResponse>(subgraphUrl, STATS_QUERY(block48?.number)),
      fetchWithFallback<PoolDataResponse>(subgraphUrl, STATS_QUERY(block30d?.number)),
    ])

    const defaultFactory = {
      totalFeesUSD: '0',
      totalProtocolFeesUSD: '0',
      totalValueLockedUSD: '0',
      totalVolumeUSD: '0',
      txCount: '0',
    }

    const current = currentData ? currentData.factories[0] : defaultFactory
    const historical24 = data24 ? data24.factories[0] : defaultFactory
    const historical48 = data48 ? data48.factories[0] : defaultFactory
    const historical30d = data30d ? data30d.factories[0] : defaultFactory

    const result: OverviewData = {
      totalFeeUSD: current.totalFeesUSD,
      totalFeeUSD24h: parseFloat(historical24.totalFeesUSD).toString(),
      totalFeeUSD48h: parseFloat(historical48?.totalFeesUSD).toString(),
      totalFeeUSD30d: parseFloat(historical30d?.totalFeesUSD).toString(),

      totalProtocolFeeUSD: current.totalProtocolFeesUSD,
      totalProtocolFeeUSD24h: parseFloat(historical24.totalProtocolFeesUSD).toString(),
      totalProtocolFeeUSD48h: parseFloat(historical48?.totalProtocolFeesUSD).toString(),
      totalProtocolFeeUSD30d: parseFloat(historical30d?.totalProtocolFeesUSD).toString(),

      tvlUSD: current.totalValueLockedUSD,
      tvlUSD24h: historical24.totalValueLockedUSD,
      tvlUSD48h: historical48?.totalValueLockedUSD,
      tvlUSD30d: historical30d?.totalValueLockedUSD,

      totalVolumeUSD: current.totalVolumeUSD,
      volumeUSD24h: (parseFloat(current.totalVolumeUSD) - parseFloat(historical24.totalVolumeUSD)).toString(),
      volumeUSD48h: (parseFloat(current.totalVolumeUSD) - parseFloat(historical48?.totalVolumeUSD)).toString(),
      volumeUSD30d: (parseFloat(current.totalVolumeUSD) - parseFloat(historical30d?.totalVolumeUSD)).toString(),

      totalTxCount: parseInt(current.txCount, 10),
      txCount24h: parseInt(current.txCount, 10) - parseInt(historical24.txCount, 10),
      txCount48h: parseInt(current.txCount, 10) - parseInt(historical48?.txCount, 10),
      txCount30d: parseInt(current.txCount, 10) - parseInt(historical30d?.txCount, 10),
    }

    return { error: false, data: result }
  } catch (error) {
    console.error('Failed to fetch overview data', error)
    return { error: true, data: undefined }
  }
}
