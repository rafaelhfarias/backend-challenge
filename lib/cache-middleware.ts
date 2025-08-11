import { NextRequest, NextResponse } from 'next/server'
import { cacheService } from './cache'

export interface CacheOptions {
  ttl?: number
  key?: string
  tags?: string[]
}

export function withCache(options: CacheOptions = {}) {
  return function (handler: Function) {
    return async function (request: NextRequest, ...args: any[]) {
      const { ttl = 1800, key, tags = [] } = options
      
      const url = new URL(request.url)
      const cacheKey = key || `api:${url.pathname}:${url.search}`
      
      try {
        const cachedResponse = await cacheService.get(cacheKey)
        
        if (cachedResponse) {
          const response = NextResponse.json(cachedResponse)
          response.headers.set('X-Cache', 'HIT')
          response.headers.set('Cache-Control', `public, max-age=${ttl}`)
          return response
        }
        
        const result = await handler(request, ...args)
        
        if (result && result.status < 400) {
          const data = await result.json()
          await cacheService.set(cacheKey, data, ttl)
          
          result.headers.set('X-Cache', 'MISS')
          result.headers.set('Cache-Control', `public, max-age=${ttl}`)
        }
        
        return result
      } catch (error) {
        console.error('Cache middleware error:', error)
        return handler(request, ...args)
      }
    }
  }
}

export async function invalidateCacheByTags(tags: string[]): Promise<void> {
  for (const tag of tags) {
    await cacheService.deletePattern(`*:${tag}:*`)
  }
}

export function addCacheHeaders(response: NextResponse, ttl: number = 1800): NextResponse {
  response.headers.set('Cache-Control', `public, max-age=${ttl}`)
  response.headers.set('X-Cache', 'MISS')
  return response
}
