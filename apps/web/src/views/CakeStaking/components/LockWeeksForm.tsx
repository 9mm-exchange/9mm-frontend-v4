import { useTranslation } from '@pancakeswap/localization'
import {
  AtomBox,
  AutoRow,
  BalanceInputProps,
  Box,
  Button,
  domAnimation,
  Flex,
  FlexGap,
  Image,
  LazyAnimatePresence,
  SwapCSS,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { SwapUIV2 } from '@pancakeswap/widgets-internal'
import { MAX_VECAKE_LOCK_WEEKS } from 'config/constants/veCake'
import { useAtom, useAtomValue } from 'jotai'
import React, { useCallback, useMemo } from 'react'
import { cakeLockWeeksAtom } from 'state/vecake/atoms'
import styled from 'styled-components'
import { useWriteIncreaseLockWeeksCallback } from '../hooks/useContractWrite'
import { useWriteWithdrawCallback } from '../hooks/useContractWrite/useWriteWithdrawCallback'
import { useMaxUnlockWeeks } from '../hooks/useMaxUnlockTime'
import { useCakeLockStatus } from '../hooks/useVeCakeUserInfo'
import { LockWeeksDataSet } from './DataSet'

const weeksOnMobile = [
  {
    value: 2,
    label: '2W',
  },
  {
    value: 26,
    label: '6M',
  },
  {
    value: 52,
    label: '1Y',
  },
  {
    value: 208,
    label: 'MAX',
  },
]

const weeks = [
  {
    value: 1,
    label: '1W',
  },
  {
    value: 4,
    label: '1M',
  },
  {
    value: 26,
    label: '6M',
  },
  {
    value: 52,
    label: '1Y',
  },
  {
    value: 208,
    label: '4Y',
  },
]

const ButtonBlocked = styled(Button)<{ selected?: boolean }>`
  flex: 1;
  white-space: nowrap;
  font-size: 12px;
  padding: 0 2px;
  color: ${({ selected, theme }) => (selected ? theme.colors.primary : 'inherit')};
  font-weight: 600;
  cursor: pointer;
`

const Divider = styled.div`
  width: 1px;
  height: 16px;
  background-color: ${({ theme }) => theme.colors.cardBorder};
  margin: 0 4px;
`

const WeekInput: React.FC<{
  value: BalanceInputProps['value']
  onUserInput: BalanceInputProps['onUserInput']
  disabled?: boolean
}> = ({ value, onUserInput, disabled }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { cakeLockExpired, cakeUnlockTime } = useCakeLockStatus()
  const showMax = useMemo(() => (cakeLockExpired ? false : cakeUnlockTime > 0), [cakeLockExpired, cakeUnlockTime])
  const weekOptions = useMemo(() => {
    const options = isMobile ? weeksOnMobile : weeks
    return showMax ? options.slice(0, options.length - 1) : options
  }, [showMax, isMobile])
  const maxUnlockWeeks = useMaxUnlockWeeks(MAX_VECAKE_LOCK_WEEKS, cakeLockExpired ? 0 : cakeUnlockTime)
  const onInput = useCallback(
    (v: string) => {
      if (Number(v) > maxUnlockWeeks) {
        onUserInput(String(maxUnlockWeeks))
      } else {
        onUserInput(v)
      }
    },
    [maxUnlockWeeks, onUserInput],
  )
  const handleWeekSelect = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const { week } = e.currentTarget.dataset
      if (week) {
        onInput(week)
      }
    },
    [onInput],
  )

  return (
    <AtomBox position="relative" id="lock-weeks-input" display="grid" gap="4px" width="100%">
      <AtomBox display="flex" alignItems="center" justifyContent="space-between" mb="8px">
        <Text color="textSubtle" fontSize={12} bold width="100%">
          {t('Lock Duration')}
        </Text>
        <LazyAnimatePresence mode="wait" features={domAnimation}>
          <FlexGap
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap="4px"
            minWidth="fit-content"
            color="textSubtle"
          >
            {weekOptions.map(({ value: v, label }, index) => (
              <React.Fragment key={v}>
                <ButtonBlocked
                  bold
                  as="p"
                  data-week={v}
                  disabled={disabled || maxUnlockWeeks < v}
                  onClick={handleWeekSelect}
                  selected={Number(value) === v}
                >
                  {label}
                </ButtonBlocked>
                {index < weekOptions.length - 1 && <Divider />}
              </React.Fragment>
            ))}

            {showMax ? (
              <>
                <Divider />
                <ButtonBlocked
                  as="p"
                  data-week={maxUnlockWeeks}
                  disabled={disabled || maxUnlockWeeks <= 0}
                  onClick={handleWeekSelect}
                  selected={Number(value) === maxUnlockWeeks}
                >
                  {t('Max')}
                </ButtonBlocked>
              </>
            ) : null}
          </FlexGap>
        </LazyAnimatePresence>
      </AtomBox>
      {/* <AtomBox display="flex" alignItems="center" justifyContent="space-between" mb="8px">
        <FlexGap justifyContent="space-between" flexWrap="wrap" gap="4px" width="100%">
          {weekOptions.map(({ value: v, label }) => (
            <ButtonBlocked
              key={v}
              data-week={v}
              disabled={disabled || maxUnlockWeeks < v}
              onClick={handleWeekSelect}
              scale="sm"
              variant={Number(value) === v ? 'subtle' : 'light'}
            >
              {label}
            </ButtonBlocked>
          ))}

          {showMax ? (
            <ButtonBlocked
              data-week={maxUnlockWeeks}
              disabled={disabled || maxUnlockWeeks <= 0}
              onClick={handleWeekSelect}
              scale="sm"
              variant={Number(value) === maxUnlockWeeks ? 'subtle' : 'light'}
            >
              {t('Max')}
            </ButtonBlocked>
          ) : null}
        </FlexGap>
      </AtomBox> */}
      <AtomBox
        display="flex"
        flexDirection="column"
        flexWrap="nowrap"
        position="relative"
        backgroundColor="backgroundAlt"
        zIndex="1"
      >
        <AtomBox
          as="label"
          className={SwapCSS.inputContainerVariants({
            showBridgeWarning: false,
            error: false,
          })}
          style={{ borderRadius: '5px' }}
        >
          <AtomBox
            display="flex"
            flexDirection="row-reverse"
            flexWrap="nowrap"
            color="text"
            fontSize="12px"
            lineHeight="16px"
            px="16px"
            py="0px"
            className="targetInput"
            position="relative"
            style={{ height: 80 }}
          >
            <SwapUIV2.NumericalInput
              error={false}
              disabled={disabled}
              className="token-amount-input"
              value={value}
              onUserInput={onInput}
              fontSize="24px"
              placeholder="0"
              pattern="^[0-9]*$"
            />
            <Flex alignItems="center">
              <Box width={40} mr="4px">
                <Image src="/images/cake-staking/lock.png" height={37} width={34} />
              </Box>
              <Text fontSize="20px" bold>
                {t('Weeks')}
              </Text>
            </Flex>
          </AtomBox>
        </AtomBox>
      </AtomBox>
    </AtomBox>
  )
}

interface LockWeeksFormProps {
  fieldOnly?: boolean
  expired?: boolean
  disabled?: boolean
  hideLockWeeksDataSetStyle?: boolean
  customVeCakeCard?: null | JSX.Element
  onDismiss?: () => void
}

export const LockWeeksForm: React.FC<React.PropsWithChildren<LockWeeksFormProps>> = ({
  fieldOnly,
  expired,
  disabled,
  customVeCakeCard,
  hideLockWeeksDataSetStyle,
  onDismiss,
}) => {
  const [value, onChange] = useAtom(cakeLockWeeksAtom)

  return (
    <AutoRow alignSelf="start">
      <WeekInput value={value} onUserInput={onChange} disabled={disabled} />

      {customVeCakeCard}

      {fieldOnly ? null : (
        <>
          {disabled ? null : <LockWeeksDataSet hideLockWeeksDataSetStyle={hideLockWeeksDataSetStyle} />}

          {expired ? (
            <FlexGap width="100%" mt="16px" gap="16px">
              <SubmitUnlockButton />
              <SubmitRenewButton />
            </FlexGap>
          ) : (
            <SubmitLockButton disabled={disabled} onDismiss={onDismiss} />
          )}
        </>
      )}
    </AutoRow>
  )
}

const SubmitLockButton = ({ disabled, onDismiss }: { disabled?: boolean; onDismiss?: () => void }) => {
  const { t } = useTranslation()
  const cakeLockWeeks = useAtomValue(cakeLockWeeksAtom)
  const _disabled = useMemo(() => !cakeLockWeeks || cakeLockWeeks === '0' || disabled, [cakeLockWeeks, disabled])
  const increaseLockWeeks = useWriteIncreaseLockWeeksCallback(onDismiss)

  return (
    <Button mt="16px" disabled={_disabled} width="100%" onClick={increaseLockWeeks}>
      {t('Extend Lock')}
    </Button>
  )
}

const SubmitUnlockButton = () => {
  const { t } = useTranslation()
  const unlock = useWriteWithdrawCallback()
  const { cakeLockedAmount } = useCakeLockStatus()

  if (!cakeLockedAmount) {
    return null
  }

  return (
    <ButtonBlocked variant="secondary" onClick={unlock}>
      {t('Unlock')}
    </ButtonBlocked>
  )
}

const SubmitRenewButton = () => {
  const { t } = useTranslation()
  const cakeLockWeeks = useAtomValue(cakeLockWeeksAtom)
  const disabled = useMemo(() => !cakeLockWeeks || Number(cakeLockWeeks) <= 0, [cakeLockWeeks])

  const renew = useWriteIncreaseLockWeeksCallback()

  return (
    <ButtonBlocked disabled={disabled} onClick={renew}>
      {t('Renew Lock')}
    </ButtonBlocked>
  )
}
