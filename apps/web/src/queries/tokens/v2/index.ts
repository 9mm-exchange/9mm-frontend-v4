import { V2_SUBGRAPHS } from '@pancakeswap/chains'
import { gql, GraphQLClient, request } from 'graphql-request'
import union from 'lodash/union'
import { getBlocksByTimestamp } from 'queries/blocks'
import { multiChainName, multiChainTokenBlackList, multiChainTokenWhiteList } from 'state/info/constant'
import { fetchEthPricesV2 } from 'state/info/queries/tokens/fetchEthPricesV2'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'

const TOKEN_LIMIT = 100

interface TokenDayData {
  id: string
}

interface TopTokensResponse {
  tokenDayDatas: TokenDayData[]
}

export interface TokenFields {
  id: string
  symbol: string
  name: string
  decimals: string
  derivedETH: string
  totalLiquidity: string
  totalTransactions: string
  tradeVolumeUSD: string
}

interface TokenDataResponse {
  tokens: TokenFields[]
}

interface TokenDataForView {
  id: string
  decimals: number
  name: string
  symbol: string
  totalTxCount: number
  txCount24h: number
  txCount48h: number
  txCount7d: number
  priceUSD: string
  priceUSD24h: string
  priceUSD48h: string
  priceUSD7d: string
  totalVolumeUSD: string
  volumeUSD24h: string
  volumeUSD48h: string
  volumeUSD7d: string
  tvl: string
  tvl24h: string
  tvl48h: string
  tvl7d: string
  tvlUSD: string
  tvlUSD24h: string
  tvlUSD48h: string
  tvlUSD7d: string
}

const fetchTokensBulkV2 = (block: number | undefined, tokenAddresses: string[]) => {
  const tokenString = `[${tokenAddresses.map((addr) => `"${addr}"`).join(',')}]`
  return gql`
    query tokens {
      tokens(
        where: {id_in: ${tokenString}}
        ${block ? `, block: {number: ${block}}` : ''}
        orderBy: totalLiquidity
        orderDirection: desc
      ) {
        id
        symbol
        name
        decimals
        derivedETH
        totalLiquidity
        totalTransactions
        tradeVolumeUSD
      }
    }
  `
}

export async function fetchTopTokens(
  tokenAddress: string | undefined,
  chainId: number,
): Promise<{ error: boolean; data: TokenDataForView[] | undefined }> {
  try {
    const [timestamp24hAgo, t24, t48, t7d] = getDeltaTimestamps()
    const chainName = multiChainName[chainId]
    const subgraphUrl = V2_SUBGRAPHS[chainId]

    if (!subgraphUrl || !chainName) {
      throw new Error(`Missing configuration for chain ${chainId}`)
    }

    const blocks = await getBlocksByTimestamp([t24, t48, t7d], chainId)
    if (!blocks || blocks.length < 3) {
      throw new Error('Failed to fetch required blocks')
    }

    const blacklist = multiChainTokenBlackList[chainName]?.map((id) => id.toLowerCase()) ?? []
    let tokenAddresses: string[] = tokenAddress ? [tokenAddress] : []

    if (!tokenAddress) {
      const { tokenDayDatas } = await request<TopTokensResponse>(
        subgraphUrl,
        gql`
          query topTokens($blacklist: [ID!]) {
            tokenDayDatas(
              first: ${TOKEN_LIMIT}
              where: { id_not_in: $blacklist, date_gt: ${timestamp24hAgo} }
              orderBy: totalLiquidityUSD
              orderDirection: desc
            ) {
              id
            }
          }
        `,
        { blacklist },
      )

      tokenAddresses = union(
        tokenDayDatas.map((t) => t.id.split('-')[0]),
        multiChainTokenWhiteList[chainName] ?? [],
      )
    }

    if (tokenAddresses.length === 0) {
      return { error: false, data: [] }
    }

    const [block24, block48, blockWeek] = blocks ?? []
    const dataClient = new GraphQLClient(subgraphUrl)
    const { data: ethPrices } = await fetchEthPricesV2(dataClient, blocks)

    if (!ethPrices) {
      return { error: false, data: undefined }
    }

    const [data, data24, data48, dataWeek] = await Promise.all([
      dataClient.request<TokenDataResponse>(fetchTokensBulkV2(undefined, tokenAddresses)),
      dataClient.request<TokenDataResponse>(fetchTokensBulkV2(block24?.number, tokenAddresses)),
      dataClient.request<TokenDataResponse>(fetchTokensBulkV2(block48?.number, tokenAddresses)),
      dataClient.request<TokenDataResponse>(fetchTokensBulkV2(blockWeek?.number, tokenAddresses)),
    ])

    const parsed = data?.tokens?.reduce((acc, token) => ({ ...acc, [token.id]: token }), {}) ?? {}
    const parsed24 = data24?.tokens?.reduce((acc, token) => ({ ...acc, [token.id]: token }), {}) ?? {}
    const parsed48 = data48?.tokens?.reduce((acc, token) => ({ ...acc, [token.id]: token }), {}) ?? {}
    const parsedWeek = dataWeek?.tokens?.reduce((acc, token) => ({ ...acc, [token.id]: token }), {}) ?? {}

    const formatted = tokenAddresses.reduce((accum: TokenDataForView[], addr) => {
      const current = parsed[addr]
      if (!current) return accum

      const oneDay = parsed24[addr]
      const twoDay = parsed48[addr]
      const week = parsedWeek[addr]

      const currentPriceUSD = parseFloat(current.derivedETH) * ethPrices.current
      const tvlUSD = (parseFloat(current.totalLiquidity) * currentPriceUSD).toString()

      const oneDayPriceUSD = oneDay ? parseFloat(oneDay.derivedETH) * ethPrices.oneDay : 0
      const tvlUSD24h = oneDay ? (parseFloat(oneDay.totalLiquidity) * oneDayPriceUSD).toString() : '0'

      const twoDayPriceUSD = twoDay ? parseFloat(twoDay.derivedETH) * ethPrices.twoDay : 0
      const tvlUSD48h = twoDay ? (parseFloat(twoDay.totalLiquidity) * twoDayPriceUSD).toString() : '0'

      const weekPriceUSD = week ? parseFloat(week.derivedETH) * ethPrices.week : 0
      const tvlUSD7d = week ? (parseFloat(week.totalLiquidity) * weekPriceUSD).toString() : '0'

      accum.push({
        id: addr,
        decimals: parseInt(current.decimals, 10),
        name: current.name,
        symbol: current.symbol,
        totalTxCount: parseInt(current.totalTransactions, 10),
        txCount24h: parseInt(current.totalTransactions, 10) - (oneDay ? parseInt(oneDay.totalTransactions, 10) : 0),
        txCount48h: parseInt(current.totalTransactions, 10) - (twoDay ? parseInt(twoDay.totalTransactions, 10) : 0),
        txCount7d: parseInt(current.totalTransactions, 10) - (week ? parseInt(week.totalTransactions, 10) : 0),
        priceUSD: currentPriceUSD.toString(),
        priceUSD24h: oneDayPriceUSD.toString(),
        priceUSD48h: twoDayPriceUSD.toString(),
        priceUSD7d: weekPriceUSD.toString(),
        totalVolumeUSD: current.tradeVolumeUSD || '0',
        volumeUSD24h: (
          parseFloat(current.tradeVolumeUSD) - (oneDay ? parseFloat(oneDay.tradeVolumeUSD) : 0)
        ).toString(),
        volumeUSD48h: (
          parseFloat(current.tradeVolumeUSD) - (twoDay ? parseFloat(twoDay.tradeVolumeUSD) : 0)
        ).toString(),
        volumeUSD7d: (parseFloat(current.tradeVolumeUSD) - (week ? parseFloat(week.tradeVolumeUSD) : 0)).toString(),
        tvl: current.totalLiquidity || '0',
        tvl24h: oneDay?.totalLiquidity || '0',
        tvl48h: twoDay?.totalLiquidity || '0',
        tvl7d: week?.totalLiquidity || '0',
        tvlUSD,
        tvlUSD24h,
        tvlUSD48h,
        tvlUSD7d,
      })
      return accum
    }, [])

    return { error: false, data: formatted }
  } catch (error) {
    console.error(`Failed to fetch top tokens for chain ${chainId}:`, error)
    return { error: true, data: undefined }
  }
}
