import { useTranslation } from '@pancakeswap/localization'
import { Text } from '@pancakeswap/uikit'
import { BodyText } from '../BodyText'
import { AdButton } from '../Button'
import { AdCard } from '../Card'

import { AdPlayerProps } from '../types'

const actionLink = 'https://otc.9mm.pro/'

export const AdSpringboard = (props: AdPlayerProps) => {
  const { t } = useTranslation()

  return (
    <AdCard imageUrl={undefined} {...props}>
      <BodyText mb="0">
        {t('Trade Your Token on OTC in minutes, on our ')}

        <Text fontSize="inherit" as="span" color="secondary" bold>
          {t('OTC Market!!')}
        </Text>
      </BodyText>
      <AdButton mt="16px" href={actionLink} externalIcon isExternalLink>
        {t('Learn More')}
      </AdButton>
    </AdCard>
  )
}
