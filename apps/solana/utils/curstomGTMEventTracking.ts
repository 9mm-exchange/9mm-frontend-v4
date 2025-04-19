export enum GTMEvent {
  SwapTXSuccess = 'swapTXSuccess',
  WalletConnected = 'walletConnected',
}

export enum GTMCategory {
  Wallet = 'Wallet',
  Swap = 'swap',
}

export enum GTMAction {
  SwapTransactionSent = 'swap_transaction_sent',
  WalletConnected = 'Wallet Connected',
}

interface CustomGTMDataLayer {
  event: GTMEvent
  category?: GTMCategory
  action?: GTMAction
  label?: string
  tx_id?: string
  chain?: string
  from_address?: string
  to_address?: string
}

type WindowWithDataLayer = Window & {
  dataLayer: CustomGTMDataLayer[] | undefined
}

declare const window: WindowWithDataLayer

export const customGTMEvent: WindowWithDataLayer['dataLayer'] =
  typeof window !== 'undefined' ? window?.dataLayer : undefined

interface SwapTXSuccessEventParams {
  txId: string
  chain?: string
  from?: string
  to?: string
}

export const logGTMSwapTXSuccessEvent = ({ txId, chain, from, to = '' }: SwapTXSuccessEventParams) => {
  console.info('---SwapTXSuccess---')
  window?.dataLayer?.push({
    event: GTMEvent.SwapTXSuccess,
    action: GTMAction.SwapTransactionSent,
    category: GTMCategory.Swap,
    tx_id: txId,
    chain,
    from_address: from,
    to_address: to,
  })
}

export const logGTMWalletConnectedEvent = (name: string) => {
  console.info('---wallet connected---')
  window?.dataLayer?.push({
    event: GTMEvent.WalletConnected,
    action: GTMAction.WalletConnected,
    category: GTMCategory.Wallet,
    label: name,
  })
}
