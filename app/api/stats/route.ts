import { NextResponse } from 'next/server'
import { AthleteService } from '@/lib/athlete-service'

export async function GET() {
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
