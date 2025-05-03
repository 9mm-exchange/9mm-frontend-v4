import { useTranslation } from '@pancakeswap/localization'
import { Text } from '@pancakeswap/uikit'
import { AdPlayerProps } from '@pancakeswap/widgets-internal'

import { BodyText } from '../BodyText'
import { AdButton } from '../Button'
import { AdCard } from '../Card'

import { getImageUrl } from '../utils'

const learnMoreLink = 'https://9x.9mm.pro/'

export const AdPCSxSolana = (props: Omit<AdPlayerProps, 'config'>) => {
  const { t } = useTranslation()

  return (
    <AdCard imageUrl={getImageUrl('img_swap')} {...props}>
      <BodyText mb="0">
        <Text as="span" color="text" bold fontSize="14px">
          {t('Swap Tokens on 9x with lowest Slippage.')}
        </Text>
      </BodyText>

      <AdButton mt="16px" href={learnMoreLink} externalIcon isExternalLink>
        {t('Learn More')}
      </AdButton>
    </AdCard>
  )
}
