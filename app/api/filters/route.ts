import { NextResponse } from 'next/server'
import { AthleteService } from '@/lib/athlete-service'

export async function GET() {
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
