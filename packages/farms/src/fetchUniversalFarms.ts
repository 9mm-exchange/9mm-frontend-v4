// fetchUniversalFarms.ts
import { ChainId } from '@pancakeswap/chains'
import { ERC20Token } from '@pancakeswap/sdk'
import { Protocol, UniversalFarmConfig } from './types'
import { universalFarmsData } from './universalFarmsData'

const farmCache: Record<string, UniversalFarmConfig[]> = {}

export const fetchUniversalFarms = async (chainId: ChainId, protocol?: Protocol) => {
  const cacheKey = `${chainId}-${protocol || 'all'}`

  // Return cached data if it exists
  if (farmCache[cacheKey]) {
    return farmCache[cacheKey]
  }

  try {
    // Filter data based on chainId and protocol
    let filteredData = universalFarmsData.filter((farm) => farm.chainId === chainId)

    if (protocol) {
      filteredData = filteredData.filter((farm) => farm.protocol === protocol)
    }

    // Convert to ERC20Token instances
    const newData: UniversalFarmConfig[] = filteredData.map((p: any) => ({
      ...p,
      token0: new ERC20Token(
        p.token0.chainId,
        p.token0.address,
        p.token0.decimals,
        p.token0.symbol,
        p.token0.name,
        p.token0.projectLink,
      ),
      token1: new ERC20Token(
        p.token1.chainId,
        p.token1.address,
        p.token1.decimals,
        p.token1.symbol,
        p.token1.name,
        p.token1.projectLink,
      ),
    }))

    // Cache the result before returning it
    farmCache[cacheKey] = newData

    return newData
  } catch (error) {
    console.error('Error loading universal farms from local data:', error)
    return []
  }
}
