import { ChainId } from '@gelatonetwork/limit-orders-lib'
import { AVERAGE_CHAIN_BLOCK_TIMES } from '@pancakeswap/chains'
import { useFetchBlockData } from '@pancakeswap/wagmi'
import { BSC_BLOCK_TIME } from 'config'
import { CHAINS } from 'config/chains'
import { PUBLIC_NODES } from 'config/nodes'
import { useW3WConfig } from 'contexts/W3WConfigContext'
import memoize from 'lodash/memoize'
import { useCallback } from 'react'
import { RetryableError, retry } from 'state/multicall/retry'
import {
  BlockNotFoundError,
  GetTransactionReceiptParameters,
  HttpRequestError,
  PublicClient,
  TransactionNotFoundError,
  TransactionReceipt,
  TransactionReceiptNotFoundError,
  WaitForTransactionReceiptTimeoutError,
  createPublicClient,
  custom,
  fallback,
  http,
} from 'viem'
import { usePublicClient } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

export const getViemClientsPublicNodes = memoize((w3WConfig = false) => {
  return CHAINS.reduce((prev, cur) => {
    return {
      ...prev,
      [cur.id]: createPublicClient({
        chain: cur,
        transport:
          w3WConfig && typeof window !== 'undefined' && window.ethereum
            ? custom(window.ethereum as any)
            : fallback([...PUBLIC_NODES[cur.id].map((url) => http(url, { timeout: 15_000 }))], { rank: false }),
        batch: {
          multicall: {
            batchSize: 1024 * 200,
            wait: 16,
          },
        },
        pollingInterval: 6_000,
      }),
    }
  }, {} as Record<ChainId, PublicClient>)
})

export type PublicNodeWaitForTransactionParams = GetTransactionReceiptParameters & {
  chainId?: number
}

export function usePublicNodeWaitForTransaction() {
  const { chainId } = useActiveChainId()
  const provider = usePublicClient({ chainId })
  const w3WConfig = useW3WConfig()
  const refetchBlockData = useFetchBlockData(chainId)

  const waitForTransaction_ = useCallback(
    async (opts: PublicNodeWaitForTransactionParams): Promise<TransactionReceipt> => {
      const selectedChain = opts?.chainId ?? chainId
      const getTransaction = async () => {
        try {
          // our custom node might be late to sync up
          if (selectedChain && getViemClientsPublicNodes(w3WConfig)[selectedChain]) {
            const receipt = await getViemClientsPublicNodes(w3WConfig)[selectedChain].getTransactionReceipt({
              hash: opts.hash,
            })
            if (receipt.status === 'success') {
              refetchBlockData()
            }
            return receipt
          }

          if (!provider) return undefined

          const receipt = await provider.getTransactionReceipt({ hash: opts.hash })
          if (receipt.status === 'success') {
            refetchBlockData()
          }
          return receipt
        } catch (error) {
          if (error instanceof TransactionNotFoundError) {
            throw new RetryableError(`Transaction not found: ${opts.hash}`)
          } else if (error instanceof TransactionReceiptNotFoundError) {
            throw new RetryableError(`Transaction receipt not found: ${opts.hash}`)
          } else if (error instanceof BlockNotFoundError) {
            throw new RetryableError(`Block not found for transaction: ${opts.hash}`)
          } else if (error instanceof WaitForTransactionReceiptTimeoutError) {
            throw new RetryableError(`Timeout reached when fetching transaction receipt: ${opts.hash}`)
          } else if (
            error instanceof HttpRequestError &&
            (error.details?.includes('Load failed') || error.details?.includes('Failed to fetch'))
          ) {
            // retry on network error
            throw new RetryableError(`Network error: ${error.details}`)
          }
          throw error
        }
      }
      const bufferedAvgBlockTime =
        (selectedChain ? AVERAGE_CHAIN_BLOCK_TIMES[selectedChain] : BSC_BLOCK_TIME) * 1000 + 1000
      return retry(getTransaction, {
        n: 10,
        minWait: bufferedAvgBlockTime,
        maxWait: bufferedAvgBlockTime * 1.1,
        delay: bufferedAvgBlockTime,
      }).promise as Promise<TransactionReceipt>
    },
    [chainId, provider, refetchBlockData, w3WConfig],
  )

  return {
    waitForTransaction: waitForTransaction_,
  }
}
