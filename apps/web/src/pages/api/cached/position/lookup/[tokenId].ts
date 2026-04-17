import { ChainId } from '@pancakeswap/chains'
import { NFT_POSITION_MANAGER_ADDRESSES } from '@pancakeswap/v3-sdk'
import RedisClient from 'lib/redis'
import { NextApiHandler } from 'next'
import { getViemClients } from 'utils/viem.server'

const CACHE_DURATION = 600
const CACHE_HEADERS = {
  'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=3600`,
  'CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
  'Vercel-CDN-Cache-Control': `public, s-maxage=${CACHE_DURATION}`,
}

const CANDIDATE_CHAINS: readonly ChainId[] = [
  ChainId.PULSECHAIN,
  ChainId.ETHEREUM,
  ChainId.BASE,
  ChainId.BSC,
  ChainId.SONIC,
]

const MAX_TOKEN_ID_DIGITS = 78

const POSITIONS_ABI = [
  {
    name: 'positions',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [
      { name: 'nonce', type: 'uint96' },
      { name: 'operator', type: 'address' },
      { name: 'token0', type: 'address' },
      { name: 'token1', type: 'address' },
      { name: 'fee', type: 'uint24' },
      { name: 'tickLower', type: 'int24' },
      { name: 'tickUpper', type: 'int24' },
      { name: 'liquidity', type: 'uint128' },
      { name: 'feeGrowthInside0LastX128', type: 'uint256' },
      { name: 'feeGrowthInside1LastX128', type: 'uint256' },
      { name: 'tokensOwed0', type: 'uint128' },
      { name: 'tokensOwed1', type: 'uint128' },
    ],
  },
] as const

const ZERO = '0x0000000000000000000000000000000000000000'

type Hit = {
  chainId: ChainId
  token0: `0x${string}`
  token1: `0x${string}`
  fee: number
  liquidity: string
}

type Result = {
  error: boolean
  data: {
    tokenId: string
    chainId: ChainId
    liquidity: string
    token0: `0x${string}`
    token1: `0x${string}`
    fee: number
    alternativeChains: ChainId[]
  } | null
}

const probePositions = async (tokenId: bigint): Promise<Hit[]> => {
  const probes = await Promise.all(
    CANDIDATE_CHAINS.map(async (chainId): Promise<Hit | null> => {
      const address = NFT_POSITION_MANAGER_ADDRESSES[chainId]
      if (!address) return null
      const client = getViemClients({ chainId })
      if (!client) return null
      try {
        const r = (await client.readContract({
          address: address as `0x${string}`,
          abi: POSITIONS_ABI,
          functionName: 'positions',
          args: [tokenId],
        })) as readonly unknown[]
        const token0 = r?.[2] as `0x${string}` | undefined
        if (!token0 || token0.toLowerCase() === ZERO) return null
        return {
          chainId,
          token0,
          token1: r[3] as `0x${string}`,
          fee: Number(r[4]),
          liquidity: (r[7] as bigint).toString(),
        }
      } catch {
        return null
      }
    }),
  )
  return probes.filter((h): h is Hit => h != null)
}

const handler: NextApiHandler = async (req, res) => {
  try {
    const raw = req.query.tokenId
    const idStr = Array.isArray(raw) ? raw[0] : raw
    if (!idStr || !/^\d+$/.test(idStr) || idStr.length > MAX_TOKEN_ID_DIGITS) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(400).json({ error: 'invalid_token_id' })
    }

    const apiPath = `position/lookup/${idStr}`
    const result = await RedisClient.fetchWithCache<Result>(apiPath, async () => {
      const tokenId = BigInt(idStr)
      const hits = await probePositions(tokenId)
      if (hits.length === 0) {
        return { error: true, data: null }
      }
      const live = hits.find((h) => BigInt(h.liquidity) > 0n)
      const best = live ?? hits[0]
      return {
        error: false,
        data: {
          tokenId: idStr,
          chainId: best.chainId,
          liquidity: best.liquidity,
          token0: best.token0,
          token1: best.token1,
          fee: best.fee,
          alternativeChains: hits.filter((h) => h !== best).map((h) => h.chainId),
        },
      }
    })

    if (result.data.error || !result.data.data) {
      res.setHeader('Cache-Control', 'public, s-maxage=60')
      return res.status(404).json({ error: 'not_found' })
    }

    Object.entries(CACHE_HEADERS).forEach(([k, v]) => res.setHeader(k, v))
    res.setHeader('X-Cache-Status', result.fromCache ? 'HIT' : 'MISS')
    res.setHeader('X-Cache-Key', result.cacheKey)
    return res.status(200).json(result.data.data)
  } catch (error) {
    console.error('position lookup API error:', error)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(500).json({
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
    })
  }
}

export default handler
