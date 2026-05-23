import { ChainId } from '@pancakeswap/chains'
import { bscTokens } from '@pancakeswap/tokens'

import { PoolSelectorConfig, PoolSelectorConfigChainMap, TokenPoolSelectorConfigChainMap } from '../types'

export const DEFAULT_POOL_SELECTOR_CONFIG: PoolSelectorConfig = {
  topN: 2,
  topNDirectSwaps: 2,
  topNTokenInOut: 2,
  topNSecondHop: 1,
  topNWithEachBaseToken: 3,
  topNWithBaseToken: 3,
}

// Widened V3 pool-selector coverage across all supported chains.
// Upstream PancakeSwap defaults (topN:2, topNDirectSwaps:2, ...) were tuned
// for BSC mainnet's RPC load profile and lock the router to top-2-by-TVL
// pools on each side of the swap. For 9mm V3 forks with 4-5 fee tiers
// (100/500/2500/10000/20000), that meant only 2 of those fee tiers were
// ever quoted on the direct path — the others were silently dropped no
// matter how productive they would be. topNDirectSwaps=5 fixes that.
const WIDENED_V3: PoolSelectorConfig = {
  topN: 4,
  topNDirectSwaps: 5,
  topNTokenInOut: 4,
  topNSecondHop: 2,
  topNWithEachBaseToken: 4,
  topNWithBaseToken: 6,
}

// V2 has no per-pool fee tiers but multiple V2-style sources per chain
// (e.g. PulseXV1, PulseXV2, 9MMV2, NineInchV2 on Pulse). Widen TokenInOut
// and SecondHop so cross-DEX V2 routes get considered.
const WIDENED_V2: PoolSelectorConfig = {
  topN: 5,
  topNDirectSwaps: 3,
  topNTokenInOut: 4,
  topNSecondHop: 2,
  topNWithEachBaseToken: 4,
  topNWithBaseToken: 5,
}

export const V3_DEFAULT_POOL_SELECTOR_CONFIG: PoolSelectorConfigChainMap = {
  [ChainId.BSC]: WIDENED_V3,
  [ChainId.BSC_TESTNET]: WIDENED_V3,
  [ChainId.ETHEREUM]: WIDENED_V3,
  [ChainId.PULSECHAIN]: WIDENED_V3,
  [ChainId.BASE]: WIDENED_V3,
  [ChainId.OPTIPULSE]: WIDENED_V3,
  [ChainId.SONIC]: WIDENED_V3,
  [ChainId.GOERLI]: WIDENED_V3,
}

export const V2_DEFAULT_POOL_SELECTOR_CONFIG: PoolSelectorConfigChainMap = {
  [ChainId.BSC]: WIDENED_V2,
  [ChainId.BSC_TESTNET]: WIDENED_V2,
  [ChainId.ETHEREUM]: WIDENED_V2,
  [ChainId.PULSECHAIN]: WIDENED_V2,
  [ChainId.BASE]: WIDENED_V2,
  [ChainId.OPTIPULSE]: WIDENED_V2,
  [ChainId.SONIC]: WIDENED_V2,
  [ChainId.GOERLI]: WIDENED_V2,
}

// Use to configure pool selector config when getting quote from specific tokens
// Allow to increase or decrese the number of candidate pools to calculate routes from
export const V3_TOKEN_POOL_SELECTOR_CONFIG: TokenPoolSelectorConfigChainMap = {
  [ChainId.BSC]: {
    [bscTokens.ankr.address]: {
      topNTokenInOut: 4,
    },
    [bscTokens.ankrbnb.address]: {
      topNTokenInOut: 4,
    },
    [bscTokens.ankrETH.address]: {
      topNTokenInOut: 4,
    },
    [bscTokens.wbeth.address]: {
      topNSecondHop: 3,
    },
  },
}

export const V2_TOKEN_POOL_SELECTOR_CONFIG: TokenPoolSelectorConfigChainMap = {
  [ChainId.BSC]: {
    // GEM
    '0x701F1ed50Aa5e784B8Fb89d1Ba05cCCd627839a7': {
      topNTokenInOut: 4,
    },
  },
}
