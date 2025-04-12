import { V3_SUBGRAPHS } from '@pancakeswap/chains'
import { gql, GraphQLClient } from 'graphql-request'

const GLOBAL_TRANSACTIONS = gql`
  query transactions {
    transactions(first: 1000, orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      mints {
        id
        token0 {
          id
          symbol
          name
          decimals
        }
        token1 {
          id
          symbol
          name
          decimals
        }
        owner
        sender
        origin
        amount0
        amount1
        amountUSD
      }
      swaps {
        id
        token0 {
          id
          symbol
          name
          decimals
        }
        token1 {
          id
          symbol
          name
          decimals
        }
        origin
        recipient
        amount0
        amount1
        amountUSD
      }
      burns {
        id
        token0 {
          id
          symbol
          name
          decimals
        }
        token1 {
          id
          symbol
          name
          decimals
        }
        owner
        origin
        amount0
        amount1
        amountUSD
      }
    }
  }
`

interface Token {
  id: string
  name: string
  symbol: string
  decimals: number
}

interface TransactionOutput {
  id: string
  type: 'mint' | 'burn' | 'swap'
  transactionHash: string
  poolId: string
  amount0: string
  amount1: string
  amountUSD: string
  origin: string
  recipient: string
  timestamp: string
  token0: Token
  token1: Token
}

interface Result {
  error: boolean
  data: TransactionOutput[] | undefined
}

interface TransactionEntry {
  timestamp: string
  id: string
  mints: {
    id: string
    token0: Token
    token1: Token
    origin: string
    owner: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
  swaps: {
    id: string
    token0: Token
    token1: Token
    origin: string
    recipient: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
  burns: {
    id: string
    token0: Token
    token1: Token
    owner: string
    origin: string
    amount0: string
    amount1: string
    amountUSD: string
  }[]
}

interface TransactionResults {
  transactions: TransactionEntry[]
}

export async function fetchTopTransactions(chainId: number, address: string | undefined): Promise<Result> {
  try {
    const subgraphUrl = V3_SUBGRAPHS[chainId]
    const dataClient = new GraphQLClient(subgraphUrl)

    const data = await dataClient.request<TransactionResults>(GLOBAL_TRANSACTIONS, {
      client: dataClient,
      fetchPolicy: 'cache-first',
    })

    if (!data?.transactions) {
      console.log('No transactions found.')
      return {
        error: true,
        data: undefined,
      }
    }

    const formatted = data.transactions.flatMap((t) => {
      const poolId = t.id.split('#')[0]

      const filterByAddress = (entry: { token0: { id: string }; token1: { id: string } }) =>
        !address || entry.token0.id === address || entry.token1.id === address

      const mintEntries = t.mints.filter(filterByAddress).map((m) => ({
        id: m.id,
        type: 'mint' as const,
        transactionHash: t.id,
        poolId,
        amount0: m.amount0,
        amount1: m.amount1,
        amountUSD: m.amountUSD,
        origin: m.origin,
        recipient: m.owner,
        timestamp: new Date(parseInt(t.timestamp) * 1000).toISOString(),
        token0: m.token0,
        token1: m.token1,
      }))

      const burnEntries = t.burns.filter(filterByAddress).map((b) => ({
        id: b.id,
        type: 'burn' as const,
        transactionHash: t.id,
        poolId,
        amount0: b.amount0,
        amount1: b.amount1,
        amountUSD: b.amountUSD,
        origin: b.origin,
        recipient: b.owner,
        timestamp: new Date(parseInt(t.timestamp) * 1000).toISOString(),
        token0: b.token0,
        token1: b.token1,
      }))

      const swapEntries = t.swaps.filter(filterByAddress).map((s) => ({
        id: s.id,
        type: 'swap' as const,
        transactionHash: t.id,
        poolId,
        amount0: s.amount0,
        amount1: s.amount1,
        amountUSD: s.amountUSD,
        origin: s.origin,
        recipient: s.recipient,
        timestamp: new Date(parseInt(t.timestamp) * 1000).toISOString(),
        token0: s.token0,
        token1: s.token1,
      }))

      return [...mintEntries, ...burnEntries, ...swapEntries]
    })

    return {
      error: false,
      data: formatted,
    }
  } catch (error) {
    console.error('Failed to fetch transactions', error)

    return {
      error: true,
      data: undefined,
    }
  }
}
