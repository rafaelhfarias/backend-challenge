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
  
  // Advanced Features - Date Ranges
  if (searchParams.get('createdAfter')) {
    queryParams.createdAfter = searchParams.get('createdAfter')
  }
  if (searchParams.get('createdBefore')) {
    queryParams.createdBefore = searchParams.get('createdBefore')
  }
  if (searchParams.get('updatedAfter')) {
    queryParams.updatedAfter = searchParams.get('updatedAfter')
  }
  if (searchParams.get('updatedBefore')) {
    queryParams.updatedBefore = searchParams.get('updatedBefore')
  }
  
  // Advanced Features - Content Categories
  if (searchParams.get('categoryIds')) {
    const categoryIdsStr = searchParams.get('categoryIds')!
    queryParams.categoryIds = categoryIdsStr.split(',').map(id => parseInt(id))
  }
  if (searchParams.get('categoryConfidenceMin')) {
    queryParams.categoryConfidenceMin = parseFloat(searchParams.get('categoryConfidenceMin')!)
  }
  if (searchParams.get('categoryConfidenceMax')) {
    queryParams.categoryConfidenceMax = parseFloat(searchParams.get('categoryConfidenceMax')!)
  }
  
  // Advanced Features - Multi-Platform
  if (searchParams.get('hasBothPlatforms')) {
    queryParams.hasBothPlatforms = searchParams.get('hasBothPlatforms') === 'true'
  }
  if (searchParams.get('platformType')) {
    queryParams.platformType = searchParams.get('platformType')
  }
  
  // Advanced Features - Complex Demographics
  if (searchParams.get('audienceAge13_17Min')) {
    queryParams.audienceAge13_17Min = parseFloat(searchParams.get('audienceAge13_17Min')!)
  }
  if (searchParams.get('audienceAge13_17Max')) {
    queryParams.audienceAge13_17Max = parseFloat(searchParams.get('audienceAge13_17Max')!)
  }
  if (searchParams.get('audienceAge18_24Min')) {
    queryParams.audienceAge18_24Min = parseFloat(searchParams.get('audienceAge18_24Min')!)
  }
  if (searchParams.get('audienceAge18_24Max')) {
    queryParams.audienceAge18_24Max = parseFloat(searchParams.get('audienceAge18_24Max')!)
  }
  if (searchParams.get('audienceAge25_34Min')) {
    queryParams.audienceAge25_34Min = parseFloat(searchParams.get('audienceAge25_34Min')!)
  }
  if (searchParams.get('audienceAge25_34Max')) {
    queryParams.audienceAge25_34Max = parseFloat(searchParams.get('audienceAge25_34Max')!)
  }
  if (searchParams.get('audienceAge35_44Min')) {
    queryParams.audienceAge35_44Min = parseFloat(searchParams.get('audienceAge35_44Min')!)
  }
  if (searchParams.get('audienceAge35_44Max')) {
    queryParams.audienceAge35_44Max = parseFloat(searchParams.get('audienceAge35_44Max')!)
  }
  if (searchParams.get('audienceAge45PlusMin')) {
    queryParams.audienceAge45PlusMin = parseFloat(searchParams.get('audienceAge45PlusMin')!)
  }
  if (searchParams.get('audienceAge45PlusMax')) {
    queryParams.audienceAge45PlusMax = parseFloat(searchParams.get('audienceAge45PlusMax')!)
  }
  
  // Advanced Features - Post Performance
  if (searchParams.get('instagramAvgLikesMin')) {
    queryParams.instagramAvgLikesMin = parseInt(searchParams.get('instagramAvgLikesMin')!)
  }
  if (searchParams.get('instagramAvgLikesMax')) {
    queryParams.instagramAvgLikesMax = parseInt(searchParams.get('instagramAvgLikesMax')!)
  }
  if (searchParams.get('instagramAvgCommentsMin')) {
    queryParams.instagramAvgCommentsMin = parseInt(searchParams.get('instagramAvgCommentsMin')!)
  }
  if (searchParams.get('instagramAvgCommentsMax')) {
    queryParams.instagramAvgCommentsMax = parseInt(searchParams.get('instagramAvgCommentsMax')!)
  }
  if (searchParams.get('tiktokAvgLikesMin')) {
    queryParams.tiktokAvgLikesMin = parseInt(searchParams.get('tiktokAvgLikesMin')!)
  }
  if (searchParams.get('tiktokAvgLikesMax')) {
    queryParams.tiktokAvgLikesMax = parseInt(searchParams.get('tiktokAvgLikesMax')!)
  }
  if (searchParams.get('tiktokAvgCommentsMin')) {
    queryParams.tiktokAvgCommentsMin = parseInt(searchParams.get('tiktokAvgCommentsMin')!)
  }
  if (searchParams.get('tiktokAvgCommentsMax')) {
    queryParams.tiktokAvgCommentsMax = parseInt(searchParams.get('tiktokAvgCommentsMax')!)
  }
  
  // Advanced Features - Location
  if (searchParams.get('locationUsMin')) {
    queryParams.locationUsMin = parseFloat(searchParams.get('locationUsMin')!)
  }
  if (searchParams.get('locationUsMax')) {
    queryParams.locationUsMax = parseFloat(searchParams.get('locationUsMax')!)
  }
  if (searchParams.get('locationMexicoMin')) {
    queryParams.locationMexicoMin = parseFloat(searchParams.get('locationMexicoMin')!)
  }
  if (searchParams.get('locationMexicoMax')) {
    queryParams.locationMexicoMax = parseFloat(searchParams.get('locationMexicoMax')!)
  }
  if (searchParams.get('locationCanadaMin')) {
    queryParams.locationCanadaMin = parseFloat(searchParams.get('locationCanadaMin')!)
  }
  if (searchParams.get('locationCanadaMax')) {
    queryParams.locationCanadaMax = parseFloat(searchParams.get('locationCanadaMax')!)
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
