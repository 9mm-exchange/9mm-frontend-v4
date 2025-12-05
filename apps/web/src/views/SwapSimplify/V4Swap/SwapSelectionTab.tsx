import { useTranslation } from '@pancakeswap/localization'
import { ButtonMenuItem, Text, useMatchBreakpoints, useTooltip } from '@pancakeswap/uikit'
import { LabelText } from '@pancakeswap/uikit/widgets/Menu/components/UserMenu'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { styled, useTheme } from 'styled-components'
import { SettingsMode } from '../../../components/Menu/GlobalSettings/types'
import { SwapType } from '../../Swap/types'
import { isTwapSupported } from '../../Swap/utils'

// const ColoredIconButton = styled(IconButton)`
//   color: ${({ theme }) => theme.colors.textSubtle};
//   overflow: hidden;
// `

const StyledButtonMenuItem = styled(ButtonMenuItem)`
  height: 40px;
  padding: 0px 16px;
  * ${({ theme }) => theme.mediaQueries.md} {
    width: 124px;
    padding: 0px 24px;
  }
`
const StyledButtonMenuItemTooltip = styled(StyledButtonMenuItem)`
  padding: 0px;
  > div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    padding: 0px 16px;
    color: inherit;
    font-weight: inherit;
  }
  * ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px;
  }
`

const SwapSelectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 4px;
  ${({ theme }) => theme.mediaQueries.md} {
    gap: 16px;
  }
`

export const SwapSelection = ({
  swapType,
  withToolkit = false,
  style,
}: {
  swapType: SwapType
  withToolkit?: boolean
  style?: React.CSSProperties
}) => {
  const { t } = useTranslation()
  const router = useRouter()

  const onSelect = useCallback(
    (value: SwapType) => {
      let url = ''
      switch (value) {
        case SwapType.LIMIT:
          url = '/swap/limit'
          break
        case SwapType.TWAP:
          url = '/swap/twap'
          break
        case SwapType.MARKET:
          url = '/'
          break
        default:
          break
      }
      router.push(url)
    },
    [router],
  )
  const { chainId } = useActiveChainId()
  const { isMobile } = useMatchBreakpoints()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Text>
      {t(
        'TWAP (Time-Weighted Average Price) helps minimises market impact from large orders by averaging the asset price over a set time period.',
      )}
    </Text>,
    { placement: 'top' },
  )

  // NOTE: Commented out until charts are supported again
  // const { isChartSupported, isChartDisplayed, setIsChartDisplayed, isHotTokenSupported } =
  //   useContext(SwapFeaturesContext)
  // const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()
  // const toggleChartDisplayed = () => {
  //   setIsChartDisplayed?.((currentIsChartDisplayed) => !currentIsChartDisplayed)
  // }
  const theme = useTheme()
  const tSwapProps = useMemo(() => {
    const isTSwapSupported = isTwapSupported(chainId)

    return {
      disabled: !isTSwapSupported,
      style: {
        cursor: isTSwapSupported ? 'pointer' : 'not-allowed',
        pointerEvents: isTSwapSupported ? 'auto' : 'none',
        color: !isTSwapSupported ? theme.colors.textDisabled : undefined,
        userSelect: 'none',
      } as React.CSSProperties,
    }
  }, [chainId, theme])

  return (
    <SwapSelectionWrapper style={style}>
      <LabelText style={{ fontSize: '25px', margin: '0px' }}>{t('Swap')}</LabelText>
      {withToolkit && (
        <GlobalSettings
          color="textSubtle"
          mr="0"
          mode={SettingsMode.SWAP_LIQUIDITY}
          data-dd-action-name="Swap settings button"
          width="24px"
        />
      )}
    </SwapSelectionWrapper>
  )
}
