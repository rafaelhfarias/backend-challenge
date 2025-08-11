import { NextResponse } from 'next/server'
import { addCacheHeaders, invalidateCacheByTags } from '@/lib/cache-middleware'
import { cacheService } from '@/lib/cache'

jest.mock('@/lib/cache', () => ({
  cacheService: {
    get: jest.fn(),
    set: jest.fn(),
    deletePattern: jest.fn()
  }
}))

describe('Cache Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('addCacheHeaders', () => {
    it('should add cache headers to response', () => {
      const response = new Response(JSON.stringify({ data: 'test' }), {
        headers: { 'Content-Type': 'application/json' }
      })
      const result = addCacheHeaders(response, 1800)
      
      expect(result.headers.get('Cache-Control')).toBe('public, max-age=1800')
      expect(result.headers.get('X-Cache')).toBe('MISS')
    })

    it('should use default TTL when not provided', () => {
      const response = new Response(JSON.stringify({ data: 'test' }), {
        headers: { 'Content-Type': 'application/json' }
      })
      const result = addCacheHeaders(response)
      
      expect(result.headers.get('Cache-Control')).toBe('public, max-age=1800')
    })
  })

  describe('invalidateCacheByTags', () => {
    it('should delete cache entries by tags', async () => {
      const tags = ['tag1', 'tag2']
      
      await invalidateCacheByTags(tags)
      
      expect(cacheService.deletePattern).toHaveBeenCalledWith('*:tag1:*')
      expect(cacheService.deletePattern).toHaveBeenCalledWith('*:tag2:*')
    })
  })
})
