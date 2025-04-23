import * as react_jsx_runtime from 'react/jsx-runtime'
import { WalletClient, Address } from 'viem'

declare const defaultTheme: {
  cardBackground: string
  cardBorder: string
  background: string
  inputBackground: string
  inputBorder: string
  primary: string
  secondary: string
  tertiary: string
  textSecondary: string
  textPrimary: string
  textReverse: string
  warningBackground: string
  wraningBorder: string
  warning: string
  error: string
  disabled: string
  'green-10': string
  'green-20': string
  'green-50': string
}
type Theme = typeof defaultTheme

interface WidgetProps {
  theme?: Theme | 'dark' | 'light'
  walletClient: WalletClient | undefined
  account: Address | undefined
  chainId: number
  networkChainId: number
  initTickLower?: number
  initTickUpper?: number
  poolAddress: string
  positionId?: string
  feeAddress?: string
  feePcm?: number
  source: string
  includedSources?: string
  excludedSources?: string
  initDepositTokens: string
  initAmounts: string
  onDismiss: () => void
  onTxSubmit?: (txHash: string) => void
  onConnectWallet: () => void
  onAddTokens: (tokenAddresses: string) => void
  onRemoveToken: (tokenAddress: string) => void
  onAmountChange: (tokenAddress: string, amount: string) => void
  onOpenTokenSelectModal: () => void
  farmContractAddresses?: string[]
}
declare function Widget({
  theme: themeProps,
  walletClient,
  account,
  chainId,
  networkChainId,
  initTickLower,
  initTickUpper,
  poolAddress,
  positionId,
  feeAddress,
  feePcm,
  includedSources,
  excludedSources,
  source,
  initDepositTokens,
  initAmounts,
  onDismiss,
  onTxSubmit,
  onConnectWallet,
  onAddTokens,
  onRemoveToken,
  onAmountChange,
  onOpenTokenSelectModal,
  farmContractAddresses,
}: WidgetProps): react_jsx_runtime.JSX.Element

export { Widget as LiquidityWidget, type WidgetProps }
