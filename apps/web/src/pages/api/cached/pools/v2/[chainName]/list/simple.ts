import { NextApiHandler } from 'next'
import { getPoolsData } from 'queries/pools'
import { createToken, getPoolsWithLiquidityByFeeTiers } from 'queries/pools/fee'
import { multiChainId } from 'state/info/constant'

const CACHE_HEADERS = {
  'Cache-Control': 's-maxage=60, max-age=30, stale-while-revalidate=300',
}

const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, token0, token1 } = req.query

    // Validate required parameters
    if (!chainName || !token0 || !token1) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Get and validate chain ID
    const chainId = multiChainId[(chainName as string).toUpperCase()]
    if (!chainId) {
      return res.status(400).json({ error: 'Invalid chain name' })
    }

    // Validate address format
    if (
      typeof token0 !== 'string' ||
      !token0.match(/^0x[a-fA-F0-9]{40}$/) ||
      typeof token1 !== 'string' ||
      !token1.match(/^0x[a-fA-F0-9]{40}$/)
    ) {
      return res.status(400).json({ error: 'Invalid pool address format' })
    }

    const tokenA = createToken(chainId, token0, 18, '')
    const tokenB = createToken(chainId, token1, 6, '')

    // Fetch pool data
    const results = await getPoolsWithLiquidityByFeeTiers(tokenA, tokenB, chainId)
    if (!results.length) {
      return res.status(404).json({ name: 'Error', message: 'no result' })
    }

    const poolsData = await getPoolsData(results as any, chainId)

    // Return successful response
    res.setHeader('Cache-Control', CACHE_HEADERS['Cache-Control'])
    return res.status(200).json({
      startCursor: 'dHZsVVNEPTIyMTgwNjguMzE0MDg0NzQzNg',
      endCursor: 'dHZsVVNEPTUyOC44MjkzNDcxOTk1OTY5',
      hasNextPage: false,
      rows: poolsData,
    })
  } catch (error) {
    console.error('API Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return res.status(500).json({
      error: 'Internal Server Error',
      details: errorMessage,
    })
  }
}

export default handler
