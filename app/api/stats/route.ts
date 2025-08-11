import { NextRequest, NextResponse } from 'next/server'
import { AthleteService } from '@/lib/athlete-service'
import { withMiddleware } from '@/lib/middleware'

async function handleStatsRequest(request: NextRequest) {
  try {
    const stats = await AthleteService.getAthleteStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return withMiddleware(request, handleStatsRequest, {
    enableRateLimit: true,
    enableValidation: false // No query parameters to validate
  })
}
