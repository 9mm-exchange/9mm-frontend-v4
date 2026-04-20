import { V3_SUBGRAPHS } from '@pancakeswap/chains'
import { gql, GraphQLClient, request } from 'graphql-request'
import { applyTokenOverrides } from 'lib/tokenOverrides'
import union from 'lodash/union'
import { getBlocksByTimestamp } from 'queries/blocks'
import { multiChainName, multiChainTokenBlackList, multiChainTokenWhiteList } from 'state/info/constant'
import { fetchEthPrices } from 'state/info/queries/tokens/fetchEthPrices'
import { fetchTokensBulk } from 'state/info/queries/tokens/fetchTokensBulk'
import { TokenDataResponse } from 'state/info/types'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'

const TOKEN_LIMIT = 100

interface TokenDayData {
  id: string
}

interface TopTokensResponse {
  tokenDayDatas: TokenDayData[]
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
  totalFeeUSD: string
  feeUSD24h: string
  feeUSD48h: string
  feeUSD7d: string
}

export async function fetchTopTokens(
  tokenAddress: string | undefined,
  chainId: number,
): Promise<{ error: boolean; data: TokenDataForView[] | undefined }> {
  try {
    // 1. Initial Setup
    const [timestamp24hAgo, t24, t48, t7d] = getDeltaTimestamps()
    const chainName = multiChainName[chainId]
    const subgraphUrl = V3_SUBGRAPHS[chainId]

    // 2. Validate Configuration
    if (!subgraphUrl || !chainName) {
      throw new Error(`Missing configuration for chain ${chainId}`)
    }

    // 3. Fetch Historical Blocks
    const blocks = await getBlocksByTimestamp([t24, t48, t7d], chainId)

    // 4. Prepare Token Blacklist
    const blacklist = multiChainTokenBlackList[chainName]?.map((id) => id.toLowerCase()) ?? []

    let tokenAddresses: string[] = tokenAddress ? [tokenAddress] : []
    if (!tokenAddress) {
      // 5. Query Top Tokens by TVL
      const { tokenDayDatas } = await request<TopTokensResponse>(
        subgraphUrl,
        gql`
          query topTokens($blacklist: [ID!]) {
            tokenDayDatas(
              first: ${TOKEN_LIMIT}
              where: { id_not_in: $blacklist, date_gt: ${timestamp24hAgo} }
              orderBy: totalValueLockedUSD
              orderDirection: desc
            ) {
              id
            }
          }
        `,
        { blacklist },
      )

      // 6. Process Token Addresses
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
    const { data: ethPrices } = await fetchEthPrices(dataClient, blocks)

    // 7. Fetch Token Data

    const data = await dataClient.request<TokenDataResponse>(fetchTokensBulk(undefined, tokenAddresses))
    const data24 = await dataClient.request<TokenDataResponse>(fetchTokensBulk(block24?.number, tokenAddresses))
    const data48 = await dataClient.request<TokenDataResponse>(fetchTokensBulk(block48?.number, tokenAddresses))
    const dataWeek = await dataClient.request<TokenDataResponse>(fetchTokensBulk(blockWeek?.number, tokenAddresses))

    // const [data, data24, data48, dataWeek] = await Promise.all([
    //   dataClient.request<TokenDataResponse>(fetchTokensBulk(undefined, tokenAddresses)),
    //   dataClient.request<TokenDataResponse>(fetchTokensBulk(block24?.number, tokenAddresses)),
    //   dataClient.request<TokenDataResponse>(fetchTokensBulk(block48?.number, tokenAddresses)),
    //   dataClient.request<TokenDataResponse>(fetchTokensBulk(blockWeek?.number, tokenAddresses)),
    // ])

    if (!ethPrices) {
      return { error: false, data: undefined }
    }

    // 8. Process Token Data
    const createTokenMap = (response?: TokenDataResponse) =>
      response?.tokens?.reduce((acc, token) => ({ ...acc, [token.id]: token }), {}) ?? {}

    const parsed = createTokenMap(data)
    const parsed24 = createTokenMap(data24)
    const parsed48 = createTokenMap(data48)
    const parsedWeek = createTokenMap(dataWeek)

    // 9. Format Final Data
    const formatted = tokenAddresses.reduce((acc: TokenDataForView[], addr) => {
      const current = parsed[addr]
      if (!current) return acc

      const oneDay = parsed24[addr]
      const twoDay = parsed48[addr]
      const week = parsedWeek[addr]

      const tokenData: TokenDataForView = {
        id: addr,
        decimals: parseInt(current.decimals, 10),
        name: current.name,
        symbol: current.symbol,
        totalTxCount: parseInt(current.txCount, 10),
        txCount24h: parseInt(current.txCount, 10) - (oneDay ? parseInt(oneDay.txCount, 10) : 0),
        txCount48h: parseInt(current.txCount, 10) - (twoDay ? parseInt(twoDay.txCount, 10) : 0),
        txCount7d: parseInt(current.txCount, 10) - (week ? parseInt(week.txCount, 10) : 0),
        priceUSD:
          current.derivedETH && ethPrices.current
            ? (parseFloat(current.derivedETH) * ethPrices.current).toString()
            : '0',
        priceUSD24h:
          oneDay?.derivedETH && ethPrices.oneDay ? (parseFloat(oneDay.derivedETH) * ethPrices.oneDay).toString() : '0',
        priceUSD48h:
          twoDay?.derivedETH && ethPrices.twoDay ? (parseFloat(twoDay.derivedETH) * ethPrices.twoDay).toString() : '0',
        priceUSD7d:
          week?.derivedETH && ethPrices.week ? (parseFloat(week.derivedETH) * ethPrices.week).toString() : '0',
        totalVolumeUSD: current.volumeUSD || '0',
        volumeUSD24h: (parseFloat(current.volumeUSD) - (oneDay ? parseFloat(oneDay.volumeUSD) : 0)).toString(),
        volumeUSD48h: (parseFloat(current.volumeUSD) - (twoDay ? parseFloat(twoDay.volumeUSD) : 0)).toString(),
        volumeUSD7d: (parseFloat(current.volumeUSD) - (week ? parseFloat(week.volumeUSD) : 0)).toString(),
        tvl: current.totalValueLocked || '0',
        tvl24h: oneDay?.totalValueLocked || '0',
        tvl48h: twoDay?.totalValueLocked || '0',
        tvl7d: week?.totalValueLocked || '0',
        tvlUSD: current.totalValueLockedUSD || '0',
        tvlUSD24h: oneDay?.totalValueLockedUSD || '0',
        tvlUSD48h: twoDay?.totalValueLockedUSD || '0',
        tvlUSD7d: week?.totalValueLockedUSD || '0',
        totalFeeUSD: current.feesUSD || '0',
        feeUSD24h: (parseFloat(current.feesUSD) - (oneDay ? parseFloat(oneDay.feesUSD) : 0)).toString(),
        feeUSD48h: (parseFloat(current.feesUSD) - (twoDay ? parseFloat(twoDay.feesUSD) : 0)).toString(),
        feeUSD7d: (parseFloat(current.feesUSD) - (week ? parseFloat(week.feesUSD) : 0)).toString(),
      }

      return [...acc, tokenData]
    }, [])

    return { error: false, data: await applyTokenOverrides(chainId, formatted) }
  } catch (error) {
    console.error(`Failed to fetch top tokens for chain ${chainId}:`, error)
    return { error: true, data: undefined }
  }
}
