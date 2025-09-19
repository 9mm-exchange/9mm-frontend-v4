import { ChainId } from '@pancakeswap/chains'
import set from 'lodash/set'
import { fetchUniversalFarms } from '../fetchUniversalFarms'
import { UniversalFarmConfig } from '../types'
import { getFarmConfigKey } from '../utils'
import { bscTestnetFarmConfig } from './bscTestnet'
import { polygonZkEVMTestnetFarmConfig } from './polygonZkEVMTestnet'
import { zkSyncTestnetFarmConfig } from './zkSyncTestnet'

const chainIds: ChainId[] = [ChainId.BASE, ChainId.PULSECHAIN, ChainId.PULPCHAIN, ChainId.SONIC]

export const fetchAllUniversalFarms = async (): Promise<UniversalFarmConfig[]> => {
  try {
    const farmPromises = chainIds.map((chainId) => fetchUniversalFarms(chainId))
    const allFarms = await Promise.all(farmPromises)
    const combinedFarms = allFarms.flat()

    return combinedFarms
  } catch (error) {
    console.error('Failed to fetch universal farms:', error)
    return []
  }
}

export const fetchAllUniversalFarmsMap = async (): Promise<Record<string, UniversalFarmConfig>> => {
  try {
    const farmConfig = await fetchAllUniversalFarms()

    return farmConfig.reduce((acc, farm) => {
      set(acc, getFarmConfigKey(farm), farm)
      return acc
    }, {} as Record<string, UniversalFarmConfig>)
  } catch (error) {
    console.error('Failed to fetch universal farms map:', error)
    return {}
  }
}

export const UNIVERSAL_FARMS_WITH_TESTNET: UniversalFarmConfig[] = [
  ...bscTestnetFarmConfig,
  ...polygonZkEVMTestnetFarmConfig,
  ...zkSyncTestnetFarmConfig,
]
