import { NextRequest, NextResponse } from 'next/server'
import { AthleteService } from '@/lib/athlete-service'
import { withMiddleware, hasSearchParams } from '@/lib/middleware'
import { withCache, addCacheHeaders } from '@/lib/cache-middleware'

async function handleAthletesRequest(request: NextRequest, validatedParams?: any) {
  try {
    const filters = validatedParams || await parseQueryParams(request)
    const result = await AthleteService.getAthletes(filters)
    
    const response = NextResponse.json(result)
    return addCacheHeaders(response, 1800)
  } catch (error) {
    console.error('Error fetching athletes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch athletes' },
      { status: 500 }
    )
  }
}

async function parseQueryParams(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const queryParams: any = {}
  
  // Text search
  if (searchParams.get('search')) {
    queryParams.search = searchParams.get('search')
  }
  
  // Categorical filters
  if (searchParams.get('gender')) {
    queryParams.gender = searchParams.get('gender')
  }
  if (searchParams.get('grade')) {
    queryParams.grade = parseInt(searchParams.get('grade')!)
  }
  if (searchParams.get('isAlumni')) {
    queryParams.isAlumni = searchParams.get('isAlumni') === 'true'
  }
  if (searchParams.get('isActive')) {
    queryParams.isActive = searchParams.get('isActive') === 'true'
  }
  if (searchParams.get('sport')) {
    queryParams.sport = parseInt(searchParams.get('sport')!)
  }
  if (searchParams.get('school')) {
    queryParams.school = parseInt(searchParams.get('school')!)
  }
  if (searchParams.get('conference')) {
    queryParams.conference = searchParams.get('conference')
  }
  
  // Performance ranges
  if (searchParams.get('scoreMin')) {
    queryParams.scoreMin = parseFloat(searchParams.get('scoreMin')!)
  }
  if (searchParams.get('scoreMax')) {
    queryParams.scoreMax = parseFloat(searchParams.get('scoreMax')!)
  }
  if (searchParams.get('totalFollowersMin')) {
    queryParams.totalFollowersMin = parseInt(searchParams.get('totalFollowersMin')!)
  }
  if (searchParams.get('totalFollowersMax')) {
    queryParams.totalFollowersMax = parseInt(searchParams.get('totalFollowersMax')!)
  }
  if (searchParams.get('engagementRateMin')) {
    queryParams.engagementRateMin = parseFloat(searchParams.get('engagementRateMin')!)
  }
  if (searchParams.get('engagementRateMax')) {
    queryParams.engagementRateMax = parseFloat(searchParams.get('engagementRateMax')!)
  }
  
  // Demographics
  if (searchParams.get('ethnicityHispanicMin')) {
    queryParams.ethnicityHispanicMin = parseFloat(searchParams.get('ethnicityHispanicMin')!)
  }
  if (searchParams.get('ethnicityHispanicMax')) {
    queryParams.ethnicityHispanicMax = parseFloat(searchParams.get('ethnicityHispanicMax')!)
  }
  if (searchParams.get('ethnicityWhiteMin')) {
    queryParams.ethnicityWhiteMin = parseFloat(searchParams.get('ethnicityWhiteMin')!)
  }
  if (searchParams.get('ethnicityWhiteMax')) {
    queryParams.ethnicityWhiteMax = parseFloat(searchParams.get('ethnicityWhiteMax')!)
  }
  if (searchParams.get('ethnicityBlackMin')) {
    queryParams.ethnicityBlackMin = parseFloat(searchParams.get('ethnicityBlackMin')!)
  }
  if (searchParams.get('ethnicityBlackMax')) {
    queryParams.ethnicityBlackMax = parseFloat(searchParams.get('ethnicityBlackMax')!)
  }
  if (searchParams.get('ethnicityAsianMin')) {
    queryParams.ethnicityAsianMin = parseFloat(searchParams.get('ethnicityAsianMin')!)
  }
  if (searchParams.get('ethnicityAsianMax')) {
    queryParams.ethnicityAsianMax = parseFloat(searchParams.get('ethnicityAsianMax')!)
  }
  if (searchParams.get('audienceGenderMaleMin')) {
    queryParams.audienceGenderMaleMin = parseFloat(searchParams.get('audienceGenderMaleMin')!)
  }
  if (searchParams.get('audienceGenderMaleMax')) {
    queryParams.audienceGenderMaleMax = parseFloat(searchParams.get('audienceGenderMaleMax')!)
  }
  if (searchParams.get('audienceGenderFemaleMin')) {
    queryParams.audienceGenderFemaleMin = parseFloat(searchParams.get('audienceGenderFemaleMin')!)
  }
  if (searchParams.get('audienceGenderFemaleMax')) {
    queryParams.audienceGenderFemaleMax = parseFloat(searchParams.get('audienceGenderFemaleMax')!)
  }
  
  // Platform filters
  if (searchParams.get('instagramFollowersMin')) {
    queryParams.instagramFollowersMin = parseInt(searchParams.get('instagramFollowersMin')!)
  }
  if (searchParams.get('instagramFollowersMax')) {
    queryParams.instagramFollowersMax = parseInt(searchParams.get('instagramFollowersMax')!)
  }
  if (searchParams.get('tiktokFollowersMin')) {
    queryParams.tiktokFollowersMin = parseInt(searchParams.get('tiktokFollowersMin')!)
  }
  if (searchParams.get('tiktokFollowersMax')) {
    queryParams.tiktokFollowersMax = parseInt(searchParams.get('tiktokFollowersMax')!)
  }
  
  // Pagination
  if (searchParams.get('page')) {
    queryParams.page = parseInt(searchParams.get('page')!)
  }
  if (searchParams.get('pageSize')) {
    queryParams.pageSize = parseInt(searchParams.get('pageSize')!)
  }
  if (searchParams.get('sortBy')) {
    queryParams.sortBy = searchParams.get('sortBy')
  }
  if (searchParams.get('sortOrder')) {
    queryParams.sortOrder = searchParams.get('sortOrder')
  }
  
  return queryParams
}

export async function GET(request: NextRequest) {
  // Use stricter rate limiting for search requests
  const useSearchRateLimit = hasSearchParams(request)
  
  return withMiddleware(request, handleAthletesRequest, {
    enableRateLimit: true,
    enableValidation: true,
    useSearchRateLimit
  })
}
