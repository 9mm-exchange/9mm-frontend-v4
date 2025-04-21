import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { NATIVE } from '@pancakeswap/sdk'
import { Box, UserMenu, useTooltip } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { chainNameConverter } from 'utils/chainNameConverter'
import { chains as evmChains } from 'utils/wagmi'
import { NetworkSwitcherModal, networkSwitcherModalAtom } from './NetworkSwitcherModal'

const SHORT_SYMBOL = {
  [ChainId.ETHEREUM]: 'ETH',
  [ChainId.PULSECHAIN]: 'PLS',
  [ChainId.SONIC]: 'S',
  [ChainId.BSC]: 'BNB',
  [ChainId.BSC_TESTNET]: 'tBNB',
  [ChainId.GOERLI]: 'GOR',
  [ChainId.ARBITRUM_ONE]: 'ARB',
  [ChainId.ARBITRUM_GOERLI]: 'tARB',
  [ChainId.POLYGON_ZKEVM]: 'Polygon zkEVM',
  [ChainId.POLYGON_ZKEVM_TESTNET]: 'tZkEVM',
  [ChainId.ZKSYNC]: 'zkSync',
  [ChainId.ZKSYNC_TESTNET]: 'tZkSync',
  [ChainId.LINEA]: 'Linea',
  [ChainId.LINEA_TESTNET]: 'tLinea',
  [ChainId.OPBNB]: 'opBNB',
  [ChainId.OPBNB_TESTNET]: 'tOpBNB',
  [ChainId.BASE]: 'Base',
  [ChainId.BASE_TESTNET]: 'tBase',
  [ChainId.SCROLL_SEPOLIA]: 'tScroll',
  [ChainId.SEPOLIA]: 'sepolia',
  [ChainId.BASE_SEPOLIA]: 'Base Sepolia',
  [ChainId.ARBITRUM_SEPOLIA]: 'Arb Sepolia',
  [ChainId.MONAD_TESTNET]: 'tMonad',
} as const satisfies Record<ChainId, string>

export const NetworkSwitcher = () => {
  const { t } = useTranslation()
  const { chainId, isWrongNetwork, isNotMatched } = useActiveChainId()
  const { isLoading, canSwitch } = useSwitchNetwork()
  const router = useRouter()
  const [, setIsNetworkSwitcherOpen] = useAtom(networkSwitcherModalAtom)

  const foundChain = useMemo(() => evmChains.find((c) => c.id === chainId), [chainId])
  const symbol =
    (foundChain?.id ? SHORT_SYMBOL[foundChain.id] ?? NATIVE[foundChain.id]?.symbol : undefined) ??
    foundChain?.nativeCurrency?.symbol
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Unable to switch network. Please try it on your wallet'),
    { placement: 'bottom' },
  )

  const cannotChangeNetwork = !canSwitch

  const handleOpenNetworkModal = useCallback(() => {
    if (!cannotChangeNetwork) {
      setIsNetworkSwitcherOpen(true)
    }
  }, [cannotChangeNetwork])

  if (!chainId || router.pathname.includes('/info')) {
    return null
  }

  return (
    <Box ref={cannotChangeNetwork ? targetRef : null} height="100%">
      {cannotChangeNetwork && tooltipVisible && tooltip}
      <UserMenu
        mr="8px"
        placement="bottom"
        variant={isLoading ? 'pending' : isWrongNetwork ? 'danger' : 'default'}
        avatarSrc={`${ASSET_CDN}/web/chains/${chainId}.png`}
        disabled={cannotChangeNetwork}
        text={
          isLoading ? (
            t('Requesting')
          ) : isWrongNetwork ? (
            t('Network')
          ) : foundChain ? (
            <>
              <Box display={['none', null, null, null, null, null, 'block']}>{chainNameConverter(foundChain.name)}</Box>
              <Box display={['block', null, null, null, null, null, 'none']}>{symbol}</Box>
            </>
          ) : (
            t('Select a Network')
          )
        }
        onClick={handleOpenNetworkModal}
      />

      <NetworkSwitcherModal />
    </Box>
  )
}
