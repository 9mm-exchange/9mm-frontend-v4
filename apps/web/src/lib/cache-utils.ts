/**
 * Utility functions for cache key generation
 * These are also used internally by RedisClient.fetchWithCache
 */

/**
 * Converts API URL paths to Redis cache keys
 * Example: "protocol/v3/pulse/stats" -> "protocol-v3-pulse-stats"
 *
 * @param urlPath - The API URL path (e.g., "protocol/v3/pulse/stats")
 * @returns Cache key string (e.g., "protocol-v3-pulse-stats")
 */
export function urlToCacheKey(urlPath: string): string {
  // Remove leading/trailing slashes and normalize
  const normalized = urlPath.replace(/^\/+|\/+$/g, '')

  // Replace all slashes (including multiple consecutive ones) with single hyphens
  return normalized.replace(/\/+/g, '-')
}

/**
 * Extracts the URL path from a full URL
 * Example: "https://api.example.com/protocol/v3/pulse/stats" -> "/protocol/v3/pulse/stats"
 *
 * @param url - Full URL or path string
 * @returns The path portion of the URL
 */
export function extractUrlPath(url: string): string {
  try {
    // If it's already a path (starts with /), return it
    if (url.startsWith('/')) {
      return url
    }

    // If it's a full URL, extract the pathname
    const urlObj = new URL(url)
    return urlObj.pathname
  } catch {
    // If URL parsing fails, assume it's already a path
    return url
  }
}

/**
 * Creates a cache key from a URL and optional query parameters
 * Handles both full URLs and path strings
 *
 * @param url - Full URL or path string
 * @param queryParams - Optional query parameters object (e.g., { groupBy: '1D', period: '1W' })
 * @returns Cache key string
 */
export function createCacheKey(url: string, queryParams?: Record<string, string | string[] | undefined>): string {
  const path = extractUrlPath(url)
  let cacheKey = urlToCacheKey(path)

  // Include query parameters in cache key if provided
  if (queryParams && Object.keys(queryParams).length > 0) {
    // Sort keys for consistent cache keys
    const sortedKeys = Object.keys(queryParams).sort()
    const queryString = sortedKeys
      .map((key) => {
        const value = queryParams[key]
        if (value === undefined || value === null) return null
        // Handle array values
        if (Array.isArray(value)) {
          return `${key}=${value.sort().join(',')}`
        }
        return `${key}=${value}`
      })
      .filter(Boolean)
      .join('&')

    if (queryString) {
      // Convert query string to cache key format: key=value&key2=value2 -> key-value-key2-value2
      const queryKey = queryString.replace(/[&=]/g, '-').replace(/[^a-zA-Z0-9-]/g, '')
      cacheKey = `${cacheKey}-${queryKey}`
    }
  }

  return cacheKey
}
