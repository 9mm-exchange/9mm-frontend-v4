import { BLOCKS_SUBGRAPHS } from '@pancakeswap/chains'
import { gql, request } from 'graphql-request'
import orderBy from 'lodash/orderBy'
import { Block } from 'state/info/types'
import { multiQuery } from 'utils/infoQueryHelpers'

const getBlockSubqueries = (timestamps: number[]): string[] =>
  timestamps.map(
    (timestamp) =>
      `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${
        timestamp + 600
      } }) {
      number
    }`,
  )

const blocksQueryConstructor = (subqueries: string[]) =>
  gql`query blocks {
    ${subqueries}
  }`

const getBlockSubquery = (timestamp: number) => gql`
  query {
    blocks(where: { timestamp: ${timestamp} }) {
      number
      timestamp
    }
  }
`

export const getBlockByTimestamp = async (timestamp: number, chainId: number): Promise<Block | null> => {
  try {
    const { blocks } = await request<{ blocks: Block[] }>(BLOCKS_SUBGRAPHS[chainId], getBlockSubquery(timestamp))
    return blocks?.[0] ?? null
  } catch (error) {
    console.error(`Error fetching block for timestamp ${timestamp}:`, error)
    return null
  }
}

export const getBlocksByTimestamp = async (
  timestamps: number[],
  chainId: number,
  sortDirection: 'asc' | 'desc' = 'desc',
  skipCount = 500,
): Promise<Block[] | null> => {
  try {
    const fetchedData = await multiQuery(
      blocksQueryConstructor,
      getBlockSubqueries(timestamps),
      BLOCKS_SUBGRAPHS[chainId],
      skipCount,
    )

    if (!fetchedData) return null

    const blocks: Block[] = []
    for (const key of Object.keys(fetchedData)) {
      const blockData = fetchedData[key]
      if (blockData?.length > 0) {
        blocks.push({
          timestamp: key.split('t')[1],
          number: parseInt(blockData[0].number, 10),
        })
      }
    }

    return orderBy(blocks, (block) => block.number, sortDirection)
  } catch (error) {
    console.error('Error fetching blocks for timestamps:', error)
    return null
  }
}
