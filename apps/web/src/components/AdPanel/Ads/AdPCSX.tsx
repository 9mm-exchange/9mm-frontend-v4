import { useTranslation } from '@pancakeswap/localization'
import { Text } from '@pancakeswap/uikit'
import { BodyText } from '../BodyText'
import { AdButton } from '../Button'
import { AdCard } from '../Card'

import { AdPlayerProps } from '../types'

const learnMoreLink = 'https://9mm-pro.gitbook.io/9mm-pro/'
const actionLink = '/swap?utm_source=Website&utm_medium=homepage'

export const AdPCSX = (props: AdPlayerProps) => {
  const { t } = useTranslation()

  return (
    <AdCard imageUrl={undefined} {...props}>
      <BodyText mb="0">
        <Text as="span" color="secondary" bold>
          {t('LOWEST')}
        </Text>{' '}
        {t('Fee Swaps on Pulsechain, Sonic, Bsc, & Base')}
      </BodyText>

      <AdButton variant="text" href={learnMoreLink} isExternalLink>
        {t('Learn More')}
      </AdButton>

      <AdButton mt="4px" href={actionLink} chevronRightIcon>
        {t('Swap Now!')}
      </AdButton>
    </AdCard>
  )
}
