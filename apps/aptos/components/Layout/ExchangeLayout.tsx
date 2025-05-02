import { useTranslation } from '@pancakeswap/localization'
import { Image } from '@pancakeswap/uikit'
import { Swap } from '@pancakeswap/widgets-internal'

export const ExchangeLayout = ({ children }: React.PropsWithChildren) => {
  const { t } = useTranslation()
  return (
    <Swap.Page
      helpUrl="https://9mm-pro.gitbook.io/9mm-pro/get-started-aptos"
      externalText={t('Bridge assets to Aptos Chain')}
      externalLinkUrl="https://bridge.pancakeswap.finance/aptos"
      helpImage={<Image src="/help.png" width={178} height={243} alt="Aptos help" />}
    >
      {children}
    </Swap.Page>
  )
}
