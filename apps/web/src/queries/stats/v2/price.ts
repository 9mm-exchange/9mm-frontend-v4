import { ChainId, V2_SUBGRAPHS } from '@pancakeswap/chains'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { gql, GraphQLClient } from 'graphql-request'
import { getBlocksByTimestamp } from 'queries/blocks'
import { multiQuery } from 'utils/infoQueryHelpers'

// format dayjs with the libraries that we need
dayjs.extend(utc)
dayjs.extend(weekOfYear)

/**
 * Price data for token and bnb based on block number
 */
const priceQueryConstructor = (subqueries: string[]) => {
  return gql`
      query tokenPriceData {
        ${subqueries}
      }
    `
}

const getPriceSubqueries = (tokenAddress: string | undefined, blocks: any) =>
  blocks.map(
    (block: any) => `
    t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number} }) {
        derivedETH
    }
    b${block.timestamp}: bundle(id:"1", block: { number: ${block.number} }) {
        ethPrice
    }
    `,
  )

interface FormattedHistory {
  bucket: string
  open: number
  close: number
  high: number
  low: number
}

export async function fetchTokenPriceChartData(
  address: string | undefined,
  chainId: ChainId,
  period: '1D' | '1W' | '1M' | '6M' | '1Y' = '1D',
): Promise<{
  data?: FormattedHistory[]
  error: boolean
}> {
  const subgraphUrl = V2_SUBGRAPHS[chainId]

  if (!subgraphUrl) {
    throw new Error(`No subgraph URL found for chain ${chainId}`)
  }

  const dataClient = new GraphQLClient(subgraphUrl)

  // Calculate time range based on period
  const now = dayjs.utc()
  const endTimestamp = now.unix()

  let startTimestamp: number
  let interval: number

  switch (period) {
    case '1D':
      startTimestamp = now.subtract(1, 'day').unix()
      interval = 300 // 5 minutes
      break
    case '1W':
      startTimestamp = now.subtract(1, 'week').unix()
      interval = 3600 // 1 hour
      break
    case '1M':
      startTimestamp = now.subtract(1, 'month').unix()
      interval = 86400 // 1 day
      break
    case '6M':
      startTimestamp = now.subtract(6, 'months').unix()
      interval = 86400 // 1 day
      break
    case '1Y':
      startTimestamp = now.subtract(1, 'year').unix()
      interval = 86400 // 1 day
      break
    default:
      startTimestamp = now.subtract(1, 'week').unix()
      interval = 3600
  }

  // Generate unique timestamps
  const timestamps: number[] = []
  let time = Math.max(startTimestamp, 1729282139) // Ensure minimum timestamp
  while (time <= endTimestamp) {
    timestamps.push(time)
    time += interval
    // Ensure we don't create duplicate timestamps due to interval math
    if (timestamps.length > 1 && timestamps[timestamps.length - 1] <= timestamps[timestamps.length - 2]) {
      break
    }
  }

  try {
    const blocks = await getBlocksByTimestamp(timestamps, chainId, 'asc')
    const blocksLength = blocks?.length ?? 0

    if (blocks && blocksLength > 0 && chainId === 56) {
      const data = blocks[blocksLength - 1]
      blocks[blocksLength - 1] = {
        timestamp: data.timestamp,
        number: data.number - 32, // nodeReal will sync the 32 block before latest
      }
    }

    const prices: any | undefined = await multiQuery(
      priceQueryConstructor,
      getPriceSubqueries(address, blocks),
      dataClient,
      200,
    )

    if (!prices) {
      console.error('Price data failed to load')
      return {
        error: false,
      }
    }

    // Format token BNB price results
    const tokenPrices: {
      timestamp: string
      derivedBNB: number
      priceUSD: number
    }[] = []

    // Get Token prices in BNB
    Object.keys(prices).forEach((priceKey) => {
      const timestamp = priceKey.split('t')[1]
      if (timestamp) {
        tokenPrices.push({
          timestamp,
          derivedBNB: prices[priceKey]?.derivedETH ? parseFloat(prices[priceKey].derivedETH) : 0,
          priceUSD: 0,
        })
      }
    })

    // Calculate USD prices
    Object.keys(prices).forEach((priceKey) => {
      const timestamp = priceKey.split('b')[1]
      if (timestamp) {
        const tokenPriceIndex = tokenPrices.findIndex((tokenPrice) => tokenPrice.timestamp === timestamp)
        if (tokenPriceIndex >= 0) {
          const { derivedBNB } = tokenPrices[tokenPriceIndex]
          tokenPrices[tokenPriceIndex].priceUSD = parseFloat(prices[priceKey]?.ethPrice ?? 0) * derivedBNB
        }
      }
    })

    // Sort by timestamp and remove duplicates
    const uniqueTokenPrices = tokenPrices
      .filter((price, index, self) => index === self.findIndex((p) => p.timestamp === price.timestamp))
      .sort((a, b) => parseInt(a.timestamp, 10) - parseInt(b.timestamp, 10))

    const formattedHistory: FormattedHistory[] = []

    // Construct open/close prices ensuring sequential data
    for (let i = 0; i < uniqueTokenPrices.length - 1; i++) {
      const current = uniqueTokenPrices[i]
      const next = uniqueTokenPrices[i + 1]

      if (parseInt(current.timestamp, 10) >= parseInt(next.timestamp, 10)) {
        continue // Skip if timestamps aren't properly ordered
      }

      formattedHistory.push({
        bucket: dayjs.unix(parseFloat(current.timestamp)).utc().toISOString(),
        open: current.priceUSD,
        close: next.priceUSD,
        high: Math.max(current.priceUSD, next.priceUSD),
        low: Math.min(current.priceUSD, next.priceUSD),
      })
    }

    return { data: formattedHistory, error: false }
  } catch (error) {
    console.error(`Failed to fetch price data for token ${address}`, error)
    return {
      data: undefined,
      error: true,
    }
  }
}
