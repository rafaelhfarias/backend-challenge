import { NextRequest } from 'next/server'
import { apiRateLimiter, searchRateLimiter } from '@/lib/rate-limiter'

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Clear the rate limiter store before each test
    ;(apiRateLimiter as any).store = {}
    ;(searchRateLimiter as any).store = {}
  })

  const createMockRequest = (ip: string = '127.0.0.1'): NextRequest => {
    const headers = new Headers()
    headers.set('x-forwarded-for', ip)
    
    return {
      headers,
      url: 'http://localhost:3000/api/athletes'
    } as NextRequest
  }

  describe('API Rate Limiter', () => {
    it('should allow requests within limit', () => {
      const request = createMockRequest()
      
      for (let i = 0; i < 100; i++) {
        const result = apiRateLimiter.checkLimit(request)
        expect(result.allowed).toBe(true)
        expect(result.remaining).toBe(99 - i)
      }
    })

    it('should block requests after limit exceeded', () => {
      const request = createMockRequest()
      
      // Make 100 requests (at the limit)
      for (let i = 0; i < 100; i++) {
        apiRateLimiter.checkLimit(request)
      }
      
      // 101st request should be blocked
      const result = apiRateLimiter.checkLimit(request)
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should reset after window expires', () => {
      const request = createMockRequest()
      
      // Make some requests
      for (let i = 0; i < 50; i++) {
        apiRateLimiter.checkLimit(request)
      }
      
      // Mock time passing by manipulating the store
      const clientId = (apiRateLimiter as any).getClientId(request)
      ;(apiRateLimiter as any).store[clientId].resetTime = Date.now() - 1000 // 1 second ago
      
      // Should reset and allow requests again
      const result = apiRateLimiter.checkLimit(request)
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(99)
    })
  })

  describe('Search Rate Limiter', () => {
    it('should have stricter limits for search requests', () => {
      const request = createMockRequest()
      
      for (let i = 0; i < 30; i++) {
        const result = searchRateLimiter.checkLimit(request)
        expect(result.allowed).toBe(true)
        expect(result.remaining).toBe(29 - i)
      }
      
      // 31st request should be blocked
      const result = searchRateLimiter.checkLimit(request)
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })
  })

  describe('Client Identification', () => {
    it('should identify clients by IP address', () => {
      const request1 = createMockRequest('192.168.1.1')
      const request2 = createMockRequest('192.168.1.2')
      
      // Each IP should have separate limits
      for (let i = 0; i < 50; i++) {
        apiRateLimiter.checkLimit(request1)
        apiRateLimiter.checkLimit(request2)
      }
      
      // Both should still be allowed
      expect(apiRateLimiter.checkLimit(request1).allowed).toBe(true)
      expect(apiRateLimiter.checkLimit(request2).allowed).toBe(true)
    })

    it('should handle missing IP gracefully', () => {
      const request = createMockRequest()
      request.headers.delete('x-forwarded-for')
      
      const result = apiRateLimiter.checkLimit(request)
      expect(result.allowed).toBe(true)
    })
  })
})
