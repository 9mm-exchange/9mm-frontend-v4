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
  {
    lpSymbol: 'usdc-dai LP',
    lpAddress: '0x492947F2cF62d0D0aC02F0232dD24287F804E274',
    token: optiTokens.usdc,
    quoteToken: optiTokens.dai,
    stableSwapAddress: '0x9e8011232A475689b706E992e3CE8A41A053cCF4',
    infoStableSwapAddress: '0x6403Ca4cB89C1Bcbd1c136BdE0528084DE4C4893',
    stableLpFee: 0.005,
    stableLpFeeRateOfTotalFee: 0.5,
    stableTotalFee: 0,
  },
  {
    lpSymbol: 'usdt-dai LP',
    lpAddress: '0x05248adbDCbE2Da59Fe1F3E45FAB3065d33b4E6D',
    token: optiTokens.usdt,
    quoteToken: optiTokens.dai,
    stableSwapAddress: '0xCCb7bC23958CEdb20e1Cf93Ec81167E50927b04a',
    infoStableSwapAddress: '0x6403Ca4cB89C1Bcbd1c136BdE0528084DE4C4893',
    stableLpFee: 0.005,
    stableLpFeeRateOfTotalFee: 0.5,
    stableTotalFee: 0,
  },
]
