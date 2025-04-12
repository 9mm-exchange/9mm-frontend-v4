import { ChainId, V3_SUBGRAPHS } from '@pancakeswap/chains'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { gql, GraphQLClient } from 'graphql-request'

dayjs.extend(utc)

// Constants
const _ONE_DAY_UNIX = 24 * 60 * 60 // Prefix with underscore for unused var
const MIN_TIMESTAMP = 1729282139
const PAGE_SIZE = 1000

// GraphQL Queries
const QUERIES = {
  GLOBAL: gql`
    query pancakeDayDatas($startTime: Int!, $skip: Int!) {
      pancakeDayDatas(
        first: ${PAGE_SIZE}
        skip: $skip
        where: { date_gt: $startTime }
        orderBy: date
        orderDirection: asc
      ) {
        date
        volumeUSD
      }
    }
  `,
  TOKEN: gql`
    query tokenDayDatas($startTime: Int!, $skip: Int!, $address: String) {
      tokenDayDatas(
        first: ${PAGE_SIZE}
        skip: $skip
        where: { token: $address, date_gt: $startTime }
        orderBy: date
        orderDirection: asc
      ) {
        date
        volumeUSD
      }
    }
  `,
  POOL: gql`
    query poolDayDatas($startTime: Int!, $skip: Int!, $address: String) {
      poolDayDatas(
        first: ${PAGE_SIZE}
        skip: $skip
        where: { pool: $address, date_gt: $startTime }
        orderBy: date
        orderDirection: asc
      ) {
        date
        volumeUSD
      }
    }
  `,
}

// Interfaces
interface ChartDayData {
  bucket: string
  volumeUSD: string
}

interface DayData {
  date: number
  volumeUSD: string
}

interface VolumeChartEntry {
  date: number
  volumeUSD: number
}

// Helper Functions
const getStartTimestamp = (period: string): number => {
  const now = dayjs.utc()
  const unit =
    period === '1D' ? 'day' : period === '1W' ? 'week' : period === '1M' ? 'month' : period === '6M' ? 'month' : 'year'
  const value = period === '6M' ? 6 : 1
  return Math.max(now.subtract(value, unit).unix(), MIN_TIMESTAMP)
}

const formatDayData = (dayData: VolumeChartEntry): ChartDayData => ({
  bucket: dayjs.unix(dayData.date).utc().startOf('day').toISOString(),
  volumeUSD: dayData.volumeUSD.toString(),
})

async function fetchPaginatedData<T>(
  client: GraphQLClient,
  query: string,
  variables: Omit<Record<string, unknown>, 'skip'>,
): Promise<T[]> {
  let skip = 0
  const results: T[] = []
  let hasMore = true

  while (hasMore) {
    // eslint-disable-next-line no-await-in-loop
    const response = await client.request<Record<string, T[]>>(query, { ...variables, skip })
    const data = Object.values(response)[0]

    if (!data.length) {
      hasMore = false
    } else {
      results.push(...data)
      hasMore = data.length === PAGE_SIZE
      skip += PAGE_SIZE
    }
  }

  return results
}

function formatDaysData(data: DayData[], startTimestamp: number, endTimestamp: number): VolumeChartEntry[] {
  return data
    .filter((dayData) => dayData.volumeUSD && dayData.date >= startTimestamp && dayData.date <= endTimestamp)
    .map((dayData) => ({
      date: dayData.date,
      volumeUSD: parseFloat(dayData.volumeUSD),
    }))
    .sort((a, b) => a.date - b.date)
}

// Main Functions
export async function fetchChartData(client: GraphQLClient): Promise<ChartDayData[]> {
  try {
    const data = await fetchPaginatedData<DayData>(client, QUERIES.GLOBAL, {
      startTime: MIN_TIMESTAMP,
    })
    return data.map((dayData) =>
      formatDayData({
        date: dayData.date,
        volumeUSD: parseFloat(dayData.volumeUSD),
      }),
    )
  } catch (error) {
    console.error('Failed to fetch chart data:', error)
    return []
  }
}

export async function fetchVolumeChartData(chainId: ChainId): Promise<{ error: boolean; data?: ChartDayData[] }> {
  try {
    const subgraphUrl = V3_SUBGRAPHS[chainId]
    if (!subgraphUrl) throw new Error(`No subgraph URL for chain ${chainId}`)

    const data = await fetchChartData(new GraphQLClient(subgraphUrl))
    return { error: false, data: data.length ? data : undefined }
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}

async function fetchEntityVolumeData(
  address: string,
  client: GraphQLClient,
  period: string,
  query: string,
): Promise<ChartDayData[]> {
  const endTimestamp = dayjs.utc().unix()
  const startTimestamp = getStartTimestamp(period)

  try {
    const data = await fetchPaginatedData<DayData>(client, query, {
      address,
      startTime: startTimestamp,
    })

    const filledData = formatDaysData(data, startTimestamp, endTimestamp)
    return filledData.map(formatDayData)
  } catch (error) {
    console.error('Failed to fetch volume data:', error)
    return []
  }
}

export const fetchTokenVolumeData = (address: string, client: GraphQLClient, period: string = '1Y') =>
  fetchEntityVolumeData(address, client, period, QUERIES.TOKEN)

export const fetchPoolVolumeData = (address: string, client: GraphQLClient, period: string = '1Y') =>
  fetchEntityVolumeData(address, client, period, QUERIES.POOL)

export async function fetchTokenVolumeChartData(
  address: string,
  chainId: ChainId,
  period: string = '1Y',
): Promise<{ error: boolean; data?: ChartDayData[] }> {
  try {
    const subgraphUrl = V3_SUBGRAPHS[chainId]
    if (!subgraphUrl) throw new Error(`No subgraph URL for chain ${chainId}`)

    const data = await fetchTokenVolumeData(address, new GraphQLClient(subgraphUrl), period)
    return { error: false, data: data.length ? data : undefined }
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}

export async function fetchPoolVolumeChartData(
  address: string,
  chainId: ChainId,
  period: string = '1Y',
): Promise<{ error: boolean; data?: ChartDayData[] }> {
  try {
    const subgraphUrl = V3_SUBGRAPHS[chainId]
    if (!subgraphUrl) throw new Error(`No subgraph URL for chain ${chainId}`)

    const data = await fetchPoolVolumeData(address, new GraphQLClient(subgraphUrl), period)
    return { error: false, data: data.length ? data : undefined }
  } catch (e) {
    console.error(e)
    return { error: true }
  }
}
