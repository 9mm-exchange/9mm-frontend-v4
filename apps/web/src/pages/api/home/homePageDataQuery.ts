import { ChainId } from '@pancakeswap/chains'
import { ASSET_CDN } from 'config/constants/endpoints'
import { HomepageChain, HomePageCurrency, HomePagePartner } from './types'

export const partners: HomePagePartner[] = [
  {
    logo: `${ASSET_CDN}/web/landing/partner/x.png`,
    link: 'https://x.com/9mm_pro',
    name: 'X',
  },
  {
    logo: `${ASSET_CDN}/web/landing/partner/telegram.png`,
    link: 'https://t.me/ninemmpro',
    name: 'Telegram',
  },
  {
    logo: `${ASSET_CDN}/web/landing/partner/discord.png`,
    link: '#',
    name: 'Discord',
  },
  {
    logo: `${ASSET_CDN}/web/landing/partner/instagram.png`,
    link: '#',
    name: 'Instagram',
  },
  {
    logo: `${ASSET_CDN}/web/landing/partner/youtube.png`,
    link: '#',
    name: 'Youtube',
  },
]

export const homePageCurrencies: HomePageCurrency[] = [
  'usd',
  'eur',
  'gbp',
  'hkd',
  'cad',
  'aud',
  'brl',
  'jpy',
  'krw',
  'vnd',
  'idr',
].map((symbol) => {
  return {
    symbol,
    logo: `${ASSET_CDN}/web/onramp/currencies/${symbol}.png`,
  }
})

export function homePageChainsInfo() {
  const evms = [
    // ChainId.BSC,
    // ChainId.ETHEREUM,
    ChainId.PULSECHAIN,
    ChainId.SONIC,
    ChainId.OPTIPULSE,
    ChainId.BASE,
    // ChainId.ARBITRUM_ONE,
    // ChainId.ZKSYNC,
    // ChainId.LINEA,
    // ChainId.POLYGON_ZKEVM,
  ]

  const evmChains: HomepageChain[] = evms.map((chainId) => {
    return {
      logo: `${ASSET_CDN}/web/chains/svg/${chainId}.svg`,
      logoM: `${ASSET_CDN}/web/chains/svg/${chainId}-m.svg`,
      logoL: `${ASSET_CDN}/web/chains/svg/${chainId}-l.svg`,
    }
  })

  evmChains.push(
    {
      logo: `${ASSET_CDN}/web/chains/svg/aptos.svg`,
      logoM: `${ASSET_CDN}/web/chains/svg/aptos-m.svg`,
      logoL: `${ASSET_CDN}/web/chains/svg/aptos-l.svg`,
    },
    {
      logo: `${ASSET_CDN}/web/chains/svg/${ChainId.OPBNB}.svg`,
      logoM: `${ASSET_CDN}/web/chains/svg/${ChainId.OPBNB}-m.svg`,
      logoL: `${ASSET_CDN}/web/chains/svg/${ChainId.OPBNB}-l.svg`,
    },
  )
  return evmChains
}
