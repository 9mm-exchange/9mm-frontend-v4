import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { Column, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import CurrencyInputPanelSimplify from 'components/CurrencyInputPanelSimplify'
import { CommonBasesType } from 'components/SearchModal/types'
import { useCurrency } from 'hooks/Tokens'
import { Field, replaceSwapState } from 'state/swap/actions'
import { queryParametersToSwapState, useSwapState } from 'state/swap/hooks'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'

import { CAKE, STABLE_COIN, USDC, USDT } from '@pancakeswap/tokens'
import { SwapUIV2 } from '@pancakeswap/widgets-internal'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { swapReducerAtom } from 'state/swap/reducer'
import { FlipButton } from 'views/Swap/V3Swap/containers/FlipButton'
import useWarningImport from '../../Swap/hooks/useWarningImport'
import { useIsWrapping } from '../../Swap/V3Swap/hooks'

interface Props {
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  tradeLoading?: boolean
  pricingAndSlippage?: ReactNode
  swapCommitButton?: ReactNode
  isUserInsufficientBalance?: boolean
}

export function FormMainForHomePage({ inputAmount, outputAmount, tradeLoading }: Props) {
  const { t } = useTranslation()
  const warningSwapHandler = useWarningImport()
  const { isMobile } = useMatchBreakpoints()
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const isWrapping = useIsWrapping()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()

  useDefaults()
  const handleTypeInput = useCallback((value: string) => onUserInput(Field.INPUT, value), [onUserInput])
  const handleTypeOutput = useCallback((value: string) => onUserInput(Field.OUTPUT, value), [onUserInput])

  const handleCurrencySelect = useCallback(
    (newCurrency: Currency, field: Field) => {
      onCurrencySelection(field, newCurrency)
      warningSwapHandler(newCurrency)
    },
    [onCurrencySelection, warningSwapHandler],
  )
  const handleInputSelect = useCallback(
    (newCurrency: Currency) => handleCurrencySelect(newCurrency, Field.INPUT),
    [handleCurrencySelect, inputCurrencyId, outputCurrencyId],
  )
  const handleOutputSelect = useCallback(
    (newCurrency: Currency) => handleCurrencySelect(newCurrency, Field.OUTPUT),
    [handleCurrencySelect, inputCurrencyId, outputCurrencyId],
  )

  const isTypingInput = independentField === Field.INPUT
  const inputValue = useMemo(
    () => typedValue && (isTypingInput ? typedValue : formatAmount(inputAmount) || ''),
    [typedValue, isTypingInput, inputAmount],
  )
  const outputValue = useMemo(
    () => typedValue && (isTypingInput ? formatAmount(outputAmount) || '' : typedValue),
    [typedValue, isTypingInput, outputAmount],
  )
  const inputLoading = typedValue ? !isTypingInput && tradeLoading : false
  const outputLoading = typedValue ? isTypingInput && tradeLoading : false

  return (
    <SwapUIV2.InputPanelWrapper id="swap-page">
      <Column gap={isMobile ? '0px' : 'sm'}>
        <CurrencyInputPanelSimplify
          id="swap-currency-input"
          showUSDPrice
          showMaxButton
          showCommonBases
          topOptions={{
            show: !isMobile,
            walletDisplay: false,
          }}
          inputLoading={!isWrapping && inputLoading}
          defaultValue={isWrapping ? typedValue : inputValue}
          currency={inputCurrency}
          onUserInput={handleTypeInput}
          onCurrencySelect={handleInputSelect}
          otherCurrency={outputCurrency}
          commonBasesType={CommonBasesType.SWAP_LIMITORDER}
          title={
            <Text color="textSubtle" fontSize={12} bold>
              {t('From')}
            </Text>
          }
        />
        <FlipButton compact={isMobile} replaceBrowser={false} />
        <CurrencyInputPanelSimplify
          id="swap-currency-output"
          showUSDPrice
          showCommonBases
          showMaxButton={false}
          inputLoading={!isWrapping && outputLoading}
          defaultValue={isWrapping ? typedValue : outputValue}
          currency={outputCurrency}
          onUserInput={handleTypeOutput}
          onCurrencySelect={handleOutputSelect}
          otherCurrency={inputCurrency}
          commonBasesType={CommonBasesType.SWAP_LIMITORDER}
          topOptions={{
            show: !isMobile,
            walletDisplay: false,
          }}
          title={
            <Text color="textSubtle" fontSize={12} bold>
              {t('To')}
            </Text>
          }
        />
      </Column>
    </SwapUIV2.InputPanelWrapper>
  )
}

function useDefaults(): { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined } | undefined {
  const { chainId } = useActiveChainId()
  const [, dispatch] = useAtom(swapReducerAtom)
  const native = useNativeCurrency()
  const { isReady } = useRouter()
  const [result, setResult] = useState<
    { inputCurrencyId: string | undefined; outputCurrencyId: string | undefined } | undefined
  >()

  useEffect(() => {
    if (!chainId || !native || !isReady) return

    const parsed = queryParametersToSwapState(
      {},
      native.symbol,
      CAKE[chainId]?.address ?? STABLE_COIN[chainId]?.address ?? USDC[chainId]?.address ?? USDT[chainId]?.address,
    )

    dispatch(
      replaceSwapState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        recipient: null,
      }),
    )
    setResult({ inputCurrencyId: parsed[Field.INPUT].currencyId, outputCurrencyId: parsed[Field.OUTPUT].currencyId })
  }, [dispatch, chainId, native, isReady])

  return result
}
