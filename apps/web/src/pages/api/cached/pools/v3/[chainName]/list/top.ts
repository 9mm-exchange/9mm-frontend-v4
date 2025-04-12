import { NextApiHandler } from 'next'
import { getPoolsData } from 'queries/pools'
import { multiChainId } from 'state/info/constant'

const CACHE_HEADERS = {
  'Cache-Control': 's-maxage=60, max-age=30, stale-while-revalidate=300',
}

const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, token } = req.query as {
      chainName: string
      token?: string
    }

    // Validate required parameters
    if (!chainName) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Get and validate chain ID
    const chainId = multiChainId[(chainName as string).toUpperCase()]
    if (!chainId) {
      return res.status(400).json({ error: 'Invalid chain name' })
    }
    // Fetch pool data
    const poolsData = await getPoolsData(chainId, token?.toLowerCase())

    if (poolsData.error || !poolsData.data) {
      return res.status(404).json({ name: 'Error', message: 'no result' })
    }

    // Return successful response
    res.setHeader('Cache-Control', CACHE_HEADERS['Cache-Control'])
    return res.status(200).json(poolsData.data)
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
