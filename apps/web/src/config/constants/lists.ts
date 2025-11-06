import { ChainId } from '@pancakeswap/chains'

export const PANCAKE_EXTENDED = 'https://tokens.pancakeswap.finance/pancakeswap-extended.json'

const COINGECKO = 'https://tokens.pancakeswap.finance/coingecko.json'
export const PANCAKE_ETH_DEFAULT =
  'https://raw.githubusercontent.com/9mm-exchange/app-tokens/refs/heads/main/eth-tokenlist.json'
export const PANCAKE_PULSE_DEFAULT =
  'https://raw.githubusercontent.com/9mm-exchange/app-tokens/refs/heads/main/9mm-tokenlist.json'
export const PANCAKE_SONIC_DEFAULT =
  'https://raw.githubusercontent.com/9mm-exchange/app-tokens/refs/heads/main/sonic-tokenlist.json'

export const PANCAKE_OPTIPULSE_DEFAULT =
  'https://raw.githubusercontent.com/9mm-exchange/app-tokens/refs/heads/main/pulpchain-tokenlist.json'

export const PANCAKE_ZKSYNC_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-zksync-default.json'
export const PANCAKE_POLYGON_ZKEVM_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-polygon-zkevm-default.json'
export const PANCAKE_ARB_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-arbitrum-default.json'
export const PANCAKE_LINEA_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-linea-default.json'
export const PANCAKE_BASE_DEFAULT =
  'https://raw.githubusercontent.com/9mm-exchange/app-tokens/refs/heads/main/base-tokenlist.json'
export const PANCAKE_OPBNB_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-opbnb-default.json'

export const PITEAS_PULSE_MM =
  'https://raw.githubusercontent.com/piteasio/app-tokens/refs/heads/main/piteas-tokenlist.json'
export const PANCAKE_BSC_MM = 'https://tokens.pancakeswap.finance/pancakeswap-bnb-mm.json'
export const PANCAKE_ARB_MM = 'https://tokens.pancakeswap.finance/pancakeswap-arb-mm.json'
export const PANCAKE_MONAD_TESTNET_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-monad-testnet-default.json'

const COINGECKO_ETH = 'https://tokens.coingecko.com/uniswap/all.json'
const COINGECKO_PULSE = 'https://tokens.coingecko.com/pulsechain/all.json'
const COINGECKO_SONIC = 'https://tokens.coingecko.com/sonic/all.json'

// export const CMC = 'https://tokens.pancakeswap.finance/cmc.json' // not updated for a while

const PULSE_URLS = [PANCAKE_PULSE_DEFAULT, PITEAS_PULSE_MM, COINGECKO_PULSE]
const SONIC_URLS = [PANCAKE_SONIC_DEFAULT, COINGECKO_SONIC]
const OPTIPULSE_URLS = [PANCAKE_OPTIPULSE_DEFAULT]
const ETH_URLS = [PANCAKE_ETH_DEFAULT, COINGECKO_ETH]
const BSC_URLS = [PANCAKE_EXTENDED, COINGECKO, PANCAKE_BSC_MM]
const POLYGON_ZKEVM_URLS = [
  PANCAKE_POLYGON_ZKEVM_DEFAULT,
  // 'https://tokens.coingecko.com/polygon-zkevm/all.json'
]
const ARBITRUM_URLS = [
  PANCAKE_ARB_DEFAULT,
  PANCAKE_ARB_MM,
  // 'https://tokens.coingecko.com/arbitrum-one/all.json'
]
const LINEA_URLS = [PANCAKE_LINEA_DEFAULT, 'https://tokens.coingecko.com/linea/all.json']
const ZKSYNC_URLS = [
  PANCAKE_ZKSYNC_DEFAULT,
  // 'https://tokens.coingecko.com/zksync/all.json'
]
const OP_SUPER_CHAIN_URL =
  'https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json'
const BASE_URLS = [PANCAKE_BASE_DEFAULT, OP_SUPER_CHAIN_URL, 'https://tokens.coingecko.com/base/all.json']
const OPBNB_URLS = [PANCAKE_OPBNB_DEFAULT]
const MONAD_TESTNET_URLS = [PANCAKE_MONAD_TESTNET_DEFAULT]

// List of official tokens list
export const OFFICIAL_LISTS = [PANCAKE_EXTENDED, PANCAKE_ETH_DEFAULT]

export const UNSUPPORTED_LIST_URLS: string[] = []
export const WARNING_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  ...BSC_URLS,
  ...ETH_URLS,
  ...PULSE_URLS,
  ...SONIC_URLS,
  ...OPTIPULSE_URLS,
  ...ZKSYNC_URLS,
  ...LINEA_URLS,
  ...POLYGON_ZKEVM_URLS,
  ...BASE_URLS,
  ...ARBITRUM_URLS,
  OP_SUPER_CHAIN_URL,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
  ...WARNING_LIST_URLS,
  ...OPBNB_URLS,
  ...MONAD_TESTNET_URLS,
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [
  PANCAKE_EXTENDED,
  PANCAKE_ETH_DEFAULT,
  PANCAKE_PULSE_DEFAULT,
  PANCAKE_SONIC_DEFAULT,
  PANCAKE_OPTIPULSE_DEFAULT,
  PANCAKE_BASE_DEFAULT,
  PANCAKE_BSC_MM,
  PANCAKE_ARB_MM,
  PANCAKE_ETH_DEFAULT,
  PANCAKE_POLYGON_ZKEVM_DEFAULT,
  PANCAKE_ZKSYNC_DEFAULT,
  PANCAKE_ARB_DEFAULT,
  PANCAKE_LINEA_DEFAULT,
  PANCAKE_BASE_DEFAULT,
  PANCAKE_OPBNB_DEFAULT,
  OP_SUPER_CHAIN_URL,
  COINGECKO,
  COINGECKO_ETH,
  PANCAKE_MONAD_TESTNET_DEFAULT,
]

export const MULTI_CHAIN_LIST_URLS: { [chainId: number]: string[] } = {
  [ChainId.BSC]: BSC_URLS,
  [ChainId.ETHEREUM]: ETH_URLS,
  [ChainId.PULSECHAIN]: PULSE_URLS,
  [ChainId.SONIC]: SONIC_URLS,
  [ChainId.OPTIPULSE]: OPTIPULSE_URLS,
  [ChainId.ZKSYNC]: ZKSYNC_URLS,
  [ChainId.POLYGON_ZKEVM]: POLYGON_ZKEVM_URLS,
  [ChainId.ARBITRUM_ONE]: ARBITRUM_URLS,
  [ChainId.LINEA]: LINEA_URLS,
  [ChainId.BASE]: BASE_URLS,
  [ChainId.OPBNB]: OPBNB_URLS,
  [ChainId.MONAD_TESTNET]: MONAD_TESTNET_URLS,
}
