import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | 9mm Swap',
  defaultTitle: '9mm Swap',
  description: 'Trade, earn, and own crypto on the all-in-one multichain DEX',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@9mm_pro',
    site: '@9mm_pro',
  },
  openGraph: {
    title: "🥞 9mm Swap Aptos - Everyone's Favorite DEX",
    description: 'Trade, earn, and own crypto on the all-in-one multichain DEX',
    images: [{ url: 'https://tokens.9mm.pro/web/og/swap.jpg' }],
  },
}
