/* eslint-disable jsx-a11y/iframe-has-title */
import { FARMS_API } from 'config/constants/endpoints'
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      // eslint-disable-next-line no-param-reassign
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html translate="no">
        <Head>
          {process.env.NEXT_PUBLIC_NODE_PRODUCTION && (
            <link rel="preconnect" href={process.env.NEXT_PUBLIC_NODE_PRODUCTION} />
          )}
          <link rel="preconnect" href={FARMS_API} />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
            rel="stylesheet"
          />

          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/logo.png" />
          <link rel="manifest" href="/manifest.json" />
          <style>{`
            .background-blobs {
              position: absolute;
              inset: 0;
              z-index: 0;
              overflow: hidden;
            }
            html, body, div#pair, a , button, button#swap-button, input{
              text-transform: uppercase!important;
            }
            
            .blob {
              position: absolute;
              border-radius: 9999px;
              filter: blur(60px);
              animation: pulseSlow 4s ease-in-out infinite;
              opacity: 0.7;
            }

            .blob1 {
              top: 25%;
              left: 25%;
              width: 16rem;
              height: 16rem;
              background-color: #ef4444; /* primary */
            }

            .blob2 {
              bottom: 25%;
              right: 25%;
              width: 20rem;
              height: 20rem;
              background-color: rgba(0, 112, 243, 0.2); /* accent */
              animation-delay: 1s;
            }

            @keyframes pulseSlow {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.1);
              }
            }
          `}</style>
        </Head>
        <body>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_NEW_GTAG}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
          {/* <div className="background-blobs">
            <div className="blob blob1" />
            <div className="blob blob2" />
          </div> */}
          <Main />
          <NextScript />
          <div id="portal-root" />
        </body>
      </Html>
    )
  }
}

export default MyDocument
