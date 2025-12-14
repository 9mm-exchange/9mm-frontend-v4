import { BLOCKS_SUBGRAPHS } from '@pancakeswap/chains'
import { gql, request } from 'graphql-request'
import RedisClient from 'lib/redis'
import orderBy from 'lodash/orderBy'
import { unstable_cache as unstableCache } from 'next/cache'
import { Block } from 'state/info/types'

// Cache configuration (1 hour)
const CACHE_DURATION = 3600 // 1 hour in seconds

const getBlockSubqueries = (timestamps: number[]): string =>
  timestamps
    .map(
      (timestamp) =>
        `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${
          timestamp + 600
        } }) {
        number
      }`,
    )
    .join('\n')

const getBlockSubquery = (timestamp: number) => gql`
  query {
    blocks(where: { timestamp: ${timestamp} }) {
      number
      timestamp
    }
  }
`

/**
 * Redis-backed block fetcher with caching strategy
 */
const getBlockWithRedis = async (timestamp: number, chainId: number): Promise<Block | null> => {
  const cacheKey = `block:${chainId}:${timestamp}`

  try {
    const result = await RedisClient.getWithFallback(cacheKey, async () => {
      const { blocks } = await request<{ blocks: Block[] }>(BLOCKS_SUBGRAPHS[chainId], getBlockSubquery(timestamp))
      return blocks?.[0] ?? null
    })
    return result.data
  } catch (error) {
    console.error(`Error fetching block for timestamp ${timestamp}:`, error)
    throw error
  }
}

/**
 * Redis-backed blocks fetcher with caching strategy
 */
const getBlocksWithRedis = async (
  timestamps: number[],
  chainId: number,
  sortDirection: 'asc' | 'desc' = 'desc',
): Promise<Block[]> => {
  // Fix: timestamps are in seconds, need to multiply by 1000 for Date constructor
  const cacheKey = `blocks:${chainId}:${timestamps
    .map((ts) => new Date(ts * 1000).toISOString().split('T')[0])
    .join(',')}`

  try {
    const result = await RedisClient.getWithFallback(cacheKey, async () => {
      const query = gql`
          query blocks {
            ${getBlockSubqueries(timestamps)}
          }
        `

      const fetchedData = await request<Record<string, Block[]>>(BLOCKS_SUBGRAPHS[chainId], query)

      const blocks: Block[] = []
      for (const key of Object.keys(fetchedData)) {
        const blockData = fetchedData[key]
        if (blockData?.length > 0) {
          blocks.push({
            timestamp: key.split('t')[1],
            number: parseInt(blockData[0].number.toString(), 10),
          })
        }
      }

      return orderBy(blocks, (block) => block.number, sortDirection)
    })
    return result.data
  } catch (error) {
    console.error('Error fetching blocks for timestamps:', error)
    throw error
  }
}

// Cached version of getBlockByTimestamp
export const getBlockByTimestamp = unstableCache(getBlockWithRedis, ['block-by-timestamp'], {
  revalidate: CACHE_DURATION,
})

// Cached version of getBlocksByTimestamp
export const getBlocksByTimestamp = unstableCache(getBlocksWithRedis, ['blocks-by-timestamp'], {
  revalidate: CACHE_DURATION,
})
