import { NextRequest, NextResponse } from 'next/server'
import { AthleteService } from '@/lib/athlete-service'
import { withMiddleware } from '@/lib/middleware'

async function handleFiltersRequest(request: NextRequest) {
  try {
    const filterOptions = await AthleteService.getFilterOptions()
    return NextResponse.json(filterOptions)
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
    enableValidation: false // No query parameters to validate
  })
}
