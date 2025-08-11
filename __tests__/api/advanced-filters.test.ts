import { describe, it, expect, beforeEach } from '@jest/globals'
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
    category: {
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

describe('Advanced Filters', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Date Range Filters', () => {
    it('should filter by created date range', async () => {
      const mockAthletes: any[] = []
      const { prisma } = require('@/lib/prisma')
      prisma.athlete.findMany.mockResolvedValue(mockAthletes)
      prisma.athlete.count.mockResolvedValue(0)

      const filters = {
        createdAfter: '2024-01-01',
        createdBefore: '2024-12-31'
      }
      const validatedFilters = AthleteFiltersSchema.parse(filters)
      const result = await AthleteService.getAthletes(validatedFilters)

      expect(prisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { createdAt: { gte: new Date('2024-01-01'), lte: new Date('2024-12-31') } }
            ])
          })
        })
      )
    })

    it('should filter by updated date range', async () => {
      const mockAthletes: any[] = []
      const { prisma } = require('@/lib/prisma')
      prisma.athlete.findMany.mockResolvedValue(mockAthletes)
      prisma.athlete.count.mockResolvedValue(0)

      const filters = {
        updatedAfter: '2024-06-01',
        updatedBefore: '2024-12-31'
      }
      const validatedFilters = AthleteFiltersSchema.parse(filters)
      const result = await AthleteService.getAthletes(validatedFilters)

      expect(prisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { updatedAt: { gte: new Date('2024-06-01'), lte: new Date('2024-12-31') } }
            ])
          })
        })
      )
    })
  })

  describe('Content Category Filters', () => {
    it('should filter by category IDs', async () => {
      const mockAthletes: any[] = []
      const { prisma } = require('@/lib/prisma')
      prisma.athlete.findMany.mockResolvedValue(mockAthletes)
      prisma.athlete.count.mockResolvedValue(0)

      const filters = {
        categoryIds: [1, 2, 3]
      }
      const validatedFilters = AthleteFiltersSchema.parse(filters)
      const result = await AthleteService.getAthletes(validatedFilters)

      expect(prisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              {
                categories: {
                  some: {
                    categoryId: { in: [1, 2, 3] }
                  }
                }
              }
            ])
          })
        })
      )
    })

    it('should filter by category confidence range', async () => {
      const mockAthletes: any[] = []
      const { prisma } = require('@/lib/prisma')
      prisma.athlete.findMany.mockResolvedValue(mockAthletes)
      prisma.athlete.count.mockResolvedValue(0)

      const filters = {
        categoryConfidenceMin: 80,
        categoryConfidenceMax: 95
      }
      const validatedFilters = AthleteFiltersSchema.parse(filters)
      const result = await AthleteService.getAthletes(validatedFilters)

      expect(prisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              {
                categories: {
                  some: {
                    confidenceScore: { gte: 80, lte: 95 }
                  }
                }
              }
            ])
          })
        })
      )
    })
  })

  describe('Multi-Platform Filters', () => {
    it('should filter athletes with both platforms', async () => {
      const mockAthletes: any[] = []
      const { prisma } = require('@/lib/prisma')
      prisma.athlete.findMany.mockResolvedValue(mockAthletes)
      prisma.athlete.count.mockResolvedValue(0)

      const filters = {
        hasBothPlatforms: true
      }
      const validatedFilters = AthleteFiltersSchema.parse(filters)
      const result = await AthleteService.getAthletes(validatedFilters)

      expect(prisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              {
                AND: [
                  { instagramUsername: { not: null } },
                  { tiktokUsername: { not: null } }
                ]
              }
            ])
          })
        })
      )
    })

    it('should filter by platform type', async () => {
      const mockAthletes: any[] = []
      const { prisma } = require('@/lib/prisma')
      prisma.athlete.findMany.mockResolvedValue(mockAthletes)
      prisma.athlete.count.mockResolvedValue(0)

      const filters = {
        platformType: 'both'
      }
      const validatedFilters = AthleteFiltersSchema.parse(filters)
      const result = await AthleteService.getAthletes(validatedFilters)

      expect(prisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              {
                AND: [
                  { instagramUsername: { not: null } },
                  { tiktokUsername: { not: null } }
                ]
              }
            ])
          })
        })
      )
    })
  })

  describe('Complex Demographics Filters', () => {
    it('should filter by audience age demographics', async () => {
      const mockAthletes: any[] = []
      const { prisma } = require('@/lib/prisma')
      prisma.athlete.findMany.mockResolvedValue(mockAthletes)
      prisma.athlete.count.mockResolvedValue(0)

      const filters = {
        audienceAge18_24Min: 40,
        audienceAge25_34Min: 20
      }
      const validatedFilters = AthleteFiltersSchema.parse(filters)
      const result = await AthleteService.getAthletes(validatedFilters)

      expect(prisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { audienceAge18_24: { gte: 40 } },
              { audienceAge25_34: { gte: 20 } }
            ])
          })
        })
      )
    })
  })

  describe('Post Performance Filters', () => {
    it('should filter by Instagram post performance', async () => {
      const mockAthletes: any[] = []
      const { prisma } = require('@/lib/prisma')
      prisma.athlete.findMany.mockResolvedValue(mockAthletes)
      prisma.athlete.count.mockResolvedValue(0)

      const filters = {
        instagramAvgLikesMin: 1000,
        instagramAvgCommentsMin: 100
      }
      const validatedFilters = AthleteFiltersSchema.parse(filters)
      const result = await AthleteService.getAthletes(validatedFilters)

      expect(prisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { instagramAvgLikes: { gte: 1000 } },
              { instagramAvgComments: { gte: 100 } }
            ])
          })
        })
      )
    })

    it('should filter by TikTok post performance', async () => {
      const mockAthletes: any[] = []
      const { prisma } = require('@/lib/prisma')
      prisma.athlete.findMany.mockResolvedValue(mockAthletes)
      prisma.athlete.count.mockResolvedValue(0)

      const filters = {
        tiktokAvgLikesMin: 500,
        tiktokAvgCommentsMin: 50
      }
      const validatedFilters = AthleteFiltersSchema.parse(filters)
      const result = await AthleteService.getAthletes(validatedFilters)

      expect(prisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { tiktokAvgLikes: { gte: 500 } },
              { tiktokAvgComments: { gte: 50 } }
            ])
          })
        })
      )
    })
  })

  describe('Location Demographics Filters', () => {
    it('should filter by location demographics', async () => {
      const mockAthletes: any[] = []
      const { prisma } = require('@/lib/prisma')
      prisma.athlete.findMany.mockResolvedValue(mockAthletes)
      prisma.athlete.count.mockResolvedValue(0)

      const filters = {
        locationUsMin: 70,
        locationMexicoMin: 5
      }
      const validatedFilters = AthleteFiltersSchema.parse(filters)
      const result = await AthleteService.getAthletes(validatedFilters)

      expect(prisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { locationUs: { gte: 70 } },
              { locationMexico: { gte: 5 } }
            ])
          })
        })
      )
    })
  })

  describe('Complex Combined Filters', () => {
    it('should handle multiple advanced filters together', async () => {
      const mockAthletes: any[] = []
      const { prisma } = require('@/lib/prisma')
      prisma.athlete.findMany.mockResolvedValue(mockAthletes)
      prisma.athlete.count.mockResolvedValue(0)

      const filters = {
        hasBothPlatforms: true,
        audienceAge18_24Min: 40,
        instagramAvgLikesMin: 2000,
        locationUsMin: 80,
        categoryIds: [1, 2]
      }
      const validatedFilters = AthleteFiltersSchema.parse(filters)
      const result = await AthleteService.getAthletes(validatedFilters)

      expect(prisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              {
                AND: [
                  { instagramUsername: { not: null } },
                  { tiktokUsername: { not: null } }
                ]
              },
              { audienceAge18_24: { gte: 40 } },
              { instagramAvgLikes: { gte: 2000 } },
              { locationUs: { gte: 80 } },
              {
                categories: {
                  some: {
                    categoryId: { in: [1, 2] }
                  }
                }
              }
            ])
          })
        })
      )
    })
  })

  describe('Filter Options with Categories', () => {
    it('should return categories in filter options', async () => {
      const mockCategories = [
        { id: 1, name: 'Sports' },
        { id: 2, name: 'Lifestyle' },
        { id: 3, name: 'Fashion' }
      ]

      const { prisma } = require('@/lib/prisma')
      prisma.school.findMany.mockResolvedValue([])
      prisma.sport.findMany.mockResolvedValue([])
      prisma.athlete.findMany.mockResolvedValue([])
      prisma.category.findMany.mockResolvedValue(mockCategories)

      const result = await AthleteService.getFilterOptions()

      expect(result.categories).toEqual(mockCategories)
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
      })
    })
  })

  describe('AthleteFiltersSchema validation for advanced filters', () => {
    it('should validate advanced filter parameters', () => {
      const validAdvancedFilters = {
        createdAfter: '2024-01-01',
        createdBefore: '2024-12-31',
        categoryIds: [1, 2, 3],
        categoryConfidenceMin: 80,
        categoryConfidenceMax: 95,
        hasBothPlatforms: true,
        platformType: 'both',
        audienceAge18_24Min: 40,
        audienceAge25_34Min: 20,
        instagramAvgLikesMin: 1000,
        tiktokAvgLikesMin: 500,
        locationUsMin: 70,
        locationMexicoMin: 5
      }

      const result = AthleteFiltersSchema.parse(validAdvancedFilters)
      expect(result).toMatchObject(validAdvancedFilters)
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(20)
      expect(result.sortOrder).toBe('desc')
    })

    it('should handle optional advanced filter parameters', () => {
      const minimalFilters = {
        search: 'test'
      }

      const result = AthleteFiltersSchema.parse(minimalFilters)
      expect(result.search).toBe('test')
      expect(result.createdAfter).toBeUndefined()
      expect(result.categoryIds).toBeUndefined()
      expect(result.hasBothPlatforms).toBeUndefined()
    })
  })
})
