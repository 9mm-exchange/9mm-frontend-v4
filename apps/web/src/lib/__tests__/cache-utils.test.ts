import { describe, it, expect } from 'vitest'
import { urlToCacheKey, extractUrlPath, createCacheKey } from '../cache-utils'

describe('cache-utils', () => {
  describe('urlToCacheKey', () => {
    it('should convert simple path to cache key', () => {
      expect(urlToCacheKey('protocol/v3/pulse/stats')).toBe('protocol-v3-pulse-stats')
    })

    it('should handle paths with leading slash', () => {
      expect(urlToCacheKey('/protocol/v3/pulse/stats')).toBe('protocol-v3-pulse-stats')
    })

    it('should handle paths with trailing slash', () => {
      expect(urlToCacheKey('protocol/v3/pulse/stats/')).toBe('protocol-v3-pulse-stats')
    })

    it('should handle paths with multiple slashes', () => {
      expect(urlToCacheKey('//protocol//v3//pulse//stats//')).toBe('protocol-v3-pulse-stats')
    })

    it('should handle single segment paths', () => {
      expect(urlToCacheKey('stats')).toBe('stats')
    })

    it('should handle empty string', () => {
      expect(urlToCacheKey('')).toBe('')
    })
  })

  describe('extractUrlPath', () => {
    it('should extract path from full URL', () => {
      expect(extractUrlPath('https://api.example.com/protocol/v3/pulse/stats')).toBe('/protocol/v3/pulse/stats')
    })

    it('should return path as-is if it starts with /', () => {
      expect(extractUrlPath('/protocol/v3/pulse/stats')).toBe('/protocol/v3/pulse/stats')
    })

    it('should handle path without leading slash', () => {
      expect(extractUrlPath('protocol/v3/pulse/stats')).toBe('protocol/v3/pulse/stats')
    })

    it('should handle invalid URL gracefully', () => {
      expect(extractUrlPath('not-a-url')).toBe('not-a-url')
    })
  })

  describe('createCacheKey', () => {
    it('should create cache key from full URL', () => {
      expect(createCacheKey('https://api.example.com/protocol/v3/pulse/stats')).toBe('protocol-v3-pulse-stats')
    })

    it('should create cache key from path', () => {
      expect(createCacheKey('protocol/v3/pulse/stats')).toBe('protocol-v3-pulse-stats')
    })

    it('should create cache key from path with leading slash', () => {
      expect(createCacheKey('/protocol/v3/pulse/stats')).toBe('protocol-v3-pulse-stats')
    })

    it('should handle complex paths', () => {
      expect(createCacheKey('api/v1/tokens/0x123/chart/volume')).toBe('api-v1-tokens-0x123-chart-volume')
    })

    it('should include query parameters in cache key', () => {
      expect(createCacheKey('protocol/v3/pulse/stats', { groupBy: '1D' })).toBe('protocol-v3-pulse-stats-groupBy-1D')
    })

    it('should handle multiple query parameters', () => {
      expect(createCacheKey('protocol/v3/pulse/stats', { groupBy: '1D', period: '1W' })).toBe(
        'protocol-v3-pulse-stats-groupBy-1D-period-1W',
      )
    })

    it('should sort query parameters for consistent keys', () => {
      const key1 = createCacheKey('protocol/v3/pulse/stats', { period: '1W', groupBy: '1D' })
      const key2 = createCacheKey('protocol/v3/pulse/stats', { groupBy: '1D', period: '1W' })
      expect(key1).toBe(key2)
    })

    it('should handle array query parameters', () => {
      expect(createCacheKey('api/v1/data', { ids: ['1', '2', '3'] })).toBe('api-v1-data-ids-1,2,3')
    })

    it('should ignore undefined query parameters', () => {
      expect(createCacheKey('protocol/v3/pulse/stats', { groupBy: '1D', period: undefined })).toBe(
        'protocol-v3-pulse-stats-groupBy-1D',
      )
    })
  })
})
