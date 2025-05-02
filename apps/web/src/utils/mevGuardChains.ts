import type { Chain } from 'viem'
import { bsc } from 'viem/chains'

export const BSCMevGuardChain = {
  ...bsc,
  rpcUrls: {
    default: {
      http: ['https://bscrpc.pancakeswap.finance'],
    },
  },
  name: '9mm Swap MEV Guard',
} satisfies Chain
