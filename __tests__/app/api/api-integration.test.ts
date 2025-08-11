import { AthleteService } from '@/lib/athlete-service'
import { AthleteFiltersSchema } from '@/lib/types'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    athlete: {
      findMany: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
    },
    school: {
      findMany: jest.fn(),
    },
    sport: {
      findMany: jest.fn(),
    },
  },
}))

jest.mock('@/lib/cache', () => ({
  cacheService: {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    deletePattern: jest.fn(),
    exists: jest.fn(),
    generateKey: jest.fn(),
  },
  CACHE_KEYS: {
    ATHLETES: 'athletes',
    ATHLETE_STATS: 'athlete_stats',
    FILTERS: 'filters',
    SEARCH: 'search'
  }
}))

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AthleteService.getAthletes', () => {
    it('should handle empty filters', async () => {
      const mockAthletes = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          gender: 'Male',
          grade: 'Senior',
          isAlumni: false,
          isActive: true,
          needsReview: false,
          score: 85.5,
          totalFollowers: 10000,
          engagementRate: 4.2,
          age: 20,
          ageRange: '18-24',
          ethnicityHispanic: 10,
          ethnicityWhite: 60,
          ethnicityBlack: 20,
          ethnicityAsian: 5,
          ethnicityOther: 5,
          audienceGenderMale: 45,
          audienceGenderFemale: 55,
          instagramFollowers: 8000,
          instagramEngagementRate: 4.5,
          tiktokFollowers: 2000,
          tiktokEngagementRate: 3.8,
          school: {
            id: 1,
            label: 'University A',
            name: 'University A',
            state: 'CA',
            conference: 'Pac-12'
          },
          sports: [{ id: 1, label: 'Football', name: 'Football' }],
          categories: []
        }
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.athlete.findMany.mockResolvedValue(mockAthletes)
      prisma.athlete.count.mockResolvedValue(1)

      const filters = {}
      const validatedFilters = AthleteFiltersSchema.parse(filters)
      const result = await AthleteService.getAthletes(validatedFilters)

      expect(result.data).toHaveLength(1)
      expect(result.pagination.total).toBe(1)
      expect(result.data[0].name).toBe('John Doe')
    })

    it('should handle search filter', async () => {
      const mockAthletes = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          gender: 'Male',
          grade: 'Senior',
          isAlumni: false,
          isActive: true,
          needsReview: false,
          score: 85.5,
          totalFollowers: 10000,
          engagementRate: 4.2,
          age: 20,
          ageRange: '18-24',
          ethnicityHispanic: 10,
          ethnicityWhite: 60,
          ethnicityBlack: 20,
          ethnicityAsian: 5,
          ethnicityOther: 5,
          audienceGenderMale: 45,
          audienceGenderFemale: 55,
          instagramFollowers: 8000,
          instagramEngagementRate: 4.5,
          tiktokFollowers: 2000,
          tiktokEngagementRate: 3.8,
          school: {
            id: 1,
            label: 'University A',
            name: 'University A',
            state: 'CA',
            conference: 'Pac-12'
          },
          sports: [{ id: 1, label: 'Football', name: 'Football' }],
          categories: []
        }
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.athlete.findMany.mockResolvedValue(mockAthletes)
      prisma.athlete.count.mockResolvedValue(1)

      const filters = { search: 'John' }
      const validatedFilters = AthleteFiltersSchema.parse(filters)
      const result = await AthleteService.getAthletes(validatedFilters)

      expect(result.data).toHaveLength(1)
      expect(prisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              expect.objectContaining({
                OR: expect.arrayContaining([
                  { name: { contains: 'John', mode: 'insensitive' } },
                  { email: { contains: 'John', mode: 'insensitive' } },
                  { school: { name: { contains: 'John', mode: 'insensitive' } } }
                ])
              })
            ])
          })
        })
      )
    })

    it('should handle multiple filters', async () => {
      const mockAthletes = []

      const { prisma } = require('@/lib/prisma')
      prisma.athlete.findMany.mockResolvedValue(mockAthletes)
      prisma.athlete.count.mockResolvedValue(0)

      const filters = {
        gender: 'Male',
        grade: 'Senior',
        isActive: true,
        scoreMin: 80,
        scoreMax: 90,
        page: 1,
        pageSize: 10
      }
      const validatedFilters = AthleteFiltersSchema.parse(filters)
      const result = await AthleteService.getAthletes(validatedFilters)

      expect(result.data).toHaveLength(0)
      expect(prisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { gender: 'Male' },
              { grade: 'Senior' },
              { isActive: true },
              { score: { gte: 80, lte: 90 } }
            ])
          })
        })
      )
    })
  })

  describe('AthleteService.getFilterOptions', () => {
    it('should return filter options', async () => {
      const mockSchools = [
        { id: 1, label: 'University A', conference: 'Pac-12' },
        { id: 2, label: 'University B', conference: 'SEC' }
      ]
      const mockSports = [
        { id: 1, label: 'Football' },
        { id: 2, label: 'Basketball' }
      ]
      const mockConferences = [
        { conference: 'Pac-12' },
        { conference: 'SEC' }
      ]
      const mockGrades = [
        { grade: 'Freshman' },
        { grade: 'Sophomore' }
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.school.findMany
        .mockResolvedValueOnce(mockSchools)
        .mockResolvedValueOnce(mockConferences)
      prisma.sport.findMany.mockResolvedValue(mockSports)
      prisma.athlete.findMany.mockResolvedValue(mockGrades)

      const result = await AthleteService.getFilterOptions()

      expect(result.schools).toEqual(mockSchools)
      expect(result.sports).toEqual(mockSports)
      expect(result.conferences).toEqual(['Pac-12', 'SEC'])
      expect(result.grades).toEqual(['Freshman', 'Sophomore'])
    })
  })

  describe('AthleteService.getAthleteStats', () => {
    it('should return athlete statistics', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.athlete.count
        .mockResolvedValueOnce(150)
        .mockResolvedValueOnce(120)
        .mockResolvedValueOnce(30) 
      
      prisma.athlete.aggregate
        .mockResolvedValueOnce({ _avg: { score: 78.5 } })
        .mockResolvedValueOnce({ _avg: { totalFollowers: 8500 } })
        .mockResolvedValueOnce({ _avg: { engagementRate: 3.8 } })

      const result = await AthleteService.getAthleteStats()

      expect(result.totalAthletes).toBe(150)
      expect(result.activeAthletes).toBe(120)
      expect(result.alumniAthletes).toBe(30)
      expect(result.avgScore).toBe(78.5)
      expect(result.avgFollowers).toBe(8500)
      expect(result.avgEngagement).toBe(3.8)
    })

    it('should handle null averages', async () => {
      const { prisma } = require('@/lib/prisma')
      prisma.athlete.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
      
      prisma.athlete.aggregate
        .mockResolvedValueOnce({ _avg: { score: null } })
        .mockResolvedValueOnce({ _avg: { totalFollowers: null } })
        .mockResolvedValueOnce({ _avg: { engagementRate: null } })

      const result = await AthleteService.getAthleteStats()

      expect(result.totalAthletes).toBe(0)
      expect(result.activeAthletes).toBe(0)
      expect(result.alumniAthletes).toBe(0)
      expect(result.avgScore).toBe(0)
      expect(result.avgFollowers).toBe(0)
      expect(result.avgEngagement).toBe(0)
    })
  })

  describe('AthleteFiltersSchema validation', () => {
    it('should validate valid filters', () => {
      const validFilters = {
        search: 'John',
        gender: 'Male',
        grade: 'Senior',
        isAlumni: false,
        isActive: true,
        sport: 1,
        school: 2,
        conference: 'SEC',
        scoreMin: 80,
        scoreMax: 90,
        totalFollowersMin: 5000,
        totalFollowersMax: 15000,
        engagementRateMin: 3.0,
        engagementRateMax: 5.0,
        page: 1,
        pageSize: 20,
        sortBy: 'score',
        sortOrder: 'desc'
      }

      const result = AthleteFiltersSchema.parse(validFilters)
      expect(result).toEqual(validFilters)
    })

    it('should use default values for pagination', () => {
      const filters = {
        search: 'John'
      }

      const result = AthleteFiltersSchema.parse(filters)
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(20)
      expect(result.sortOrder).toBe('desc')
    })

    it('should reject invalid gender', () => {
      const invalidFilters = {
        gender: 'Invalid'
      }

      expect(() => {
        AthleteFiltersSchema.parse(invalidFilters)
      }).toThrow()
    })

    it('should reject invalid sort order', () => {
      const invalidFilters = {
        sortOrder: 'invalid'
      }

      expect(() => {
        AthleteFiltersSchema.parse(invalidFilters)
      }).toThrow()
    })

    it('should reject invalid page size', () => {
      const invalidFilters = {
        pageSize: 150
      }

      expect(() => {
        AthleteFiltersSchema.parse(invalidFilters)
      }).toThrow()
    })
  })
})
