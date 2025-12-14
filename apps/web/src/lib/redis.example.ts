/**
 * Example usage of RedisClient.fetchWithCache
 *
 * This demonstrates how to use the cache-first API approach with automatic
 * cache key generation from API URLs.
 */

import { NextApiHandler } from 'next'
import RedisClient from './redis'

/**
 * Example 1: Basic usage with API path
 * Cache key will be: "protocol-v3-pulse-stats"
 * Cache persists indefinitely, refreshed in background
 */
export async function example1() {
  const result = await RedisClient.fetchWithCache('protocol/v3/pulse/stats', async () => {
    const response = await fetch('https://api.example.com/protocol/v3/pulse/stats')
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    return response.json()
  })

  console.log('Data:', result.data)
  console.log('From cache:', result.fromCache) // true if served from cache
  console.log('Cache key:', result.cacheKey) // "protocol-v3-pulse-stats"

  return result.data
}

/**
 * Example 2: Using with full URL
 * Cache key will be: "protocol-v3-pulse-stats"
 * Cache persists indefinitely, refreshed in background
 */
export async function example2() {
  const apiUrl = 'https://api.example.com/protocol/v3/pulse/stats'

  const result = await RedisClient.fetchWithCache(apiUrl, async () => {
    const response = await fetch(apiUrl)
    return response.json()
  })

  return result.data
}

/**
 * Example 3: Using in a Next.js API route
 */
export const handler: NextApiHandler = async (req, res) => {
  try {
    const apiPath = 'protocol/v3/pulse/stats'
    const baseUrl = process.env.API_BASE_URL || 'https://api.example.com'
    const fullUrl = `${baseUrl}/${apiPath}`

    const result = await RedisClient.fetchWithCache(
      apiPath, // Use path for cache key generation
      async () => {
        const response = await fetch(fullUrl)
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`)
        }
        return response.json()
      },
    )

    return res.status(200).json({
      data: result.data,
      cached: result.fromCache,
      cacheKey: result.cacheKey,
    })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Failed to fetch data' })
  }
}

/**
 * Example 4: Multiple endpoints
 * Cache persists indefinitely, refreshed in background
 */
export async function example4() {
  const baseUrl = 'https://api.example.com'

  const stats = await RedisClient.fetchWithCache('protocol/v3/pulse/stats', async () => {
    const response = await fetch(`${baseUrl}/protocol/v3/pulse/stats`)
    return response.json()
  })

  const config = await RedisClient.fetchWithCache('protocol/v3/config', async () => {
    const response = await fetch(`${baseUrl}/protocol/v3/config`)
    return response.json()
  })

  return {
    stats: stats.data,
    config: config.data,
  }
}
