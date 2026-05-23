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

export const V3_DEFAULT_POOL_SELECTOR_CONFIG: PoolSelectorConfigChainMap = {
  [ChainId.BSC]: {
    topN: 2,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 4,
  },
  [ChainId.BSC_TESTNET]: {
    topN: 2,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 4,
  },
  [ChainId.ETHEREUM]: {
    topN: 2,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 4,
  },
  [ChainId.PULSECHAIN]: {
    // Widened from default (2,2,2,1,3,4) so the 9mm V3 router considers
    // ALL 5 fee tiers (100/500/2500/10000/20000) as direct-swap candidates
    // and more intermediate-hub diversity. preth supports a high gas cap so
    // extra multicall quotes are essentially free here.
    topN: 4,
    topNDirectSwaps: 5,
    topNTokenInOut: 4,
    topNSecondHop: 2,
    topNWithEachBaseToken: 4,
    topNWithBaseToken: 6,
  },
  [ChainId.BASE]: {
    // Previously fell through to DEFAULT (2,2,2,1,3,3). Widened to match
    // the productive fee-tier coverage we use on PulseChain; Base public RPC
    // (and Chainstack) both handle the extra multicalls comfortably.
    topN: 4,
    topNDirectSwaps: 5,
    topNTokenInOut: 4,
    topNSecondHop: 2,
    topNWithEachBaseToken: 4,
    topNWithBaseToken: 6,
  },
  [ChainId.OPTIPULSE]: {
    topN: 2,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 4,
  },
  [ChainId.SONIC]: {
    topN: 2,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 4,
  },
  [ChainId.GOERLI]: {
    topN: 2,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 4,
  },
}

export const V2_DEFAULT_POOL_SELECTOR_CONFIG: PoolSelectorConfigChainMap = {
  [ChainId.BSC]: {
    topN: 3,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 3,
  },
  [ChainId.BSC_TESTNET]: {
    topN: 3,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 3,
  },
  [ChainId.ETHEREUM]: {
    topN: 3,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 3,
  },
  [ChainId.PULSECHAIN]: {
    // V2 has no fee tiers per pool but multiple V2-style sources exist
    // (9MMV2, NineInchV2, PulseXV1, PulseXV2). Widen TokenInOut + SecondHop
    // so the router considers more cross-DEX V2 routes.
    topN: 5,
    topNDirectSwaps: 3,
    topNTokenInOut: 4,
    topNSecondHop: 2,
    topNWithEachBaseToken: 4,
    topNWithBaseToken: 5,
  },
  [ChainId.BASE]: {
    // Previously fell through to DEFAULT. Many V2-style sources on Base
    // (Aerodrome V2, PancakeSwap V2, UniswapV2, BaseSwap, AlienBase, etc).
    topN: 5,
    topNDirectSwaps: 3,
    topNTokenInOut: 4,
    topNSecondHop: 2,
    topNWithEachBaseToken: 4,
    topNWithBaseToken: 5,
  },
  [ChainId.OPTIPULSE]: {
    topN: 3,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 3,
  },
  [ChainId.SONIC]: {
    topN: 3,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 3,
  },
  [ChainId.GOERLI]: {
    topN: 3,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 3,
  },
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
