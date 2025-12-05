import { useUnifiedWalletContext } from '@jup-ag/wallet-adapter'
import { ResetCSS, ToastListener, type PancakeTheme } from '@pancakeswap/uikit'
import { AdPanel, AdPanelCardProps } from '@pancakeswap/widgets-internal'
import { Menu } from 'components/Menu'
import { Providers } from 'components/Provider'
import { adList, commonLayoutWhitelistedPages } from 'config/adBanner/config'
import type { NextPage } from 'next'
import { DefaultSeo } from 'next-seo'
import { SEO } from 'next-seo.config'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { Fragment, useEffect, useMemo } from 'react'
import { createGlobalStyle } from 'styled-components'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  dialog {
    max-width: 100%;
    max-height: 100%;
  }

  li {
    list-style: none;
  }
`

function MyApp(props: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#ef4444" />
      </Head>
      {process.env.NEXT_PUBLIC_GTM_ID ? (
        <Script
          strategy="afterInteractive"
          id="google-tag"
          dangerouslySetInnerHTML={{
            __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
`,
          }}
        />
      ) : null}
      <DefaultSeo {...SEO} />
      <Providers>
        <ResetCSS />
        <GlobalStyle />
        <App {...props} />
      </Providers>

      <noscript>
        <iframe
          title="gtm"
          src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  )
}

type NextPageWithLayout = NextPage & {
  Layout?: React.FC<React.PropsWithChildren<unknown>>
  /** render component without all layouts */
  pure?: true
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const adConfig: AdPanelCardProps['config'] = useMemo(
    () => ({
      commonLayoutWhitelistedPages,
      adList,
    }),
    [],
  )

  const { showModal } = useUnifiedWalletContext()

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [showModal])

  if (Component.pure) {
    return <Component {...pageProps} />
  }

  // Use the layout defined at the page level, if available
  const Layout = Component.Layout || Fragment

  return (
    <Menu>
      <Layout>
        <Component {...pageProps} />
        <AdPanel mt="22px" config={adConfig} />
      </Layout>
      <ToastListener />
    </Menu>
  )
}

export default MyApp
