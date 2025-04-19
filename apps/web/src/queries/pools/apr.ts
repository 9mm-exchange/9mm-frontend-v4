import { V3_SUBGRAPHS } from '@pancakeswap/chains'
import BigNumber from 'bignumber.js'
import { gql, GraphQLClient } from 'graphql-request'
import { getBlocksByTimestamp } from 'queries/blocks'
import { get2DayChange } from 'state/info/utils'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'

interface PoolAprData {
  volumeUSD24h: string
  volumeUSD7d: string
  apr24h: string
  apr7d: string
}

interface PoolFields {
  volumeUSD: string
  feesUSD: string
  protocolFeesUSD: string
  totalValueLockedUSD: string
}

interface PoolDataResponse {
  pool: PoolFields | null
}

// Utility functions
const parseSafeFloat = (value?: string): number => parseFloat(value || '0') || 0
const safeBigNumber = (value?: string): BigNumber => new BigNumber(value || '0')

const POOL_QUERY = (block: number | undefined, poolAddress: string) => gql`
  query pool {
    pool(id: "${poolAddress}"${block ? `, block: {number: ${block}}` : ''}) {
      volumeUSD
      feesUSD
      protocolFeesUSD
      totalValueLockedUSD
    }
  }
`

const fetchWithFallback = async <T>(client: GraphQLClient, query: string): Promise<T | null> => {
  try {
    return await client.request<T>(query)
  } catch (error) {
    console.error('GraphQL query failed:', error)
    return null
  }
}

const calculateVolumeMetrics = (current: PoolFields, oneDay?: PoolFields, week?: PoolFields) => ({
  volumeUSD24h: get2DayChange(current.volumeUSD, oneDay?.volumeUSD || '0', oneDay?.volumeUSD || '0')[0].toString(),
  volumeUSD7d: (parseSafeFloat(current.volumeUSD) - parseSafeFloat(week?.volumeUSD || '0')).toString(),
})

const calculateApr = (fees24h: string, tvl: string): string => {
  const dailyFee = parseSafeFloat(fees24h)
  const poolTvl = parseSafeFloat(tvl)
  if (poolTvl <= 0) return '0'
  return (((dailyFee * 365) / poolTvl) * 100).toString()
}

export const getPoolAprData = async (
  poolAddress: string,
  chainId: number,
): Promise<{ error: boolean; data: PoolAprData | undefined }> => {
  try {
    const subgraphUrl = V3_SUBGRAPHS[chainId]
    if (!subgraphUrl) throw new Error(`No subgraph URL for chain ${chainId}`)

    const client = new GraphQLClient(subgraphUrl)
    const [t24, , t7d] = getDeltaTimestamps() // We only need 24h and 7d timestamps
    const blocks = await getBlocksByTimestamp([t24, t7d], chainId)
    const [block24, blockWeek] = blocks ?? []

    const [currentData, data24, dataWeek] = await Promise.all([
      fetchWithFallback<PoolDataResponse>(client, POOL_QUERY(undefined, poolAddress)),
      fetchWithFallback<PoolDataResponse>(client, POOL_QUERY(block24?.number, poolAddress)),
      fetchWithFallback<PoolDataResponse>(client, POOL_QUERY(blockWeek?.number, poolAddress)),
    ])

    if (!currentData?.pool) return { error: true, data: undefined }

    // Calculate volume metrics
    const { volumeUSD24h, volumeUSD7d } = calculateVolumeMetrics(
      currentData.pool,
      data24?.pool ?? undefined,
      dataWeek?.pool ?? undefined,
    )

    // Calculate APR metrics
    const currentNetFees = safeBigNumber(currentData.pool.feesUSD).minus(currentData.pool.protocolFeesUSD)
    const fees24h = currentNetFees.minus(
      safeBigNumber(data24?.pool?.feesUSD || '0').minus(data24?.pool?.protocolFeesUSD || '0'),
    )
    const fees7d = currentNetFees.minus(
      safeBigNumber(dataWeek?.pool?.feesUSD || '0').minus(dataWeek?.pool?.protocolFeesUSD || '0'),
    )

    const apr24h = calculateApr(fees24h.toString(), currentData.pool.totalValueLockedUSD)
    const apr7d = calculateApr((parseSafeFloat(fees7d.toString()) / 7).toString(), currentData.pool.totalValueLockedUSD)

    return {
      error: false,
      data: {
        volumeUSD24h,
        volumeUSD7d,
        apr24h,
        apr7d,
      },
    }
  } catch (error) {
    console.error('Error fetching pool data:', error)
    return { error: true, data: undefined }
  }
}
