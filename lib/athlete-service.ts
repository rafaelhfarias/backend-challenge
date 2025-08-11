import { prisma } from './prisma'
import { AthleteFilters, AthleteResponse, AthletesResponse, FilterOptions, HighlightedText } from './types'
import { createFuseInstance, fuzzySearch, highlightTextWithMatches, calculateRelevanceScore } from './search-utils'
import { cacheService, CACHE_KEYS } from './cache'

export class AthleteService {
  static async getAthletes(filters: AthleteFilters): Promise<AthletesResponse> {
    const cacheKey = cacheService.generateKey(CACHE_KEYS.ATHLETES, filters)
    const cachedResult = await cacheService.get<AthletesResponse>(cacheKey)
    
    if (cachedResult) {
      return cachedResult
    }
    const {
      search,
      gender,
      grade,
      isAlumni,
      isActive,
      sport,
      school,
      conference,
      scoreMin,
      scoreMax,
      totalFollowersMin,
      totalFollowersMax,
      engagementRateMin,
      engagementRateMax,
      ethnicityHispanicMin,
      ethnicityHispanicMax,
      ethnicityWhiteMin,
      ethnicityWhiteMax,
      ethnicityBlackMin,
      ethnicityBlackMax,
      ethnicityAsianMin,
      ethnicityAsianMax,
      audienceGenderMaleMin,
      audienceGenderMaleMax,
      audienceGenderFemaleMin,
      audienceGenderFemaleMax,
      instagramFollowersMin,
      instagramFollowersMax,
      tiktokFollowersMin,
      tiktokFollowersMax,
      // Advanced Features - Date Ranges
      createdAfter,
      createdBefore,
      updatedAfter,
      updatedBefore,
      // Advanced Features - Content Categories
      categoryIds,
      categoryConfidenceMin,
      categoryConfidenceMax,
      // Advanced Features - Multi-Platform
      hasBothPlatforms,
      platformType,
      // Advanced Features - Complex Demographics
      audienceAge13_17Min,
      audienceAge13_17Max,
      audienceAge18_24Min,
      audienceAge18_24Max,
      audienceAge25_34Min,
      audienceAge25_34Max,
      audienceAge35_44Min,
      audienceAge35_44Max,
      audienceAge45PlusMin,
      audienceAge45PlusMax,
      // Advanced Features - Post Performance
      instagramAvgLikesMin,
      instagramAvgLikesMax,
      instagramAvgCommentsMin,
      instagramAvgCommentsMax,
      tiktokAvgLikesMin,
      tiktokAvgLikesMax,
      tiktokAvgCommentsMin,
      tiktokAvgCommentsMax,
      // Advanced Features - Location
      locationUsMin,
      locationUsMax,
      locationMexicoMin,
      locationMexicoMax,
      locationCanadaMin,
      locationCanadaMax,
      page = 1,
      pageSize = 20,
      sortBy = 'score',
      sortOrder = 'desc',
    } = filters

    // Build where conditions
    const where: any = {
      AND: [],
    }

    // Text search - use database search for initial filtering
    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { school: { name: { contains: search, mode: 'insensitive' } } },
        ],
      })
    }

    // Categorical filters
    if (gender) where.AND.push({ gender })
    if (grade) where.AND.push({ grade })
    if (isAlumni !== undefined) where.AND.push({ isAlumni })
    if (isActive !== undefined) where.AND.push({ isActive })

    // School and conference filters
    if (school) {
      where.AND.push({ schoolId: school })
    } else if (conference) {
      where.AND.push({ school: { conference } })
    }

    // Sport filter
    if (sport) {
      where.AND.push({ sports: { some: { id: sport } } })
    }

    // Performance ranges
    if (scoreMin !== undefined || scoreMax !== undefined) {
      const scoreFilter: any = {}
      if (scoreMin !== undefined) scoreFilter.gte = scoreMin
      if (scoreMax !== undefined) scoreFilter.lte = scoreMax
      where.AND.push({ score: scoreFilter })
    }

    if (totalFollowersMin !== undefined || totalFollowersMax !== undefined) {
      const followersFilter: any = {}
      if (totalFollowersMin !== undefined) followersFilter.gte = totalFollowersMin
      if (totalFollowersMax !== undefined) followersFilter.lte = totalFollowersMax
      where.AND.push({ totalFollowers: followersFilter })
    }

    if (engagementRateMin !== undefined || engagementRateMax !== undefined) {
      const engagementFilter: any = {}
      if (engagementRateMin !== undefined) engagementFilter.gte = engagementRateMin
      if (engagementRateMax !== undefined) engagementFilter.lte = engagementRateMax
      where.AND.push({ engagementRate: engagementFilter })
    }

    // Demographics filters
    if (ethnicityHispanicMin !== undefined || ethnicityHispanicMax !== undefined) {
      const filter: any = {}
      if (ethnicityHispanicMin !== undefined) filter.gte = ethnicityHispanicMin
      if (ethnicityHispanicMax !== undefined) filter.lte = ethnicityHispanicMax
      where.AND.push({ ethnicityHispanic: filter })
    }

    if (ethnicityWhiteMin !== undefined || ethnicityWhiteMax !== undefined) {
      const filter: any = {}
      if (ethnicityWhiteMin !== undefined) filter.gte = ethnicityWhiteMin
      if (ethnicityWhiteMax !== undefined) filter.lte = ethnicityWhiteMax
      where.AND.push({ ethnicityWhite: filter })
    }

    if (ethnicityBlackMin !== undefined || ethnicityBlackMax !== undefined) {
      const filter: any = {}
      if (ethnicityBlackMin !== undefined) filter.gte = ethnicityBlackMin
      if (ethnicityBlackMax !== undefined) filter.lte = ethnicityBlackMax
      where.AND.push({ ethnicityBlack: filter })
    }

    if (ethnicityAsianMin !== undefined || ethnicityAsianMax !== undefined) {
      const filter: any = {}
      if (ethnicityAsianMin !== undefined) filter.gte = ethnicityAsianMin
      if (ethnicityAsianMax !== undefined) filter.lte = ethnicityAsianMax
      where.AND.push({ ethnicityAsian: filter })
    }

    if (audienceGenderMaleMin !== undefined || audienceGenderMaleMax !== undefined) {
      const filter: any = {}
      if (audienceGenderMaleMin !== undefined) filter.gte = audienceGenderMaleMin
      if (audienceGenderMaleMax !== undefined) filter.lte = audienceGenderMaleMax
      where.AND.push({ audienceGenderMale: filter })
    }

    if (audienceGenderFemaleMin !== undefined || audienceGenderFemaleMax !== undefined) {
      const filter: any = {}
      if (audienceGenderFemaleMin !== undefined) filter.gte = audienceGenderFemaleMin
      if (audienceGenderFemaleMax !== undefined) filter.lte = audienceGenderFemaleMax
      where.AND.push({ audienceGenderFemale: filter })
    }

    // Platform filters
    if (instagramFollowersMin !== undefined || instagramFollowersMax !== undefined) {
      const filter: any = {}
      if (instagramFollowersMin !== undefined) filter.gte = instagramFollowersMin
      if (instagramFollowersMax !== undefined) filter.lte = instagramFollowersMax
      where.AND.push({ instagramFollowers: filter })
    }

    if (tiktokFollowersMin !== undefined || tiktokFollowersMax !== undefined) {
      const filter: any = {}
      if (tiktokFollowersMin !== undefined) filter.gte = tiktokFollowersMin
      if (tiktokFollowersMax !== undefined) filter.lte = tiktokFollowersMax
      where.AND.push({ tiktokFollowers: filter })
    }

    // Advanced Features - Date Ranges
    if (createdAfter || createdBefore) {
      const dateFilter: any = {}
      if (createdAfter) dateFilter.gte = new Date(createdAfter)
      if (createdBefore) dateFilter.lte = new Date(createdBefore)
      where.AND.push({ createdAt: dateFilter })
    }

    if (updatedAfter || updatedBefore) {
      const dateFilter: any = {}
      if (updatedAfter) dateFilter.gte = new Date(updatedAfter)
      if (updatedBefore) dateFilter.lte = new Date(updatedBefore)
      where.AND.push({ updatedAt: dateFilter })
    }

    // Advanced Features - Content Categories
    if (categoryIds && categoryIds.length > 0) {
      where.AND.push({
        categories: {
          some: {
            categoryId: { in: categoryIds }
          }
        }
      })
    }

    if (categoryConfidenceMin !== undefined || categoryConfidenceMax !== undefined) {
      const confidenceFilter: any = {}
      if (categoryConfidenceMin !== undefined) confidenceFilter.gte = categoryConfidenceMin
      if (categoryConfidenceMax !== undefined) confidenceFilter.lte = categoryConfidenceMax
      where.AND.push({
        categories: {
          some: {
            confidenceScore: confidenceFilter
          }
        }
      })
    }

    // Advanced Features - Multi-Platform
    if (hasBothPlatforms) {
      where.AND.push({
        AND: [
          { instagramUsername: { not: null } },
          { tiktokUsername: { not: null } }
        ]
      })
    }

    if (platformType) {
      if (platformType === 'instagram') {
        where.AND.push({
          AND: [
            { instagramUsername: { not: null } },
            { tiktokUsername: null }
          ]
        })
      } else if (platformType === 'tiktok') {
        where.AND.push({
          AND: [
            { instagramUsername: null },
            { tiktokUsername: { not: null } }
          ]
        })
      } else if (platformType === 'both') {
        where.AND.push({
          AND: [
            { instagramUsername: { not: null } },
            { tiktokUsername: { not: null } }
          ]
        })
      }
    }

    // Advanced Features - Complex Demographics
    if (audienceAge13_17Min !== undefined || audienceAge13_17Max !== undefined) {
      const filter: any = {}
      if (audienceAge13_17Min !== undefined) filter.gte = audienceAge13_17Min
      if (audienceAge13_17Max !== undefined) filter.lte = audienceAge13_17Max
      where.AND.push({ audienceAge13_17: filter })
    }

    if (audienceAge18_24Min !== undefined || audienceAge18_24Max !== undefined) {
      const filter: any = {}
      if (audienceAge18_24Min !== undefined) filter.gte = audienceAge18_24Min
      if (audienceAge18_24Max !== undefined) filter.lte = audienceAge18_24Max
      where.AND.push({ audienceAge18_24: filter })
    }

    if (audienceAge25_34Min !== undefined || audienceAge25_34Max !== undefined) {
      const filter: any = {}
      if (audienceAge25_34Min !== undefined) filter.gte = audienceAge25_34Min
      if (audienceAge25_34Max !== undefined) filter.lte = audienceAge25_34Max
      where.AND.push({ audienceAge25_34: filter })
    }

    if (audienceAge35_44Min !== undefined || audienceAge35_44Max !== undefined) {
      const filter: any = {}
      if (audienceAge35_44Min !== undefined) filter.gte = audienceAge35_44Min
      if (audienceAge35_44Max !== undefined) filter.lte = audienceAge35_44Max
      where.AND.push({ audienceAge35_44: filter })
    }

    if (audienceAge45PlusMin !== undefined || audienceAge45PlusMax !== undefined) {
      const filter: any = {}
      if (audienceAge45PlusMin !== undefined) filter.gte = audienceAge45PlusMin
      if (audienceAge45PlusMax !== undefined) filter.lte = audienceAge45PlusMax
      where.AND.push({ audienceAge45Plus: filter })
    }

    // Advanced Features - Post Performance
    if (instagramAvgLikesMin !== undefined || instagramAvgLikesMax !== undefined) {
      const filter: any = {}
      if (instagramAvgLikesMin !== undefined) filter.gte = instagramAvgLikesMin
      if (instagramAvgLikesMax !== undefined) filter.lte = instagramAvgLikesMax
      where.AND.push({ instagramAvgLikes: filter })
    }

    if (instagramAvgCommentsMin !== undefined || instagramAvgCommentsMax !== undefined) {
      const filter: any = {}
      if (instagramAvgCommentsMin !== undefined) filter.gte = instagramAvgCommentsMin
      if (instagramAvgCommentsMax !== undefined) filter.lte = instagramAvgCommentsMax
      where.AND.push({ instagramAvgComments: filter })
    }

    if (tiktokAvgLikesMin !== undefined || tiktokAvgLikesMax !== undefined) {
      const filter: any = {}
      if (tiktokAvgLikesMin !== undefined) filter.gte = tiktokAvgLikesMin
      if (tiktokAvgLikesMax !== undefined) filter.lte = tiktokAvgLikesMax
      where.AND.push({ tiktokAvgLikes: filter })
    }

    if (tiktokAvgCommentsMin !== undefined || tiktokAvgCommentsMax !== undefined) {
      const filter: any = {}
      if (tiktokAvgCommentsMin !== undefined) filter.gte = tiktokAvgCommentsMin
      if (tiktokAvgCommentsMax !== undefined) filter.lte = tiktokAvgCommentsMax
      where.AND.push({ tiktokAvgComments: filter })
    }

    // Advanced Features - Location
    if (locationUsMin !== undefined || locationUsMax !== undefined) {
      const filter: any = {}
      if (locationUsMin !== undefined) filter.gte = locationUsMin
      if (locationUsMax !== undefined) filter.lte = locationUsMax
      where.AND.push({ locationUs: filter })
    }

    if (locationMexicoMin !== undefined || locationMexicoMax !== undefined) {
      const filter: any = {}
      if (locationMexicoMin !== undefined) filter.gte = locationMexicoMin
      if (locationMexicoMax !== undefined) filter.lte = locationMexicoMax
      where.AND.push({ locationMexico: filter })
    }

    if (locationCanadaMin !== undefined || locationCanadaMax !== undefined) {
      const filter: any = {}
      if (locationCanadaMin !== undefined) filter.gte = locationCanadaMin
      if (locationCanadaMax !== undefined) filter.lte = locationCanadaMax
      where.AND.push({ locationCanada: filter })
    }

    if (where.AND.length === 0) {
      delete where.AND
    }

    const orderBy: any = {}
    if (sortBy === 'name') orderBy.name = sortOrder
    else if (sortBy === 'score') orderBy.score = sortOrder
    else if (sortBy === 'totalFollowers') orderBy.totalFollowers = sortOrder
    else if (sortBy === 'engagementRate') orderBy.engagementRate = sortOrder
    else if (sortBy === 'age') orderBy.age = sortOrder
    else orderBy.score = 'desc'

    const total = await prisma.athlete.count({ where })

    const athletes = await prisma.athlete.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        school: true,
        sports: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    })

    const data: AthleteResponse[] = athletes.map((athlete) => {
      const baseResponse: AthleteResponse = {
        id: athlete.id,
        name: athlete.name,
        email: athlete.email,
        gender: athlete.gender,
        isAlumni: athlete.isAlumni,
        grade: athlete.grade,
        isActive: athlete.isActive,
        needsReview: athlete.needsReview,
        school: {
          id: athlete.school.id,
          label: athlete.school.label,
          name: athlete.school.name,
          state: athlete.school.state,
          conference: athlete.school.conference,
        },
        sports: athlete.sports.map((sport) => ({
          id: sport.id,
          label: sport.label,
          name: sport.name,
        })),
        currentScore: {
          score: athlete.score || 0,
          totalFollowers: athlete.totalFollowers || 0,
          engagementRate: athlete.engagementRate || 0,
          audienceQualityScore: athlete.audienceQualityScore || 0,
          contentPerformanceScore: athlete.contentPerformanceScore || 0,
        },
        platforms: {
          ...(athlete.instagramUsername && {
            instagram: {
              username: athlete.instagramUsername,
              followers: athlete.instagramFollowers || 0,
              following: athlete.instagramFollowing || 0,
              posts: athlete.instagramPosts || 0,
              engagementRate: athlete.instagramEngagementRate || 0,
              avgLikes: athlete.instagramAvgLikes || 0,
              avgComments: athlete.instagramAvgComments || 0,
            },
          }),
          ...(athlete.tiktokUsername && {
            tiktok: {
              username: athlete.tiktokUsername,
              followers: athlete.tiktokFollowers || 0,
              following: athlete.tiktokFollowing || 0,
              posts: athlete.tiktokPosts || 0,
              engagementRate: athlete.tiktokEngagementRate || 0,
              avgLikes: athlete.tiktokAvgLikes || 0,
              avgComments: athlete.tiktokAvgComments || 0,
            },
          }),
        },
        demographics: {
          age: athlete.age,
          ageRange: athlete.ageRange,
          ethnicity: {
            hispanic: athlete.ethnicityHispanic,
            white: athlete.ethnicityWhite,
            black: athlete.ethnicityBlack,
            asian: athlete.ethnicityAsian,
            other: athlete.ethnicityOther,
          },
          audienceGender: {
            male: athlete.audienceGenderMale,
            female: athlete.audienceGenderFemale,
          },
          audienceAge: {
            age13_17: athlete.audienceAge13_17 || 0,
            age18_24: athlete.audienceAge18_24 || 0,
            age25_34: athlete.audienceAge25_34 || 0,
            age35_44: athlete.audienceAge35_44 || 0,
            age45Plus: athlete.audienceAge45Plus || 0,
          },
          location: {
            us: athlete.locationUs || 0,
            mexico: athlete.locationMexico || 0,
            canada: athlete.locationCanada || 0,
            other: athlete.locationOther || 0,
          },
          topCities: athlete.topCities || '',
          interests: athlete.interests || '',
        },
        categories: athlete.categories.map((ac) => ({
          id: ac.category.id,
          name: ac.category.name,
          confidenceScore: ac.confidenceScore,
        })),
      }

      if (search) {
        const fuse = createFuseInstance([athlete])
        const searchResults = fuzzySearch(fuse, search, 1)
        
        if (searchResults.length > 0) {
          const result = searchResults[0]
          
          if (result.matches) {
            const nameMatch = result.matches.find(m => m.key === 'name')
            const emailMatch = result.matches.find(m => m.key === 'email')
            const schoolMatch = result.matches.find(m => m.key === 'school.name')
            
            if (nameMatch) {
              baseResponse.highlightedName = highlightTextWithMatches(athlete.name, [nameMatch])
            }
            if (emailMatch) {
              baseResponse.highlightedEmail = highlightTextWithMatches(athlete.email, [emailMatch])
            }
            if (schoolMatch) {
              baseResponse.highlightedSchool = highlightTextWithMatches(athlete.school.name, [schoolMatch])
            }
          }
        }
      }

      return baseResponse
    })

    const totalPages = Math.ceil(total / pageSize)

    const result = {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }

    await cacheService.set(cacheKey, result, 1800)
    return result
  }

  static async getFilterOptions(): Promise<FilterOptions> {
    const cacheKey = CACHE_KEYS.FILTERS
    const cachedResult = await cacheService.get<FilterOptions>(cacheKey)
    
    if (cachedResult) {
      return cachedResult
    }

    const [schools, sports, conferences, grades, categories] = await Promise.all([
      prisma.school.findMany({
        select: { id: true, label: true, conference: true },
        orderBy: { label: 'asc' },
      }),
      prisma.sport.findMany({
        select: { id: true, label: true },
        orderBy: { label: 'asc' },
      }),
      prisma.school.findMany({
        select: { conference: true },
        distinct: ['conference'],
        orderBy: { conference: 'asc' },
      }),
      prisma.athlete.findMany({
        select: { grade: true },
        distinct: ['grade'],
        orderBy: { grade: 'asc' },
      }),
      prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
    ])

    const result = {
      schools,
      sports,
      conferences: conferences.map((c) => c.conference),
      grades: grades.map((g) => g.grade),
      categories,
    }

    await cacheService.set(cacheKey, result, 3600)
    return result
  }

  static async getAthleteStats() {
    const cacheKey = CACHE_KEYS.ATHLETE_STATS
    const cachedResult = await cacheService.get(cacheKey)
    
    if (cachedResult) {
      return cachedResult
    }

    const [
      totalAthletes,
      activeAthletes,
      alumniAthletes,
      avgScore,
      avgFollowers,
      avgEngagement,
    ] = await Promise.all([
      prisma.athlete.count(),
      prisma.athlete.count({ where: { isActive: true } }),
      prisma.athlete.count({ where: { isAlumni: true } }),
      prisma.athlete.aggregate({ _avg: { score: true } }),
      prisma.athlete.aggregate({ _avg: { totalFollowers: true } }),
      prisma.athlete.aggregate({ _avg: { engagementRate: true } }),
    ])

    const result = {
      totalAthletes,
      activeAthletes,
      alumniAthletes,
      avgScore: avgScore._avg.score || 0,
      avgFollowers: avgFollowers._avg.totalFollowers || 0,
      avgEngagement: avgEngagement._avg.engagementRate || 0,
    }

    await cacheService.set(cacheKey, result, 1800)
    return result
  }

  static async invalidateCache(pattern?: string): Promise<void> {
    if (pattern) {
      await cacheService.deletePattern(pattern)
    } else {
      await cacheService.deletePattern(`${CACHE_KEYS.ATHLETES}:*`)
      await cacheService.delete(CACHE_KEYS.FILTERS)
      await cacheService.delete(CACHE_KEYS.ATHLETE_STATS)
    }
  }
}
