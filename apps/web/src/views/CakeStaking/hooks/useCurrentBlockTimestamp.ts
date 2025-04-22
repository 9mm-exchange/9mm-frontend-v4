import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCurrentBlockTimestamp as useBlockTimestamp } from 'state/block/hooks'
import { verifyBscNetwork } from 'utils/verifyBscNetwork'

export const useCurrentBlockTimestamp = () => {
  const { chainId } = useActiveChainId()
  const isBscNetwork = verifyBscNetwork(chainId)
  const timestamp = useBlockTimestamp()

  return timestamp ?? 0
}
