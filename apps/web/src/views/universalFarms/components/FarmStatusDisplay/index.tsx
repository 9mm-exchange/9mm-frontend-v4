import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, FlexGap, Link, RewardIcon, Text, useMatchBreakpoints, useTooltip } from '@pancakeswap/uikit'

import React from 'react'
import styled from 'styled-components'

const IconWrapper = styled(Box)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  width: 33px;
  height: 33px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.positive10};
  color: ${({ theme }) => theme.colors.positive60};
`

const StyledRewardIcon = styled(RewardIcon)`
  width: 18px;
  height: 18px;
`

export const RewardStatusDisplay: React.FC = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <Box>
        <Text bold as="span">
          {t('Earn 30x Ethena Points!')}
        </Text>
      </Box>
      <Text as="span">{t('Add liquidity to this pool and earn 30x Ethena points!')}</Text>
      <FlexGap gap="4px" justifyContent="flex-start" display="inline-flex" alignItems="center" flexWrap="wrap">
        <Link mt="8px" external href="https://app.ethena.fi/join">
          {t('Claim your rewards & learn more')}
        </Link>
        <Text as="span">{t(`on Ethena's official site.`)}</Text>
      </FlexGap>
    </Box>,
    {
      placement: isMobile ? 'auto' : 'right',
    },
  )

  return (
    <Flex alignItems="center">
      <IconWrapper ref={targetRef}>
        <StyledRewardIcon />
      </IconWrapper>
      {tooltipVisible && tooltip}
    </Flex>
  )
}
