import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | 9mm Swap',
  defaultTitle: 'Game | 9mm Swap',
  description: 'Play different games on 9mm Swap, using CAKE and 9mm Swap NFTs',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@9mm_pro',
    site: '@9mm_pro',
  },
  openGraph: {
    title: '9mm Swap - A next evolution DeFi exchange on Pulse Chain and major EVMs',
    description: 'Play different games on 9mm Swap, using 9mm and  NFTs',
    images: [{ url: 'https://tokens.9mm.pro/web/og/swap.jpg' }],
  },
}
