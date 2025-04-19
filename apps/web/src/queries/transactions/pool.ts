import { V3_SUBGRAPHS } from '@pancakeswap/chains'
import { gql, GraphQLClient } from 'graphql-request'

const createTransactionsQuery = (address?: string) => gql`
  query transactions($poolAddress: String) {
    mints(
      first: 100, 
      orderBy: timestamp, 
      orderDirection: desc
      ${address ? `, where:{ pool: $poolAddress }` : ''}
    ) {
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
      timestamp
    }
    swaps(
      first: 100, 
      orderBy: timestamp, 
      orderDirection: desc
      ${address ? `, where:{ pool: $poolAddress }` : ''}
    ) {
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
      timestamp
    }
    burns(
      first: 100, 
      orderBy: timestamp, 
      orderDirection: desc
      ${address ? `, where:{ pool: $poolAddress }` : ''}
    ) {
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
      timestamp
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
  mints: {
    id: string
    token0: Token
    token1: Token
    origin: string
    owner: string
    amount0: string
    amount1: string
    amountUSD: string
    timestamp: string
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
    timestamp: string
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
    timestamp: string
  }[]
}

export async function fetchPoolTransactions(chainId: number, address: string | undefined): Promise<Result> {
  try {
    const subgraphUrl = V3_SUBGRAPHS[chainId]
    const dataClient = new GraphQLClient(subgraphUrl)

    const query = createTransactionsQuery(address)

    const variables = address ? { poolAddress: address.toLowerCase() } : {}

    const data = await dataClient.request<TransactionEntry>(query, variables)

    if (!data) {
      console.log('No transactions found.')
      return {
        error: true,
        data: undefined,
      }
    }

    const formatted = [
      ...data.mints.map((m) => ({
        id: m.id,
        type: 'mint' as const,
        transactionHash: m.id.split('#')[0],
        poolId: m.id.split('#')[1],
        amount0: m.amount0,
        amount1: m.amount1,
        amountUSD: m.amountUSD,
        origin: m.origin,
        recipient: m.owner,
        timestamp: new Date(parseInt(m.timestamp) * 1000).toISOString(),
        token0: m.token0,
        token1: m.token1,
      })),
      ...data.burns.map((b) => ({
        id: b.id,
        type: 'burn' as const,
        transactionHash: b.id.split('#')[0],
        poolId: b.id.split('#')[1],
        amount0: b.amount0,
        amount1: b.amount1,
        amountUSD: b.amountUSD,
        origin: b.origin,
        recipient: b.owner,
        timestamp: new Date(parseInt(b.timestamp) * 1000).toISOString(),
        token0: b.token0,
        token1: b.token1,
      })),
      ...data.swaps.map((s) => ({
        id: s.id,
        type: 'swap' as const,
        transactionHash: s.id.split('#')[0],
        poolId: s.id.split('#')[1],
        amount0: s.amount0,
        amount1: s.amount1,
        amountUSD: s.amountUSD,
        origin: s.origin,
        recipient: s.recipient,
        timestamp: new Date(parseInt(s.timestamp) * 1000).toISOString(),
        token0: s.token0,
        token1: s.token1,
      })),
    ]

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
