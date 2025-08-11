import { NextRequest, NextResponse } from 'next/server'
import { AthleteService } from '@/lib/athlete-service'
import { withMiddleware } from '@/lib/middleware'

async function handleCacheInvalidation(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pattern = searchParams.get('pattern')
    
    await AthleteService.invalidateCache(pattern || undefined)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache invalidated successfully',
      pattern: pattern || 'all'
    })
  } catch (error) {
    console.error('Error invalidating cache:', error)
    return NextResponse.json(
      { error: 'Failed to invalidate cache' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return withMiddleware(request, handleCacheInvalidation, {
    enableRateLimit: true,
    enableValidation: false
  })
}
