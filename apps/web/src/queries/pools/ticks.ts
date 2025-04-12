import { V3_SUBGRAPHS } from '@pancakeswap/chains'
import { gql, request } from 'graphql-request'

interface Tick {
  id: string
  tickIdx: number
  liquidityGross: string
  liquidityNet: string
  price0: string
  price1: string
}

interface TickDataResponse {
  ticks: Array<{
    id: string
    tickIdx: string
    liquidityGross: string
    liquidityNet: string
    price0: string
    price1: string
  }>
}

interface TickFetchResult {
  startCursor?: string
  endCursor?: string
  hasNextPage?: boolean
  rows: Tick[]
  error?: boolean
  message?: string
}

const TICKS_QUERY = gql`
  query TicksByPool($first: Int, $where: Tick_filter) {
    ticks(where: $where, orderBy: tickIdx, orderDirection: asc, first: $first) {
      id
      tickIdx
      liquidityGross
      liquidityNet
      price0
      price1
    }
  }
`

// Helper functions for cursor encoding/decoding
const encodeCursor = (tickIdx: number): string => {
  return Buffer.from(`tickIdx=${tickIdx}`).toString('base64')
}

const decodeCursor = (cursor: string): number => {
  const decoded = Buffer.from(cursor, 'base64').toString('ascii')
  const match = decoded.match(/tickIdx=(-?\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

export const getTicksData = async (
  poolAddress: string,
  chainId: number,
  cursor?: string,
  pageSize = 5,
): Promise<TickFetchResult> => {
  const subgraphUrl = V3_SUBGRAPHS[chainId]

  if (!subgraphUrl) {
    return {
      rows: [],
      error: true,
      message: `Unsupported chainId: ${chainId}`,
    }
  }

  try {
    const where: any = { pool: poolAddress.toLowerCase() }

    // If cursor is provided, add tickIdx_gt filter
    if (cursor) {
      const lastTickIdx = decodeCursor(cursor)
      where.tickIdx_gt = lastTickIdx
    }

    const variables = {
      first: pageSize,
      where,
    }

    const data = await request<TickDataResponse>(subgraphUrl, TICKS_QUERY, variables)

    if (data.ticks.length === 0) {
      return {
        rows: [],
        startCursor: cursor,
        endCursor: cursor,
        hasNextPage: false,
      }
    }

    const rows: Tick[] = data.ticks.map((tick) => ({
      ...tick,
      tickIdx: parseInt(tick.tickIdx, 10),
    }))

    const startCursor = cursor || encodeCursor(rows[0].tickIdx)
    const endCursor = encodeCursor(rows[rows.length - 1].tickIdx)
    const hasNextPage = data.ticks.length === pageSize

    return {
      startCursor,
      endCursor,
      hasNextPage,
      rows,
    }
  } catch (error) {
    console.error(`Error fetching ticks for pool ${poolAddress}:`, error)
    return {
      rows: [],
      error: true,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
