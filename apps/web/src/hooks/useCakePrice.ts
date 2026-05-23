import { ChainId, V3_SUBGRAPHS } from '@pancakeswap/chains'
import { chainlinkOracleCAKE } from '@pancakeswap/prediction'
import { CAKE } from '@pancakeswap/tokens'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { FAST_INTERVAL } from 'config/constants'
import { multiChainId, multiChainPriceAPIPaths } from 'state/info/constant'
import { useChainNameByQuery } from 'state/info/hooks'
import { publicClient } from 'utils/wagmi'
import { formatUnits } from 'viem'
import { useAccount } from 'wagmi'

// for migration to bignumber.js to avoid breaking changes
// export const useCakePrice = ({ enabled = true } = {}) => {
//   const { data } = useQuery<BigNumber, Error>({
//     queryKey: ['cakePrice'],
//     queryFn: async () => new BigNumber(await getCakePriceFromOracle()),
//     staleTime: FAST_INTERVAL,
//     refetchInterval: FAST_INTERVAL,
//     enabled,
//   })
//   return data ?? BIG_ZERO
// }

export const getCakePriceFromOracle = async () => {
  const data = await publicClient({ chainId: ChainId.BSC }).readContract({
    abi: chainlinkOracleABI,
    address: chainlinkOracleCAKE[ChainId.BSC],
    functionName: 'latestAnswer',
  })

  return formatUnits(data, 8)
}

export const useCakePrice = ({ enabled = true } = {}) => {
  const { chainId } = useAccount()
  const chainName = useChainNameByQuery()
  const _chainId = chainId || multiChainId[chainName!] || ChainId.PULSECHAIN
  const fetchPrice = () => fetchCakePrice(_chainId)

  const { data } = useQuery<BigNumber, Error>({
    queryKey: ['cakePrice', _chainId], // Include _chainId in the queryKey to ensure refetch on chain change
    queryFn: fetchPrice,
    staleTime: FAST_INTERVAL,
    refetchInterval: FAST_INTERVAL,
    enabled,
  })

  return data ?? BIG_ZERO
}

const fetchCakePrice = async (_chainId: number): Promise<BigNumber> => {
  try {
    const chainId = _chainId as keyof typeof V3_SUBGRAPHS
    const _cake = CAKE[chainId]

    // First try to fetch from 9mm API
    try {
      const apiUrl = `https://price-api-dev.9mm.pro/api/price${multiChainPriceAPIPaths[chainId]}/?address=${_cake.address}`
      const apiResponse = await fetch(apiUrl)
      const apiData = await apiResponse.json()

      if (apiData?.price) {
        return new BigNumber(apiData.price.toString())
      }
    } catch (apiError) {
      console.log('9mm API fetch failed, falling back to subgraph')
    }

    // If 9mm API fails, try subgraph
    // Check if subgraph URL or CAKE token exists for the provided chainId
    if (!V3_SUBGRAPHS[chainId] || !_cake) {
      return BIG_ZERO
    }

    const url = V3_SUBGRAPHS[chainId] as string
    const tokenIds = [_cake.address.toLowerCase()].join(',')

    // Define the GraphQL query with the dynamic list of token IDs
    const query = `
    {
      tokens(where: { id_in: ["${tokenIds}"] }) {
        id,
        derivedUSD
      }
    }
    `

    // Make the POST request to the subgraph
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    const data = await response.json()

    // Assuming the API returns a price in a field like data.tokens[0].derivedUSD
    const derivedUSD = data?.data?.tokens?.[0]?.derivedUSD

    // Return the price in BigNumber format, or BIG_ZERO if the price is not found
    return derivedUSD ? new BigNumber(derivedUSD.toString()) : BIG_ZERO
  } catch (error) {
    console.error('Error fetching the price:', error)
    return BIG_ZERO // Return a default value in case of error
  }
}
