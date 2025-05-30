import { optiTokens } from '@pancakeswap/tokens'

import { StableSwapPool } from '../../types'

export const pools: StableSwapPool[] = [
  {
    lpSymbol: 'usdc-usdt LP',
    lpAddress: '0xF2a249e1fd08ee026CCeB3F1528363F4B27200D6',
    token: optiTokens.usdc,
    quoteToken: optiTokens.usdt,
    stableSwapAddress: '0xAae8BD246a526E2071B210153Ee29fcE7Cb3eccE',
    infoStableSwapAddress: '0x6403Ca4cB89C1Bcbd1c136BdE0528084DE4C4893',
    stableLpFee: 0.005,
    stableLpFeeRateOfTotalFee: 0.5,
    stableTotalFee: 0,
  },
]
