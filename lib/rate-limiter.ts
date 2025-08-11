interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private windowMs: number
  private maxRequests: number

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  private getClientId(request: Request): string {
    // Use IP address as client identifier
    // In production, you might want to use a more sophisticated method
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || realIp || 'unknown'
    return ip
  }

  private cleanup(): void {
    const now = Date.now()
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime <= now) {
        delete this.store[key]
      }
    })
  }

  checkLimit(request: Request): { allowed: boolean; remaining: number; resetTime: number } {
    this.cleanup()
    
    const clientId = this.getClientId(request)
    const now = Date.now()
    
    if (!this.store[clientId]) {
      this.store[clientId] = {
        count: 1,
        resetTime: now + this.windowMs
      }
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: this.store[clientId].resetTime
      }
    }

    const client = this.store[clientId]
    
    if (now > client.resetTime) {
      // Reset window
      client.count = 1
      client.resetTime = now + this.windowMs
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: client.resetTime
      }
    }

    if (client.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: client.resetTime
      }
    }

    client.count++
    return {
      allowed: true,
      remaining: this.maxRequests - client.count,
      resetTime: client.resetTime
    }
  }
}

// Create rate limiter instances for different endpoints
export const apiRateLimiter = new RateLimiter(15 * 60 * 1000, 100) // 100 requests per 15 minutes
export const searchRateLimiter = new RateLimiter(5 * 60 * 1000, 30) // 30 requests per 5 minutes for search
