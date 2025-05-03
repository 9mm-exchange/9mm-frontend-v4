import { useTranslation } from '@pancakeswap/localization'
import { AdButton } from '../Button'
import { AdCard } from '../Card'

import { BodyText } from '../BodyText'
import { AdPlayerProps } from '../types'

const actionLink = 'https://9mm-pro.gitbook.io/9mm-pro/overview/revenue-sharing-model'

export const AdCakeStaking = (props: AdPlayerProps) => {
  const { t } = useTranslation()

  return (
    <AdCard imageUrl={undefined} {...props}>
      <BodyText mb="0">
        {t('Provide LP 9mm/WPLS and Earn up to 40% APR !', {
          apr: 0,
        })}
      </BodyText>

      <AdButton variant="text" href={actionLink} isExternalLink>
        {t('Learn More')}
      </AdButton>

      <AdButton mt="4px" href="/add/0x7b39712Ef45F7dcED2bBDF11F3D5046bA61dA719/PLS/10000" chevronRightIcon>
        {t('LP 9mm')}
      </AdButton>
    </AdCard>
  )
}
