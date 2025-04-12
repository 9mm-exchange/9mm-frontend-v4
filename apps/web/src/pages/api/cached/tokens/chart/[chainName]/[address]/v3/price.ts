import { NextApiHandler } from 'next'
import { fetchTokenPriceChartData } from 'queries/stats/price'
import { multiChainId } from 'state/info/constant'

const CACHE_HEADERS = {
  'Cache-Control': 's-maxage=300, max-age=150, stale-while-revalidate=1500',
}

const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, address, period } = req.query

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
      return res.status(400).json({ error: 'Invalid token address format' })
    }

    // Fetch pool data
    const priceData = await fetchTokenPriceChartData(
      address.toLowerCase(),
      chainId,
      period as '1D' | '1W' | '1M' | '6M' | '1Y' | undefined,
    )
    if (priceData.error || !priceData.data) {
      return res.status(404).json({ name: 'Error', message: 'no result' })
    }

    // Return successful response
    res.setHeader('Cache-Control', CACHE_HEADERS['Cache-Control'])
    return res.status(200).json(priceData.data)
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
