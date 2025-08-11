import { prisma } from './prisma'
import { AthleteFilters, AthleteResponse, AthletesResponse, FilterOptions, HighlightedText } from './types'
import { createFuseInstance, fuzzySearch, highlightTextWithMatches, calculateRelevanceScore } from './search-utils'

export class AthleteService {
  static async getAthletes(filters: AthleteFilters): Promise<AthletesResponse> {
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
          score: athlete.score,
          totalFollowers: athlete.totalFollowers,
          engagementRate: athlete.engagementRate,
          audienceQualityScore: athlete.audienceQualityScore,
          contentPerformanceScore: athlete.contentPerformanceScore,
        },
        platforms: {
          ...(athlete.instagramUsername && {
            instagram: {
              username: athlete.instagramUsername,
              followers: athlete.instagramFollowers || 0,
              engagementRate: athlete.instagramEngagementRate || 0,
            },
          }),
          ...(athlete.tiktokUsername && {
            tiktok: {
              username: athlete.tiktokUsername,
              followers: athlete.tiktokFollowers || 0,
              engagementRate: athlete.tiktokEngagementRate || 0,
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

    return {
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
  }

  static async getFilterOptions(): Promise<FilterOptions> {
    const [schools, sports, conferences, grades] = await Promise.all([
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
    ])

    return {
      schools,
      sports,
      conferences: conferences.map((c) => c.conference),
      grades: grades.map((g) => g.grade),
    }
  }

  static async getAthleteStats() {
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

    return {
      totalAthletes,
      activeAthletes,
      alumniAthletes,
      avgScore: avgScore._avg.score || 0,
      avgFollowers: avgFollowers._avg.totalFollowers || 0,
      avgEngagement: avgEngagement._avg.engagementRate || 0,
    }
  }
}
