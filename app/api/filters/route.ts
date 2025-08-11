import { NextRequest, NextResponse } from 'next/server'
import { AthleteService } from '@/lib/athlete-service'
import { withMiddleware } from '@/lib/middleware'
import { addCacheHeaders } from '@/lib/cache-middleware'

async function handleFiltersRequest(request: NextRequest) {
  try {
    const filterOptions = await AthleteService.getFilterOptions()
    const response = NextResponse.json(filterOptions)
    return addCacheHeaders(response, 3600)
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return withMiddleware(request, handleFiltersRequest, {
    enableRateLimit: true,
    enableValidation: false
  })
}
