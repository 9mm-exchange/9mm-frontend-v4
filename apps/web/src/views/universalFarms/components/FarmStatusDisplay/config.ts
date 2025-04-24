import { ChainId } from '@pancakeswap/chains'
import { RewardProvider } from './types'

export const rewardConfig = {
  [ChainId.BSC]: [
    { poolAddress: '0xdc35157217A3AeFF3dcaF2e86327254FBF9f4601', rewardProvider: RewardProvider.Ethena },
    { poolAddress: '0x345E7D44E1eb8894b4524Cfc918906718bc1FFe2', rewardProvider: RewardProvider.Ethena },
  ],
}
