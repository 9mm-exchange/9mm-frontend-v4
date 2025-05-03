import { useTranslation } from '@pancakeswap/localization'
import { Balance, Box, ErrorIcon, Flex, FlexGap, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import styled from 'styled-components'
import { Tooltips } from 'views/CakeStaking/components/Tooltips'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { useEpochVotePower } from '../hooks/useEpochVotePower'

const StyledBox = styled(Box)<{ $isMobile?: boolean }>`
  border-radius: 16px;
  background: linear-gradient(229deg, #22c55e -13.69%, #22c55e 91.33%);
  padding: 8px 16px;
  display: inline-flex;
  align-items: center;
  min-width: 100%;
  flex-direction: ${({ $isMobile }) => ($isMobile ? 'column' : 'row')};

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 460px;
  }
`

interface RemainingVotePowerProps {
  votedPercent: number
}

const RemainingVotePowerContent = ({
  locked,
  balance,
  votePower,
  realPower,
  epochPower,
  showWillUnlockWarning,
  isMobile,
}: {
  locked: boolean
  balance: BN
  votePower: BN
  realPower: BN
  epochPower: bigint
  showWillUnlockWarning: boolean
  isMobile: boolean
}) => {
  const { t } = useTranslation()

  const unlocksoonContent = (
    <>
      {t(
        'Your positions are unlocking soon. Therefore, you have no veCAKE balance at the end of the current voting epoch while votes are being tallied. ',
      )}
      <br />
      <br />
      {t('Extend your lock to cast votes.')}
    </>
  )

  const noLockedContent = (
    <>
      {t('You have no locked CAKE.')} {t('To cast your vote, lock your CAKE for 3 weeks or more.')}
    </>
  )

  const UnlockingWarning = (
    <FlexGap gap="4px" alignItems="center">
      <Text textTransform="uppercase" color="warning" bold fontSize={isMobile ? 24 : 24}>
        {t('unlocking')}
      </Text>
      <Tooltips content={unlocksoonContent}>
        <ErrorIcon color="warning" style={{ marginBottom: '-2.5px' }} />
      </Tooltips>
    </FlexGap>
  )

  const RemainingPower = (
    <Tooltips disabled={locked} content={noLockedContent}>
      <FlexGap gap="4px" alignItems="center">
        <Balance
          fontSize={isMobile ? '20px' : '24px'}
          bold
          color={locked ? 'white' : 'warning'}
          lineHeight="110%"
          value={getBalanceNumber(votePower) || 0}
          decimals={2}
        />
        {!locked ? (
          <ErrorIcon
            width={isMobile ? '16px' : undefined}
            height={isMobile ? '16px' : undefined}
            color="warning"
            style={{ marginBottom: '-2.5px' }}
          />
        ) : null}
      </FlexGap>
    </Tooltips>
  )

  return isMobile ? (
    <>
      <Flex width="100%" flexDirection="row" alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <img src="/images/cake-staking/token-vecake.png" alt="token-vecake" width="32px" />
          <Text fontSize="14px" bold color="white" lineHeight="120%" ml="8px">
            {t('MY veCAKE')}
          </Text>
        </Flex>
        <FlexGap gap="4px" alignItems="center">
          <Balance
            fontSize="20px"
            color={showWillUnlockWarning ? 'warning' : 'white'}
            bold
            lineHeight="110%"
            value={getBalanceNumber(balance)}
            decimals={2}
          />
          {showWillUnlockWarning ? (
            <Tooltips content={unlocksoonContent}>
              <ErrorIcon color="warning" style={{ marginBottom: '-3.5px' }} />
            </Tooltips>
          ) : null}
        </FlexGap>
      </Flex>
      <Flex flexDirection="row" justifyContent="space-between" width="100%" alignItems="flex-start">
        <Text fontSize="14px" bold color="white" lineHeight="2">
          {t('Remaining veCAKE')}
        </Text>
        {epochPower === 0n && realPower.gt(0) ? UnlockingWarning : RemainingPower}
      </Flex>
    </>
  ) : (
    <>
      <img src="/images/cake-staking/token-vecake.png" alt="token-vecake" width="58px" />
      <Flex flexDirection="row" justifyContent="space-between" width="100%" ml="4px" alignItems="center">
        <Text fontSize="20px" bold color="white" lineHeight="2">
          {t('Remaining veCAKE')}
        </Text>
        {epochPower === 0n && realPower.gt(0) ? UnlockingWarning : RemainingPower}
      </Flex>
    </>
  )
}

export const RemainingVotePower: React.FC<RemainingVotePowerProps> = ({ votedPercent }) => {
  const { isMobile } = useMatchBreakpoints()

  const { cakeLockedAmount } = useCakeLockStatus()
  const locked = useMemo(() => cakeLockedAmount > 0n, [cakeLockedAmount])
  const { balance: veCakeBalance } = useVeCakeBalance()
  const { data: epochPower } = useEpochVotePower()

  const { balance } = useVeCakeBalance()
  const showWillUnlockWarning = useMemo(() => {
    return balance.gt(0) && epochPower === 0n
  }, [balance, epochPower])

  // @note: real power is EpochEndPower * (10000 - PercentVoted)
  // use veCakeBalance as cardinal number for better UX understanding
  const votePower = useMemo(() => {
    return veCakeBalance.times(10000 - votedPercent * 100).dividedBy(10000)
  }, [veCakeBalance, votedPercent])

  const realPower = useMemo(() => {
    return new BN(epochPower.toString()).times(10000 - votedPercent * 100).dividedBy(10000)
  }, [epochPower, votedPercent])

  return (
    <StyledBox id="vecake-vote-power" $isMobile={isMobile}>
      <RemainingVotePowerContent
        locked={locked}
        balance={balance}
        votePower={votePower}
        realPower={realPower}
        epochPower={epochPower}
        showWillUnlockWarning={showWillUnlockWarning}
        isMobile={isMobile}
      />
    </StyledBox>
  )
}
