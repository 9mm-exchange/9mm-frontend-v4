import { ChainId, V3_SUBGRAPHS } from '@pancakeswap/chains'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { gql, GraphQLClient } from 'graphql-request'

dayjs.extend(utc)

// Constants
const MIN_TIMESTAMP = 1729282139
const PAGE_SIZE = 1000

// GraphQL Query
const POOL_CHART_QUERY = gql`
  query poolDayDatas($startTime: Int!, $skip: Int!, $address: String) {
    poolDayDatas(
      first: ${PAGE_SIZE}
      skip: $skip
      where: { pool: $address, date_gt: $startTime }
      orderBy: date
      orderDirection: asc
    ) {
      date
      feesUSD
    }
  }
`

// Interfaces
interface PoolDayData {
  date: number
  feesUSD: string
}

interface ChartDayData {
  bucket: string
  feeUSD: string
}

interface PoolChartEntry {
  date: number
  feeUSD: number
}

// Helper Functions
const getStartTimestamp = (period: string): number => {
  const now = dayjs.utc()
  const unit =
    period === '1D' ? 'day' : period === '1W' ? 'week' : period === '1M' ? 'month' : period === '6M' ? 'month' : 'year'
  const value = period === '6M' ? 6 : 1
  return Math.max(now.subtract(value, unit).unix(), MIN_TIMESTAMP)
}

const formatDayData = (dayData: PoolChartEntry): ChartDayData => ({
  bucket: dayjs.unix(dayData.date).utc().startOf('day').toISOString(),
  feeUSD: dayData.feeUSD.toString(),
})

async function fetchPaginatedPoolData(
  client: GraphQLClient,
  address: string,
  startTimestamp: number,
): Promise<PoolDayData[]> {
  let skip = 0
  const results: PoolDayData[] = []
  let hasMore = true

  while (hasMore) {
    // eslint-disable-next-line no-await-in-loop
    const response = await client.request<{ poolDayDatas: PoolDayData[] }>(POOL_CHART_QUERY, {
      address,
      startTime: startTimestamp,
      skip,
    })

    if (!response.poolDayDatas.length) {
      hasMore = false
    } else {
      results.push(...response.poolDayDatas)
      hasMore = response.poolDayDatas.length === PAGE_SIZE
      skip += PAGE_SIZE
    }
  }

  return results
}

function formatDaysData(data: PoolDayData[], startTimestamp: number, endTimestamp: number): PoolChartEntry[] {
  return (
    data
      // Filter out entries without feesUSD or with invalid dates
      .filter((dayData) => dayData.feesUSD && dayData.date >= startTimestamp && dayData.date <= endTimestamp)
      // Convert to PoolChartEntry format
      .map((dayData) => ({
        date: dayData.date,
        feeUSD: parseFloat(dayData.feesUSD),
      }))
      // Sort by date ascending
      .sort((a, b) => a.date - b.date)
  )
}

// Main Functions
export async function fetchFeesChartData(
  address: string,
  client: GraphQLClient,
  period: '1D' | '1W' | '1M' | '6M' | '1Y' = '1Y',
): Promise<ChartDayData[]> {
  const endTimestamp = dayjs.utc().unix()
  const startTimestamp = getStartTimestamp(period)

  try {
    const data = await fetchPaginatedPoolData(client, address, startTimestamp)
    const filledData = formatDaysData(data, startTimestamp, endTimestamp)
    return filledData.map(formatDayData)
  } catch (error) {
    console.error('Failed to fetch fees chart data:', error)
    return []
  }
}

export async function fetchPoolFeeChartData(
  address: string,
  chainId: ChainId,
  period: '1D' | '1W' | '1M' | '6M' | '1Y' = '1Y',
): Promise<{ error: boolean; data?: ChartDayData[] }> {
  try {
    const subgraphUrl = V3_SUBGRAPHS[chainId]
    if (!subgraphUrl) throw new Error(`No subgraph URL for chain ${chainId}`)

    const data = await fetchFeesChartData(address, new GraphQLClient(subgraphUrl), period)
    return { error: false, data: data.length ? data : undefined }
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}
