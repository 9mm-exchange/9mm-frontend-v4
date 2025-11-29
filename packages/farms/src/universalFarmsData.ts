// universalFarmsData.ts
import { ChainId } from '@pancakeswap/chains'

export const universalFarmsData = [
  {
    pid: 1,
    chainId: ChainId.OPTIPULSE,
    protocol: 'v3',
    token0: {
      address: '0xed22410bF8e1F0Fc7b556d556C9428f359FC37Af',
      symbol: 'WTPLS',
      name: 'Wrapped Test PLS',
      decimals: 6,
      chainId: ChainId.OPTIPULSE,
      projectLink: '',
    },
    token1: {
      address: '0xF856b792526FB3192992ff916d97Ef38E1b5F74b',
      symbol: '9mm',
      name: '9mm',
      decimals: 18,
      chainId: ChainId.OPTIPULSE,
      projectLink: '',
    },
    lpAddress: '0xfbfcbeab3a4b0edd9a474e20a8ed72976968d9d6',
    feeAmount: 2500,
    isPinned: true,
    order: 1,
  },
]
