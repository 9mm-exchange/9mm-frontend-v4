import { ChainId } from '@pancakeswap/chains'
import { Token } from '@pancakeswap/sdk'
import memoize from 'lodash/memoize'
import { safeGetAddress } from 'utils'
import { isAddress } from 'viem'

const mapping = {
  [ChainId.BSC]: 'smartchain',
  [ChainId.ETHEREUM]: 'eth',
  [ChainId.PULSECHAIN]: 'token-logo',
  [ChainId.SONIC]: 'sonic-logos',
  [ChainId.OPTIPULSE]: 'optipulse',
  [ChainId.POLYGON_ZKEVM]: 'polygonzkevm',
  [ChainId.ZKSYNC]: 'zksync',
  [ChainId.ARBITRUM_ONE]: 'arbitrum',
  [ChainId.LINEA]: 'linea',
  [ChainId.BASE]: 'base-logos',
}

const getTokenLogoURL = memoize(
  (token?: Token) => {
    if (token && mapping[token.chainId] && isAddress(token.address)) {
      return `https://raw.githubusercontent.com/9mm-exchange/app-tokens/refs/heads/main/${
        mapping[token.chainId]
      }/${safeGetAddress(token.address)}.png`
    }

    return null
  },
  (t) => `${t?.chainId}#${t?.address}`,
)

export const getTokenLogoURLByAddress = memoize(
  (address?: string, chainId?: number) => {
    if (address && chainId && mapping[chainId] && isAddress(address)) {
      return `https://raw.githubusercontent.com/9mm-exchange/app-tokens/refs/heads/main/${
        mapping[chainId]
      }/assets/${safeGetAddress(address)}/logo.png`
    }
    return null
  },
  (address, chainId) => `${chainId}#${address}`,
)

export default getTokenLogoURL
