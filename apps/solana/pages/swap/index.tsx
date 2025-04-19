import '@pancakeswap/jupiter-terminal/global.css'
import '@pancakeswap/jupiter-terminal/index.css'

import { useUnifiedWalletContext, useWallet } from '@jup-ag/wallet-adapter'
import { useCallback, useEffect } from 'react'
import { TerminalCard, TerminalWrapper } from 'components/SwapForm'
import { ExchangeLayout } from 'components/Layout/ExchangeLayout'
import { init, syncProps } from '@pancakeswap/jupiter-terminal'
import { logGTMSwapTXSuccessEvent, logGTMWalletConnectedEvent } from 'utils/curstomGTMEventTracking'
import { SOLANA_ENDPOINT } from 'config/endpoint'
import { logDDSwapTXSuccessEvent, logDDWalletConnectedEvent } from 'utils/datadog'

const TARGET_ELE_ID = 'integrated-terminal'

const JupiterTerminal = () => {
  const passthroughWalletContextState = useWallet()
  const { setShowModal } = useUnifiedWalletContext()

  useEffect(() => {
    if (passthroughWalletContextState.wallet?.adapter.connected) {
      const walletName = passthroughWalletContextState.wallet?.adapter.name
      logGTMWalletConnectedEvent(walletName)
      logDDWalletConnectedEvent(walletName)
    }
  }, [passthroughWalletContextState.wallet?.adapter.connected, passthroughWalletContextState.wallet?.adapter.name])

  const logSwapSucc = useCallback(
    ({ txid }: { txid: string }) => {
      const info = {
        txId: txid,
        from: passthroughWalletContextState.wallet?.adapter.publicKey?.toBase58(),
        chain: 'solana',
      }
      // GTM
      logGTMSwapTXSuccessEvent(info)
      // DD
      logDDSwapTXSuccessEvent(info)
    },
    [passthroughWalletContextState.wallet?.adapter.publicKey],
  )

  useEffect(() => {
    init({
      displayMode: 'integrated',
      integratedTargetId: TARGET_ELE_ID,
      endpoint: SOLANA_ENDPOINT,
      refetchIntervalForTokenAccounts: 60000,
      containerStyles: {
        maxWidth: '480px',
        overflow: 'hidden',
      },
      enableWalletPassthrough: true,
      onRequestConnectWallet: () => setShowModal(true),
      onSuccess(result) {
        logSwapSucc(result)
      },
    })
  }, [setShowModal, logSwapSucc])

  // Do not pass the passthroughWalletContextState into init.
  // Otherwise, the entire widget will refresh when the theme switches.
  useEffect(() => {
    syncProps({
      enableWalletPassthrough: true,
      passthroughWalletContextState,
    })
  }, [passthroughWalletContextState])

  return (
    <TerminalWrapper>
      <TerminalCard>
        <div id={TARGET_ELE_ID} />
      </TerminalCard>
    </TerminalWrapper>
  )
}

JupiterTerminal.Layout = ExchangeLayout

export default JupiterTerminal
