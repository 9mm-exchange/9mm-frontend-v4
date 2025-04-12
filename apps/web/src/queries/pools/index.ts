import { ChainId, V3_SUBGRAPHS } from '@pancakeswap/chains'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import BigNumber from 'bignumber.js'
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
  feeTier: string
  liquidity: string
  sqrtPrice: string
  tick: string
  token0: Token
  token1: Token
  token0Price: string
  token1Price: string
  volumeUSD: string
  txCount: string
  totalValueLockedToken0: string
  totalValueLockedToken1: string
  totalValueLockedUSD: string
  feesUSD: string
  protocolFeesUSD: string
  createdAtTimestamp: string
}

interface PoolDataResponse {
  pool: PoolFields | null
  bundles: { ethPriceUSD: string }[]
}

interface PoolsDataResponse {
  pools: PoolFields[]
  bundles: { ethPriceUSD: string }[]
}

interface TopPoolsResponse {
  pools: { id: string }[]
}

// Constants
const DEFAULT_ETH_PRICE = 0
const DEFAULT_DECIMAL = 0
const DEFAULT_TICK = 0

// Utility functions
const parseSafeFloat = (value?: string): number => parseFloat(value || '0') || 0
const safeBigNumber = (value?: string): BigNumber => new BigNumber(value || '0')
const toInt = (value: string | number): number => parseInt(value.toString(), 10)

// GraphQL Queries
const POOLS_BULK = (block: number | undefined, poolAddresses: string[]) => {
  const poolString = `[${poolAddresses.map((addr) => `"${addr}"`).join(',')}]`
  return gql`
    query pools {
      pools(
        where: {id_in: ${poolString}},
        ${block ? `block: {number: ${block}},` : ''}
        orderBy: totalValueLockedUSD,
        orderDirection: desc
      ) {
        id
        feeTier
        liquidity
        sqrtPrice
        tick
        token0 { id symbol name decimals derivedETH }
        token1 { id symbol name decimals derivedETH }
        token0Price
        token1Price
        volumeUSD
        txCount
        totalValueLockedToken0
        totalValueLockedToken1
        totalValueLockedUSD
        feesUSD
        protocolFeesUSD
        createdAtTimestamp
      }
      bundles(where: {id: "1"}) { ethPriceUSD }
    }
  `
}

const POOL_QUERY = (block: number | undefined, poolAddress: string) => gql`
  query pool {
    pool(id: "${poolAddress}"${block ? `, block: {number: ${block}}` : ''}) {
      id
      feeTier
      liquidity
      sqrtPrice
      tick
      token0 { id symbol name decimals derivedETH }
      token1 { id symbol name decimals derivedETH }
      token0Price
      token1Price
      volumeUSD
      txCount
      totalValueLockedToken0
      totalValueLockedToken1
      totalValueLockedUSD
      feesUSD
      protocolFeesUSD
      createdAtTimestamp
    }
    bundles(where: {id: "1"}) { ethPriceUSD }
  }
`

const TOP_POOLS = gql`
  query topPools {
    pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc) {
      id
    }
  }
`

const TOKEN_TOP_POOLS = gql`
  query topPools($address: String!) {
    pools(
      first: 50
      orderBy: totalValueLockedUSD
      orderDirection: desc
      where: { or: [{ token0_: { id: $address } }, { token1_: { id: $address } }] }
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

const calculateDerivedTVL = (pool: PoolFields, ethPriceUSD: number): number => {
  const tvlToken0 = parseSafeFloat(pool.totalValueLockedToken0) * parseSafeFloat(pool.token0.derivedETH) * ethPriceUSD
  const tvlToken1 = parseSafeFloat(pool.totalValueLockedToken1) * parseSafeFloat(pool.token1.derivedETH) * ethPriceUSD
  return tvlToken0 + tvlToken1 || parseSafeFloat(pool.totalValueLockedUSD)
}

const calculateVolumeMetrics = (current: PoolFields, oneDay?: PoolFields, twoDay?: PoolFields, week?: PoolFields) => ({
  volumeUSD24h: get2DayChange(current.volumeUSD, oneDay?.volumeUSD || '0', twoDay?.volumeUSD || '0')[0].toString(),
  volumeUSD48h: (parseSafeFloat(current.volumeUSD) - parseSafeFloat(twoDay?.volumeUSD)).toString(),
  volumeUSD7d: (parseSafeFloat(current.volumeUSD) - parseSafeFloat(week?.volumeUSD)).toString(),
})

const calculateFeeMetrics = (current: PoolFields, oneDay?: PoolFields, twoDay?: PoolFields, week?: PoolFields) => {
  const currentNetFees = safeBigNumber(current.feesUSD).minus(current.protocolFeesUSD)

  const calculatePeriodFees = (period?: PoolFields) =>
    currentNetFees.minus(safeBigNumber(period?.feesUSD).minus(period?.protocolFeesUSD || 0))

  const calculateProtocolFees = (period?: PoolFields) =>
    safeBigNumber(current.protocolFeesUSD).minus(period?.protocolFeesUSD || 0)

  return {
    totalFeeUSD: current.feesUSD,
    feeUSD24h: calculatePeriodFees(oneDay).toString(),
    feeUSD48h: calculatePeriodFees(twoDay).toString(),
    feeUSD7d: calculatePeriodFees(week).toString(),
    totalProtocolFeeUSD: current.protocolFeesUSD,
    protocolFeeUSD24h: calculateProtocolFees(oneDay).toString(),
    protocolFeeUSD48h: calculateProtocolFees(twoDay).toString(),
    protocolFeeUSD7d: calculateProtocolFees(week).toString(),
  }
}

const calculateTVLMetrics = (
  current: PoolFields,
  ethPriceUSD: number,
  oneDay?: PoolFields,
  twoDay?: PoolFields,
  week?: PoolFields,
) => {
  const currentTVL = calculateDerivedTVL(current, ethPriceUSD)
  const getHistoricalTVL = (period?: PoolFields) => calculateDerivedTVL(period || current, ethPriceUSD)

  return {
    tvlToken0: current.totalValueLockedToken0,
    tvlToken1: current.totalValueLockedToken1,
    tvlUSD: currentTVL.toString(),
    tvlUSD24h: getHistoricalTVL(oneDay).toString(),
    tvlUSD48h: getHistoricalTVL(twoDay).toString(),
    tvlUSD7d: getHistoricalTVL(week).toString(),
  }
}

const formatPoolData = (
  pool: PoolFields,
  ethPriceUSD: number,
  oneDay?: PoolFields,
  twoDay?: PoolFields,
  week?: PoolFields,
): PoolData => {
  const [volumeMetrics, feeMetrics, tvlMetrics] = [
    calculateVolumeMetrics(pool, oneDay, twoDay, week),
    calculateFeeMetrics(pool, oneDay, twoDay, week),
    calculateTVLMetrics(pool, ethPriceUSD, oneDay, twoDay, week),
  ]

  return {
    id: pool.id,
    token0: { ...pool.token0, decimals: toInt(pool.token0.decimals) },
    token1: { ...pool.token1, decimals: toInt(pool.token1.decimals) },
    feeTier: toInt(pool.feeTier),
    liquidity: pool.liquidity,
    sqrtPrice: pool.sqrtPrice,
    tick: toInt(pool.tick),
    totalVolumeUSD: pool.volumeUSD,
    token0Price: pool.token0Price,
    token1Price: pool.token1Price,
    ...tvlMetrics,
    ...volumeMetrics,
    ...feeMetrics,
    createdAtTimestamp: new Date(toInt(pool.createdAtTimestamp) * 1000).toISOString(),
    protocol: 'v3',
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
    const variables = tokenAddress ? { address: tokenAddress } : undefined

    const data = await client.request<TopPoolsResponse>(query, variables)

    const addresses = data.pools
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
    const subgraphUrl = V3_SUBGRAPHS[chainId]
    if (!subgraphUrl) throw new Error(`No subgraph URL for chain ${chainId}`)

    const client = new GraphQLClient(subgraphUrl)
    const [t24, t48, t7d] = getDeltaTimestamps()
    const blocks = await getBlocksByTimestamp([t24, t48, t7d], chainId)
    const [block24, block48, blockWeek] = blocks ?? []

    const { addresses: poolAddresses } = await fetchTopPoolAddresses(client, chainId, tokenAddress)
    if (!poolAddresses?.length) return { error: true, data: undefined }

    const [currentData, data24, data48, dataWeek] = await Promise.all([
      fetchWithFallback<PoolsDataResponse>(client, POOLS_BULK(undefined, poolAddresses)),
      fetchWithFallback<PoolsDataResponse>(client, POOLS_BULK(block24?.number, poolAddresses)),
      fetchWithFallback<PoolsDataResponse>(client, POOLS_BULK(block48?.number, poolAddresses)),
      fetchWithFallback<PoolsDataResponse>(client, POOLS_BULK(blockWeek?.number, poolAddresses)),
    ])

    const ethPriceUSD = parseSafeFloat(currentData?.bundles?.[0]?.ethPriceUSD)
    const poolsMap = currentData?.pools?.reduce((acc, pool) => ({ ...acc, [pool.id]: pool }), {}) ?? {}
    const pools24Map = data24?.pools?.reduce((acc, pool) => ({ ...acc, [pool.id]: pool }), {}) ?? {}
    const pools48Map = data48?.pools?.reduce((acc, pool) => ({ ...acc, [pool.id]: pool }), {}) ?? {}
    const poolsWeekMap = dataWeek?.pools?.reduce((acc, pool) => ({ ...acc, [pool.id]: pool }), {}) ?? {}

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
    const subgraphUrl = V3_SUBGRAPHS[chainId]
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

    if (!currentData?.pool) return { error: true, data: undefined }

    const ethPriceUSD = parseSafeFloat(currentData.bundles[0]?.ethPriceUSD)
    const formatted = formatPoolData(
      currentData.pool,
      ethPriceUSD,
      data24?.pool || undefined,
      data48?.pool || undefined,
      dataWeek?.pool || undefined,
    )

    return { error: false, data: formatted }
  } catch (error) {
    console.error('Error fetching pool data:', error)
    return { error: true, data: undefined }
  }
}
