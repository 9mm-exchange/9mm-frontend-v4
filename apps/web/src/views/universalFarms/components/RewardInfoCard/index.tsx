import { useTranslation } from '@pancakeswap/localization'
import { Box, FlexGap, Link, RewardIcon, Text } from '@pancakeswap/uikit'
import React, { memo } from 'react'
import styled from 'styled-components'

const StyledCard = styled.div`
  background: ${({ theme }) => theme.colors.positive10};
  border: 1px solid ${({ theme }) => theme.colors.positive20};
  border-radius: 16px;
  padding: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
`
const IconWrapper = styled(Box)`
  color: ${({ theme }) => theme.colors.success};
`
const StyledRewardIcon = styled(RewardIcon)`
  width: 24px;
  height: 24px;
`

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.success};
  font-weight: 600;
  display: inline-flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }
`

interface RewardInfoCardProps {
  title?: string
  description?: string
  linkText?: string
  linkUrl?: string
}

export const RewardInfoCard: React.FC<RewardInfoCardProps> = memo(() => {
  const { t } = useTranslation()

  return (
    <StyledCard>
      <FlexGap alignItems="center" justifyContent="flex-start" gap="4px">
        <IconWrapper>
          <StyledRewardIcon />
        </IconWrapper>
        <Box>
          <Text bold>{t('Boost Your Yield with Ethena')}</Text>
        </Box>
      </FlexGap>
      <Text mb="8px">
        {t('Add liquidity to these pools (USDe/USDT and sUSDe/USDe) to earn massive rewards - 30x Ethena Points!')}
      </Text>
      <FlexGap
        gap="4px"
        justifyContent="flex-start"
        alignItems="center"
        style={{ whiteSpace: 'nowrap' }}
        flexWrap="wrap"
      >
        <StyledLink external href="https://app.ethena.fi/join">
          {t(`Claim your rewards & learn more`)}
        </StyledLink>
        <Text as="span">{t(`on Ethena's official site.`)}</Text>
      </FlexGap>
    </StyledCard>
  )
})
