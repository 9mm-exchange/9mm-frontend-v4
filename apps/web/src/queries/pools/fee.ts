import { Token } from '@pancakeswap/swap-sdk-core'
import { DEPLOYER_ADDRESSES, FeeAmount, Pool, computePoolAddress } from '@pancakeswap/v3-sdk'
import { v3PoolStateABI } from 'config/abi/v3PoolState'
import { publicClient } from 'utils/viem'
import { Address } from 'viem'

// Pool cache to avoid redundant instantiation
class PoolCache {
  private static readonly MAX_ENTRIES = 128

  private static pools: Pool[] = []

  private static addresses: Map<string, Address> = new Map()

  static getPoolAddress(deployerAddress: Address, tokenA: Token, tokenB: Token, fee: FeeAmount): Address {
    const [t0, t1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
    const key = `${deployerAddress}:${t0.address}:${t1.address}:${fee}`

    if (this.addresses.has(key)) return this.addresses.get(key)!

    const address = computePoolAddress({ deployerAddress, tokenA: t0, tokenB: t1, fee })
    this.addresses.set(key, address)

    // Maintain cache size
    if (this.addresses.size > this.MAX_ENTRIES) {
      const keys = Array.from(this.addresses.keys()).slice(this.MAX_ENTRIES / 2)
      for (const k of keys) this.addresses.delete(k)
    }

    return address
  }
}

export async function getPoolsWithLiquidityByFeeTiers(
  tokenA: Token,
  tokenB: Token,
  chainId: number,
  feeTiers: FeeAmount[] = [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH],
): Promise<Address[]> {
  try {
    const deployerAddress = DEPLOYER_ADDRESSES[chainId]
    if (!deployerAddress) return []

    const [t0, t1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

    const poolAddresses = feeTiers.map((fee) => PoolCache.getPoolAddress(deployerAddress, t0, t1, fee))

    const client = publicClient({ chainId })

    const liquidityCalls = poolAddresses.map((address) => ({
      address,
      abi: v3PoolStateABI,
      functionName: 'liquidity',
    }))

    const liquidityResults = await client.multicall({ contracts: liquidityCalls, allowFailure: true })

    return poolAddresses.filter((_, i) => {
      const result = liquidityResults[i]?.result
      const liquidity = Array.isArray(result) ? result[0] : result
      return liquidity && liquidity > 0n
    })
  } catch (error) {
    console.error('Error fetching pools with liquidity:', error)
    return []
  }
}

export function createToken(chainId: number, address: string, decimals: number, symbol: string, name?: string): Token {
  return new Token(chainId, address as Address, decimals, symbol, name)
}
