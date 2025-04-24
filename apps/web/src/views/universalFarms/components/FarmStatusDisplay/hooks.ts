import { ChainId } from '@pancakeswap/chains'
import memoize from 'lodash/memoize'
import { isAddressEqual } from 'utils'
import { rewardConfig } from './config'

// Pure function to check if a farm has rewards
export const checkHasReward = memoize(
  (chainId?: ChainId, poolAddress?: string): boolean => {
    if (!chainId || !poolAddress) return false
    const chainConfig = rewardConfig[chainId]
    if (!chainConfig) return false

    return chainConfig.some((config) => isAddressEqual(config.poolAddress, poolAddress))
  },
  (chainId, poolAddress) => `${chainId}#${poolAddress}`,
)
