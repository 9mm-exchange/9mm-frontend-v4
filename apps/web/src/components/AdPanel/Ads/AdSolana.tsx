import { useTranslation } from '@pancakeswap/localization'
import { Link, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { AdPlayerProps } from '@pancakeswap/widgets-internal'

import { BodyText } from '../BodyText'
import { AdButton } from '../Button'
import { AdCard } from '../Card'

const learnMoreLink = 'https://9mm-pro.gitbook.io/9mm-pro/overview/key-features-of-the-9mm-dex'
const actionLink = process.env.SOLANA_SWAP_PAGE ?? 'https://9x.9mm.pro/'
const imgURL = undefined

export const AdSolana = (props: Omit<AdPlayerProps, 'config'>) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <AdCard imageUrl={imgURL} {...props}>
      <BodyText mb="0">
        <Text as="span" color="text" bold fontSize="14px">
          {t('Swap Tokens on 9x with lowest Slippage.')}
        </Text>
      </BodyText>

      <Link style={!isMobile ? { display: 'inline' } : {}} fontSize="14px" href={actionLink}>
        {t('Swap Now')}
      </Link>

      <AdButton mt="16px" href={learnMoreLink} externalIcon isExternalLink>
        {t('Learn More')}
      </AdButton>
    </AdCard>
  )
}
