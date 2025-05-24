import { ChainId } from '@pancakeswap/chains'

import { StableSwapPool } from '../../types'

import { pools as optiPools } from './optipulse'

export type StableSwapPoolMap<TChainId extends number> = {
  [chainId in TChainId]: StableSwapPool[]
}

export const STABLE_POOL_MAP = {
  [ChainId.OPTIPULSE]: optiPools,
} satisfies StableSwapPoolMap<StableSupportedChainId>

export const isStableSwapSupported = (chainId: number | undefined): chainId is StableSupportedChainId => {
  if (!chainId) {
    return false
  }
  return STABLE_SUPPORTED_CHAIN_IDS.includes(chainId)
}

export const STABLE_SUPPORTED_CHAIN_IDS = [ChainId.OPTIPULSE] as const

export type StableSupportedChainId = (typeof STABLE_SUPPORTED_CHAIN_IDS)[number]
