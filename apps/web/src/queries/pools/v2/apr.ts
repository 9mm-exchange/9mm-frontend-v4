import { V2_SUBGRAPHS } from '@pancakeswap/chains'
import BigNumber from 'bignumber.js'
import { LP_HOLDERS_FEE, TOTAL_FEE } from 'config/constants/info'
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
  reserveUSD: string
}

interface PoolDataResponse {
  pair: PoolFields | null // Changed from 'pool' to 'pair' for V2 subgraph
}

// Utility functions
const parseSafeFloat = (value?: string): number => parseFloat(value || '0') || 0
const safeBigNumber = (value?: string): BigNumber => new BigNumber(value || '0')

const POOL_QUERY = (block: number | undefined, poolAddress: string) => gql`
  query pair {
    pair(id: "${poolAddress.toLowerCase()}"${block ? `, block: {number: ${block}}` : ''}) {
      volumeUSD
      reserveUSD
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

const calculateVolumeMetrics = (current: PoolFields, oneDay?: PoolFields, week?: PoolFields) => {
  const volumeChange24h = get2DayChange(current.volumeUSD, oneDay?.volumeUSD || '0', oneDay?.volumeUSD || '0')
  return {
    volumeUSD24h: volumeChange24h[0].toString(),
    volumeUSD7d: (parseSafeFloat(current.volumeUSD) - parseSafeFloat(week?.volumeUSD || '0')).toString(),
  }
}

const calculateFeesFromVolume = (volume: string): BigNumber => {
  const volumeBN = safeBigNumber(volume)
  const totalFees = volumeBN.times(TOTAL_FEE).div(10000)
  const protocolFees = totalFees.times(LP_HOLDERS_FEE).div(10000)
  return totalFees.minus(protocolFees) // Net fees for LPs
}

const calculateApr = (fees24h: BigNumber, tvl: string): string => {
  const poolTvl = parseSafeFloat(tvl)
  if (poolTvl <= 0) return '0'

  const dailyFee = fees24h.toNumber()
  const yearlyFees = dailyFee * 365
  return ((yearlyFees / poolTvl) * 100).toString()
}

export const getPoolAprData = async (
  poolAddress: string,
  chainId: number,
): Promise<{ error: boolean; data: PoolAprData | undefined }> => {
  try {
    const subgraphUrl = V2_SUBGRAPHS[chainId]
    if (!subgraphUrl) throw new Error(`No subgraph URL for chain ${chainId}`)

    const client = new GraphQLClient(subgraphUrl, { timeout: 5000 }) // Added timeout
    const [t24, t48, t7d] = getDeltaTimestamps() // Added t48 for more accurate 24h calculation
    const blocks = await getBlocksByTimestamp([t24, t48, t7d], chainId)
    const [block24, block48, blockWeek] = blocks ?? []

    const [currentData, data24, data48, dataWeek] = await Promise.all([
      fetchWithFallback<PoolDataResponse>(client, POOL_QUERY(undefined, poolAddress)),
      fetchWithFallback<PoolDataResponse>(client, POOL_QUERY(block24?.number, poolAddress)),
      fetchWithFallback<PoolDataResponse>(client, POOL_QUERY(block48?.number, poolAddress)),
      fetchWithFallback<PoolDataResponse>(client, POOL_QUERY(blockWeek?.number, poolAddress)),
    ])

    if (!currentData?.pair) return { error: true, data: undefined }

    // Calculate volume metrics
    const { volumeUSD24h, volumeUSD7d } = calculateVolumeMetrics(
      currentData.pair,
      data24?.pair ?? undefined,
      dataWeek?.pair ?? undefined,
    )

    // Calculate fees based on volume changes
    const currentFees = calculateFeesFromVolume(currentData.pair.volumeUSD)
    const fees24h = currentFees.minus(calculateFeesFromVolume(data24?.pair?.volumeUSD || '0'))
    const fees7d = currentFees.minus(calculateFeesFromVolume(dataWeek?.pair?.volumeUSD || '0'))

    // Calculate APR metrics
    const apr24h = calculateApr(fees24h, currentData.pair.reserveUSD)
    const apr7d = calculateApr(fees7d.dividedBy(7), currentData.pair.reserveUSD)

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
