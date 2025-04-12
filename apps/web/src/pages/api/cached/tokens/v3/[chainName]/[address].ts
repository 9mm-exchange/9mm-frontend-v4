import { NextApiHandler } from 'next'
import { fetchTopTokens } from 'queries/tokens'
import { multiChainId } from 'state/info/constant'

const CACHE_HEADERS = {
  'Cache-Control': 's-maxage=60, max-age=30, stale-while-revalidate=300',
}

const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, address } = req.query

    // Validate required parameters
    if (!chainName || !address) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Get and validate chain ID
    const chainId = multiChainId[(chainName as string).toUpperCase()]
    if (!chainId) {
      return res.status(400).json({ error: 'Invalid chain name' })
    }

    // Validate address format
    if (typeof address !== 'string' || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ error: 'Invalid pool address format' })
    }
    // Fetch pool data
    const poolData = await fetchTopTokens(address.toLowerCase(), chainId)
    if (poolData.error || !poolData.data) {
      return res.status(404).json({ name: 'Error', message: 'no result' })
    }

    // Return successful response
    res.setHeader('Cache-Control', CACHE_HEADERS['Cache-Control'])
    return res.status(200).json(poolData.data[0])
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
