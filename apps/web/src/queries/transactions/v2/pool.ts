import { V2_SUBGRAPHS } from '@pancakeswap/chains'
import { gql, GraphQLClient } from 'graphql-request'

const BASE_TRANSACTIONS_QUERY = gql`
  query transactions {
    mints(first: 50, orderBy: timestamp, orderDirection: desc) {
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
      sender
      to
      amount0
      amount1
      amountUSD
      timestamp
    }
    swaps(first: 50, orderBy: timestamp, orderDirection: desc) {
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
      from
      to
      amount0In
      amount0Out
      amount1In
      amount1Out
      amountUSD
      timestamp
    }
    burns(first: 50, orderBy: timestamp, orderDirection: desc) {
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
      sender
      to
      amount0
      amount1
      amountUSD
      timestamp
    }
  }
`

const POOL_TRANSACTIONS_QUERY = gql`
  query transactions($poolAddress: String!) {
    mints(first: 50, orderBy: timestamp, orderDirection: desc, where: { pair: $poolAddress }) {
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
      sender
      to
      amount0
      amount1
      amountUSD
      timestamp
    }
    swaps(first: 50, orderBy: timestamp, orderDirection: desc, where: { pair: $poolAddress }) {
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
      from
      to
      amount0In
      amount0Out
      amount1In
      amount1Out
      amountUSD
      timestamp
    }
    burns(first: 50, orderBy: timestamp, orderDirection: desc, where: { pair: $poolAddress }) {
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
      sender
      to
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

export async function fetchPoolTransactions(chainId: number, address?: string): Promise<Result> {
  try {
    const subgraphUrl = V2_SUBGRAPHS[chainId]
    if (!subgraphUrl) {
      throw new Error(`No subgraph URL found for chainId ${chainId}`)
    }

    const client = new GraphQLClient(subgraphUrl)

    let data
    if (address) {
      data = await client.request<typeof data>(POOL_TRANSACTIONS_QUERY, {
        poolAddress: address.toLowerCase(),
      })
    } else {
      data = await client.request<typeof data>(BASE_TRANSACTIONS_QUERY)
    }

    const formatted: TransactionOutput[] = []

    // Process mints
    data.mints.forEach((m) => {
      const [transactionHash] = m.id.split('-')
      formatted.push({
        id: m.id,
        type: 'mint',
        transactionHash,
        poolId: `${m.token0.id}-${m.token1.id}`,
        amount0: m.amount0,
        amount1: m.amount1,
        amountUSD: m.amountUSD,
        origin: m.to,
        recipient: m.to,
        timestamp: new Date(parseInt(m.timestamp) * 1000).toISOString(),
        token0: m.token0,
        token1: m.token1,
      })
    })

    // Process swaps
    data.swaps.forEach((s) => {
      const [transactionHash] = s.id.split('-')
      formatted.push({
        id: s.id,
        type: 'swap',
        transactionHash,
        poolId: `${s.token0.id}-${s.token1.id}`,
        amount0: (parseFloat(s.amount0In) - parseFloat(s.amount0Out)).toString(),
        amount1: (parseFloat(s.amount1In) - parseFloat(s.amount1Out)).toString(),
        amountUSD: s.amountUSD,
        origin: s.from,
        recipient: s.to,
        timestamp: new Date(parseInt(s.timestamp) * 1000).toISOString(),
        token0: s.token0,
        token1: s.token1,
      })
    })

    // Process burns
    data.burns.forEach((b) => {
      const [transactionHash] = b.id.split('-')
      formatted.push({
        id: b.id,
        type: 'burn',
        transactionHash,
        poolId: `${b.token0.id}-${b.token1.id}`,
        amount0: b.amount0,
        amount1: b.amount1,
        amountUSD: b.amountUSD,
        origin: b.sender,
        recipient: b.to,
        timestamp: new Date(parseInt(b.timestamp) * 1000).toISOString(),
        token0: b.token0,
        token1: b.token1,
      })
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
