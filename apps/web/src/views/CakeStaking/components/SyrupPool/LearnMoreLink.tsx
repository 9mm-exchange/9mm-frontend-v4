import { useTranslation } from '@pancakeswap/localization'
import { Link, StyledLink } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import NextLink from 'next/link'
import { memo } from 'react'

export const LearnMoreLink: React.FC<{ withArrow?: boolean }> = ({ withArrow }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  return (
    <Link
      style={{
        display: 'inline',
        color: withArrow ? theme.colors.yellow : 'white',
        textDecoration: 'underline',
        fontSize: 14,
        marginLeft: 3,
      }}
      href="https://9mm-pro.gitbook.io/9mm-pro/products/vecake/migrate-from-cake-pool"
      external
    >
      {t('Learn more')}
      {withArrow && '»'}
    </Link>
  )
}

export const CakeStakingPageLink: React.FC = memo(() => {
  const { t } = useTranslation()
  return (
    <NextLink href="/cake-staking">
      <StyledLink
        style={{
          display: 'inline',
          textDecoration: 'underline',
          fontSize: 14,
          marginLeft: 3,
          color: 'white',
        }}
      >
        {t('CAKE staking page')}
      </StyledLink>
    </NextLink>
  )
})
