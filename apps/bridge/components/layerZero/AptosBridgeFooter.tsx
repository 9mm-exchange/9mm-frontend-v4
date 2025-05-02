import { LinkExternal } from '@pancakeswap/uikit'
import PoweredBy from 'components/layerZero/PoweredBy'

const AptosBridgeFooter = ({ isCake }: { isCake?: boolean }) => {
  return (
    <>
      <PoweredBy />
      {isCake ? (
        <>
          <LinkExternal m="20px auto" href="https://9mm-pro.gitbook.io/9mm-pro/products/cake-bridging/evms">
            How to bridge?
          </LinkExternal>
          <LinkExternal m="20px auto" href="https://9mm-pro.gitbook.io/9mm-pro/products/cake-bridging/faq">
            Need Help?
          </LinkExternal>
        </>
      ) : (
        <>
          <LinkExternal m="20px auto" href="https://9mm-pro.gitbook.io/9mm-pro/products/cake-bridging/aptos">
            How to bridge?
          </LinkExternal>
          <LinkExternal m="20px auto" href="https://9mm-pro.gitbook.io/9mm-pro/products/cake-bridging/faq">
            Need Help?
          </LinkExternal>
          <LinkExternal m="20px auto" href="https://9mm-pro.gitbook.io/9mm-pro/get-started-aptos/aptos-coin-guide">
            Don’t see your assets?
          </LinkExternal>
        </>
      )}
    </>
  )
}

export default AptosBridgeFooter
