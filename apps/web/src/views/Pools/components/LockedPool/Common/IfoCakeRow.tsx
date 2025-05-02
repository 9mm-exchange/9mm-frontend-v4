import { useTranslation } from '@pancakeswap/localization'
import { BalanceWithLoading, Box, Flex, Link, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useIfoCeiling, useIfoCredit } from 'state/pools/hooks'
import { styled } from 'styled-components'
import { getICakeWeekDisplay } from 'views/Pools/helpers'

const InlineLink = styled(Link)`
  display: inline;
`

const IfoCakeRow: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const credit = useIfoCredit()
  const ceiling = useIfoCeiling()
  const weeksDisplay = getICakeWeekDisplay(ceiling)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <Text>
        {t(
          'The number of iCAKE equals the locked staking amount if the staking duration is longer than %weeks% weeks. If the staking duration is less than %weeks% weeks, it will linearly decrease based on the staking duration.',
          {
            weeks: weeksDisplay,
          },
        )}
      </Text>
      <InlineLink external href="https://9mm-pro.gitbook.io/9mm-pro/products/ifo-initial-farm-offering/icake">
        {t('Learn more about iCAKE')}
      </InlineLink>
    </Box>,
    {
      placement: 'bottom-start',
    },
  )

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {tooltipVisible && tooltip}
      <TooltipText>
        <Text ref={targetRef} color="textSubtle" bold fontSize="12px">
          {t('iCAKE')}
        </Text>
      </TooltipText>
      <BalanceWithLoading color="text" bold fontSize="16px" decimals={3} value={getBalanceNumber(credit)} />
    </Flex>
  )
}

export default IfoCakeRow
