import { optiTokens } from '@pancakeswap/tokens'

import { StableSwapPool } from '../../types'

export const pools: StableSwapPool[] = [
  {
    lpSymbol: 'usdc-usdt LP',
    lpAddress: '0x490474aF074682057312E0786cc2DfAe7b590f2C',
    token: optiTokens.usdc,
    quoteToken: optiTokens.usdt,
    stableSwapAddress: '0x869EFa4362a08005ee59bf2821B40F45a15106b2',
    infoStableSwapAddress: '0x6403Ca4cB89C1Bcbd1c136BdE0528084DE4C4893',
    stableLpFee: 0.005,
    stableLpFeeRateOfTotalFee: 0.5,
    stableTotalFee: 0,
  },
]
