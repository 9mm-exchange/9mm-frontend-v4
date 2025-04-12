import { ChainId, V2_SUBGRAPHS } from '@pancakeswap/chains'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import BigNumber from 'bignumber.js'
import { LP_HOLDERS_FEE, TOTAL_FEE } from 'config/constants/info'
import { gql, GraphQLClient } from 'graphql-request'
import { getBlocksByTimestamp } from 'queries/blocks'
import { get2DayChange } from 'state/info/utils'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { POOL_HIDE } from 'views/V3Info/constants'

// Interfaces
interface Token {
  id: string
  name: string
  symbol: string
  decimals: number
  derivedETH: string
}

interface PoolData {
  id: string
  token0: Token
  token1: Token
  feeTier: number
  liquidity: string
  sqrtPrice: string
  tick: number
  totalVolumeUSD: string
  token0Price: string
  token1Price: string
  tvlToken0: string
  tvlToken1: string
  totalFeeUSD: string
  feeUSD24h: string
  feeUSD48h: string
  feeUSD7d: string
  totalProtocolFeeUSD: string
  protocolFeeUSD24h: string
  protocolFeeUSD48h: string
  protocolFeeUSD7d: string
  volumeUSD24h: string
  volumeUSD48h: string
  volumeUSD7d: string
  tvlUSD: string
  tvlUSD24h: string
  tvlUSD48h: string
  tvlUSD7d: string
  createdAtTimestamp: string
  protocol: string
}

interface PoolFields {
  id: string
  reserve0: string
  reserve1: string
  reserveUSD: string
  volumeUSD: string
  token0Price: string
  token1Price: string
  timestamp: string
  token0: Token
  token1: Token
}

interface PoolDataResponse {
  pair: PoolFields | null
  bundles: { ethPrice: string }[]
}

interface PoolsDataResponse {
  pairs: PoolFields[]
  bundles: { ethPrice: string }[]
}

interface TopPoolsResponse {
  pairs: { id: string }[]
}

// Constants
const DEFAULT_ETH_PRICE = 0
const DEFAULT_TICK = 0
const DEFAULT_FEE_TIER = 2500 // Default fee tier for V2 (0.3%)

// Utility functions
const parseSafeFloat = (value?: string): number => parseFloat(value || '0') || 0
const safeBigNumber = (value?: string): BigNumber => new BigNumber(value || '0')
const toInt = (value: string | number): number => parseInt(value.toString(), 10)

// GraphQL Queries
const POOLS_BULK = (block: number | undefined, poolAddresses: string[]) => {
  const poolString = `[${poolAddresses.map((addr) => `"${addr}"`).join(',')}]`
  return gql`
    query pairs {
      pairs(
        where: {id_in: ${poolString}},
        ${block ? `block: {number: ${block}},` : ''}
        orderBy: reserveUSD,
        orderDirection: desc
      ) {
        id
        reserve0
        reserve1
        reserveUSD
        volumeUSD
        token0Price
        token1Price
        timestamp
        token0 {
            id
            symbol
            name
            decimals
            derivedETH
        }
        token1 {
          id
          symbol
          name
          decimals
          derivedETH
        }
      }
      bundles(where: {id: "1"}) { ethPrice }
    }
  `
}

const POOL_QUERY = (block: number | undefined, poolAddress: string) => gql`
  query pair {
    pair(id: "${poolAddress}"${block ? `, block: {number: ${block}}` : ''}) {
      id
      reserve0
      reserve1
      reserveUSD
      volumeUSD
      token0Price
      token1Price
      timestamp
      token0 {
          id
          symbol
          name
          decimals
          derivedETH
      }
      token1 {
        id
        symbol
        name
        decimals
        derivedETH
      }
    }
    bundles(where: {id: "1"}) { ethPrice }
  }
`

const TOP_POOLS = gql`
  query topPools {
    pairs(first: 50, orderBy: reserveUSD, orderDirection: desc) {
      id
    }
  }
`

const TOKEN_TOP_POOLS = gql`
  query topPools($address: String!) {
    pairs(
      first: 50
      orderBy: reserveUSD
      orderDirection: desc
      where: { or: [{ token0: $address }, { token1: $address }] }
    ) {
      id
    }
  }
`

// Helper functions
const fetchWithFallback = async <T>(client: GraphQLClient, query: string, variables?: any): Promise<T | null> => {
  try {
    return await client.request<T>(query, variables)
  } catch (error) {
    console.error('GraphQL query failed:', error)
    return null
  }
}

const calculateDerivedTVL = (pool: PoolFields, ethPrice: number): number => {
  const tvlToken0 = parseSafeFloat(pool.reserve0) * parseSafeFloat(pool.token0.derivedETH) * ethPrice
  const tvlToken1 = parseSafeFloat(pool.reserve1) * parseSafeFloat(pool.token1.derivedETH) * ethPrice
  return tvlToken0 + tvlToken1 || parseSafeFloat(pool.reserveUSD)
}

const calculateVolumeMetrics = (current: PoolFields, oneDay?: PoolFields, twoDay?: PoolFields, week?: PoolFields) => ({
  volumeUSD24h: get2DayChange(current.volumeUSD, oneDay?.volumeUSD || '0', twoDay?.volumeUSD || '0')[0].toString(),
  volumeUSD48h: (parseSafeFloat(current.volumeUSD) - parseSafeFloat(twoDay?.volumeUSD || '0')).toString(),
  volumeUSD7d: (parseSafeFloat(current.volumeUSD) - parseSafeFloat(week?.volumeUSD || '0')).toString(),
})

const calculateFeeMetrics = (current: PoolFields, oneDay?: PoolFields, twoDay?: PoolFields, week?: PoolFields) => {
  // V2 doesn't have separate fee tracking, so we calculate based on volume and fixed fee tier
  const currentFees = safeBigNumber(current.volumeUSD).times(TOTAL_FEE).div(10000)
  const currentProtocolFees = currentFees.times(LP_HOLDERS_FEE).div(10000)
  const currentNetFees = currentFees.minus(currentProtocolFees)

  const calculatePeriodFees = (period?: PoolFields) => {
    const periodVolume = safeBigNumber(period?.volumeUSD || '0')
    const periodFees = periodVolume.times(TOTAL_FEE).div(10000)
    const periodProtocolFees = periodFees.times(LP_HOLDERS_FEE).div(10000)
    const periodNetFees = periodFees.minus(periodProtocolFees)
    return currentNetFees.minus(periodNetFees)
  }

  const calculateProtocolFees = (period?: PoolFields) => {
    const periodVolume = safeBigNumber(period?.volumeUSD || '0')
    const periodFees = periodVolume.times(TOTAL_FEE).div(10000)
    const periodProtocolFees = periodFees.times(LP_HOLDERS_FEE).div(10000)
    return currentProtocolFees.minus(periodProtocolFees)
  }

  return {
    totalFeeUSD: currentFees.toString(),
    feeUSD24h: calculatePeriodFees(oneDay).toString(),
    feeUSD48h: calculatePeriodFees(twoDay).toString(),
    feeUSD7d: calculatePeriodFees(week).toString(),
    totalProtocolFeeUSD: currentProtocolFees.toString(),
    protocolFeeUSD24h: calculateProtocolFees(oneDay).toString(),
    protocolFeeUSD48h: calculateProtocolFees(twoDay).toString(),
    protocolFeeUSD7d: calculateProtocolFees(week).toString(),
  }
}

const calculateTVLMetrics = (
  current: PoolFields,
  ethPrice: number,
  oneDay?: PoolFields,
  twoDay?: PoolFields,
  week?: PoolFields,
) => {
  const currentTVL = calculateDerivedTVL(current, ethPrice)
  const getHistoricalTVL = (period?: PoolFields) => (period ? calculateDerivedTVL(period, ethPrice) : 0)

  return {
    tvlToken0: current.reserve0,
    tvlToken1: current.reserve1,
    tvlUSD: currentTVL.toString(),
    tvlUSD24h: getHistoricalTVL(oneDay).toString(),
    tvlUSD48h: getHistoricalTVL(twoDay).toString(),
    tvlUSD7d: getHistoricalTVL(week).toString(),
  }
}

const formatPoolData = (
  pool: PoolFields,
  ethPrice: number,
  oneDay?: PoolFields,
  twoDay?: PoolFields,
  week?: PoolFields,
): PoolData => {
  const [volumeMetrics, feeMetrics, tvlMetrics] = [
    calculateVolumeMetrics(pool, oneDay, twoDay, week),
    calculateFeeMetrics(pool, oneDay, twoDay, week),
    calculateTVLMetrics(pool, ethPrice, oneDay, twoDay, week),
  ]

  return {
    id: pool.id,
    token0: { ...pool.token0, decimals: toInt(pool.token0.decimals) },
    token1: { ...pool.token1, decimals: toInt(pool.token1.decimals) },
    feeTier: DEFAULT_FEE_TIER, // V2 uses fixed 0.3% fee
    liquidity: '0', // Not available in V2
    sqrtPrice: '0', // Not available in V2
    tick: DEFAULT_TICK, // Not available in V2
    totalVolumeUSD: pool.volumeUSD,
    token0Price: pool.token0Price,
    token1Price: pool.token1Price,
    ...tvlMetrics,
    ...volumeMetrics,
    ...feeMetrics,
    createdAtTimestamp: pool.timestamp,
    protocol: 'v2',
  }
}

// Main functions
export async function fetchTopPoolAddresses(
  client: GraphQLClient,
  chainId: ChainId,
  tokenAddress?: string,
): Promise<{ error: boolean; addresses: string[] | undefined }> {
  try {
    const query = tokenAddress ? TOKEN_TOP_POOLS : TOP_POOLS
    const variables = tokenAddress ? { address: tokenAddress.toLowerCase() } : undefined

    const data = await client.request<TopPoolsResponse>(query, variables)

    const addresses = data.pairs
      .map((p) => (POOL_HIDE?.[chainId]?.includes(p.id.toLowerCase()) ? null : p.id))
      .filter((pool): pool is string => !isUndefinedOrNull(pool))

    return { error: false, addresses }
  } catch (e) {
    console.error('Failed to fetch top pools:', e)
    return { error: true, addresses: undefined }
  }
}

export async function getPoolsData(
  chainId: number,
  tokenAddress?: string,
): Promise<{ error: boolean; data: PoolData[] | undefined }> {
  try {
    const subgraphUrl = V2_SUBGRAPHS[chainId]
    if (!subgraphUrl) throw new Error(`No subgraph URL for chain ${chainId}`)

    const client = new GraphQLClient(subgraphUrl)
    const [t24, t48, t7d] = getDeltaTimestamps()
    const blocks = await getBlocksByTimestamp([t24, t48, t7d], chainId)
    const [block24, block48, blockWeek] = blocks ?? []

    const { error, addresses: poolAddresses } = await fetchTopPoolAddresses(client, chainId, tokenAddress)
    if (error || !poolAddresses?.length) return { error: true, data: undefined }

    const [currentData, data24, data48, dataWeek] = await Promise.all([
      fetchWithFallback<PoolsDataResponse>(client, POOLS_BULK(undefined, poolAddresses)),
      fetchWithFallback<PoolsDataResponse>(client, POOLS_BULK(block24?.number, poolAddresses)),
      fetchWithFallback<PoolsDataResponse>(client, POOLS_BULK(block48?.number, poolAddresses)),
      fetchWithFallback<PoolsDataResponse>(client, POOLS_BULK(blockWeek?.number, poolAddresses)),
    ])

    const ethPriceUSD = parseSafeFloat(currentData?.bundles?.[0]?.ethPrice) || DEFAULT_ETH_PRICE

    const poolsMap = currentData?.pairs?.reduce((acc, pool) => ({ ...acc, [pool.id]: pool }), {}) ?? {}
    const pools24Map = data24?.pairs?.reduce((acc, pool) => ({ ...acc, [pool.id]: pool }), {}) ?? {}
    const pools48Map = data48?.pairs?.reduce((acc, pool) => ({ ...acc, [pool.id]: pool }), {}) ?? {}
    const poolsWeekMap = dataWeek?.pairs?.reduce((acc, pool) => ({ ...acc, [pool.id]: pool }), {}) ?? {}

    const formattedPools = poolAddresses
      .map((address) => {
        const current = poolsMap[address]
        if (!current) return null

        return formatPoolData(current, ethPriceUSD, pools24Map[address], pools48Map[address], poolsWeekMap[address])
      })
      .filter((pool): pool is PoolData => pool !== null)

    return { error: false, data: formattedPools }
  } catch (error) {
    console.error('Error fetching pools data:', error)
    return { error: true, data: undefined }
  }
}

export const getPoolData = async (
  poolAddress: string,
  chainId: number,
): Promise<{ error: boolean; data: PoolData | undefined }> => {
  try {
    const subgraphUrl = V2_SUBGRAPHS[chainId]
    if (!subgraphUrl) throw new Error(`No subgraph URL for chain ${chainId}`)

    const client = new GraphQLClient(subgraphUrl)
    const [t24, t48, t7d] = getDeltaTimestamps()
    const blocks = await getBlocksByTimestamp([t24, t48, t7d], chainId)
    const [block24, block48, blockWeek] = blocks ?? []

    const [currentData, data24, data48, dataWeek] = await Promise.all([
      fetchWithFallback<PoolDataResponse>(client, POOL_QUERY(undefined, poolAddress)),
      fetchWithFallback<PoolDataResponse>(client, POOL_QUERY(block24?.number, poolAddress)),
      fetchWithFallback<PoolDataResponse>(client, POOL_QUERY(block48?.number, poolAddress)),
      fetchWithFallback<PoolDataResponse>(client, POOL_QUERY(blockWeek?.number, poolAddress)),
    ])

    if (!currentData?.pair) return { error: true, data: undefined }

    const ethPriceUSD = parseSafeFloat(currentData.bundles[0]?.ethPrice) || DEFAULT_ETH_PRICE
    const formatted = formatPoolData(
      currentData.pair,
      ethPriceUSD,
      data24?.pair || undefined,
      data48?.pair || undefined,
      dataWeek?.pair || undefined,
    )

    return { error: false, data: formatted }
  } catch (error) {
    console.error('Error fetching pool data:', error)
    return { error: true, data: undefined }
  }
}
