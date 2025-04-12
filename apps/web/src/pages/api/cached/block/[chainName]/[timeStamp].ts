import { NextApiHandler } from 'next'
import { getBlockByTimestamp } from 'queries/blocks'
import { multiChainId } from 'state/info/constant'

const CACHE_HEADERS = {
  'Cache-Control': 's-maxage=60, max-age=30, stale-while-revalidate=300',
}

const isValidTimestamp = (timestamp: number): boolean => {
  // Check if timestamp is a positive number and within reasonable bounds
  return (
    Number.isFinite(timestamp) && timestamp > 0 && timestamp < Date.now() / 1000 + 86400 // Allow timestamps up to 1 day in future
  )
}

const handler: NextApiHandler = async (req, res) => {
  try {
    const { chainName, timeStamp } = req.query

    // Validate required parameters
    if (typeof chainName !== 'string' || typeof timeStamp !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid required parameters' })
    }

    // Get and validate chain ID
    const chainId = multiChainId[chainName.toUpperCase()]
    if (chainId === undefined) {
      return res.status(400).json({ error: 'Invalid chain name' })
    }

    // Validate timestamp format
    const timestamp = Number(timeStamp)
    if (!isValidTimestamp(timestamp)) {
      return res.status(400).json({ error: 'Invalid timestamp format' })
    }

    // Fetch block data
    const block = await getBlockByTimestamp(timestamp, chainId)
    if (!block) {
      return res.status(404).json({ error: 'Block not found for the given timestamp' })
    }

    // Return successful response
    res.setHeader('Cache-Control', CACHE_HEADERS['Cache-Control'])
    return res.status(200).json({
      height: Number(block.number),
      timestamp: Number(block.timestamp),
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
