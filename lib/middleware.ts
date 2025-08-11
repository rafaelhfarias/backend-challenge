import { NextRequest, NextResponse } from 'next/server'
import { apiRateLimiter, searchRateLimiter } from './rate-limiter'
import { validateAndSanitizeQueryParams } from './validation'

export interface MiddlewareOptions {
  enableRateLimit?: boolean
  enableValidation?: boolean
  useSearchRateLimit?: boolean
}

export async function withMiddleware(
  request: NextRequest,
  handler: (request: NextRequest, validatedParams?: any) => Promise<NextResponse>,
  options: MiddlewareOptions = {}
) {
  const {
    enableRateLimit = true,
    enableValidation = true,
    useSearchRateLimit = false
  } = options

  try {
    // Rate limiting
    if (enableRateLimit) {
      const rateLimiter = useSearchRateLimit ? searchRateLimiter : apiRateLimiter
      const rateLimitResult = rateLimiter.checkLimit(request)
      
      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again later.',
            resetTime: new Date(rateLimitResult.resetTime).toISOString()
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': rateLimiter['maxRequests'].toString(),
              'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
              'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
              'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
            }
          }
        )
      }

      // Validation
      if (enableValidation) {
        try {
          const { searchParams } = new URL(request.url)
          const validatedParams = validateAndSanitizeQueryParams(searchParams)
          
          // Call handler with validated params and add rate limit headers
          const response = await handler(request, validatedParams)
          response.headers.set('X-RateLimit-Limit', rateLimiter['maxRequests'].toString())
          response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
          response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString())
          return response
        } catch (validationError) {
          return NextResponse.json(
            {
              error: 'Validation failed',
              message: 'Invalid request parameters',
              details: JSON.parse(validationError.message)
            },
            { status: 400 }
          )
        }
      } else {
        // Only rate limiting, no validation
        const response = await handler(request)
        response.headers.set('X-RateLimit-Limit', rateLimiter['maxRequests'].toString())
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
        response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.resetTime).toISOString())
        return response
      }
    }

    // Only validation, no rate limiting
    if (enableValidation) {
      try {
        const { searchParams } = new URL(request.url)
        const validatedParams = validateAndSanitizeQueryParams(searchParams)
        return await handler(request, validatedParams)
      } catch (validationError) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            message: 'Invalid request parameters',
            details: JSON.parse(validationError.message)
          },
          { status: 400 }
        )
      }
    }

    // No middleware, just call handler
    return await handler(request)
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}

// Utility function to check if request has search parameters
export function hasSearchParams(request: NextRequest): boolean {
  const { searchParams } = new URL(request.url)
  return searchParams.has('search') && searchParams.get('search')?.trim() !== ''
}
