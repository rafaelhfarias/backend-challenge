import { AthleteService } from '../../lib/athlete-service'
import { prisma } from '../../lib/prisma'

// Mock Prisma
jest.mock('../../lib/prisma', () => ({
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

// Mock Cache
jest.mock('../../lib/cache', () => ({
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

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('AthleteService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAthletes', () => {
    it('should return athletes with default pagination', async () => {
      const mockAthletes = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          gender: 'Male',
          isAlumni: false,
          grade: 'Senior',
          isActive: true,
          needsReview: false,
          score: 85,
          totalFollowers: 5000,
          engagementRate: 8.5,
          audienceQualityScore: 90,
          contentPerformanceScore: 80,
          age: 20,
          ageRange: '18-25',
          ethnicityHispanic: 15,
          ethnicityWhite: 60,
          ethnicityBlack: 20,
          ethnicityAsian: 5,
          ethnicityOther: 0,
          audienceGenderMale: 55,
          audienceGenderFemale: 45,
          instagramUsername: 'johndoe',
          instagramFollowers: 3000,
          instagramEngagementRate: 9.0,
          tiktokUsername: null,
          tiktokFollowers: null,
          tiktokEngagementRate: null,
          schoolId: 1,
          school: { 
            id: 1, 
            label: 'Test School', 
            name: 'Test School',
            state: 'CA',
            conference: 'Pac-12'
          },
          sports: [],
          categories: [],
        },
      ]

      mockPrisma.athlete.findMany.mockResolvedValue(mockAthletes)
      mockPrisma.athlete.count.mockResolvedValue(1)

      const result = await AthleteService.getAthletes({})

      expect(mockPrisma.athlete.findMany).toHaveBeenCalledWith({
        include: {
          school: true,
          sports: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
        orderBy: { score: 'desc' },
        skip: 0,
        take: 20,
        where: {},
      })
      expect(result.data).toHaveLength(1)
      expect(result.pagination.total).toBe(1)
    })

    it('should apply text search filter', async () => {
      mockPrisma.athlete.findMany.mockResolvedValue([])
      mockPrisma.athlete.count.mockResolvedValue(0)

      await AthleteService.getAthletes({ search: 'John' })

      expect(mockPrisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [
              {
                OR: [
                  { name: { contains: 'John', mode: 'insensitive' } },
                  { email: { contains: 'John', mode: 'insensitive' } },
                  { school: { name: { contains: 'John', mode: 'insensitive' } } },
                ],
              },
            ],
          },
        })
      )
    })

    it('should apply school filter', async () => {
      mockPrisma.athlete.findMany.mockResolvedValue([])
      mockPrisma.athlete.count.mockResolvedValue(0)

      await AthleteService.getAthletes({ school: 1 })

      expect(mockPrisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [{ schoolId: 1 }],
          },
        })
      )
    })

    it('should apply sport filter', async () => {
      mockPrisma.athlete.findMany.mockResolvedValue([])
      mockPrisma.athlete.count.mockResolvedValue(0)

      await AthleteService.getAthletes({ sport: 1 })

      expect(mockPrisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [{ sports: { some: { id: 1 } } }],
          },
        })
      )
    })

    it('should apply performance range filters', async () => {
      mockPrisma.athlete.findMany.mockResolvedValue([])
      mockPrisma.athlete.count.mockResolvedValue(0)

      await AthleteService.getAthletes({
        scoreMin: 50,
        scoreMax: 100,
        totalFollowersMin: 1000,
        totalFollowersMax: 10000,
      })

      expect(mockPrisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [
              { score: { gte: 50, lte: 100 } },
              { totalFollowers: { gte: 1000, lte: 10000 } },
            ],
          },
        })
      )
    })

    it('should apply demographic filters', async () => {
      mockPrisma.athlete.findMany.mockResolvedValue([])
      mockPrisma.athlete.count.mockResolvedValue(0)

      await AthleteService.getAthletes({
        gender: 'Male',
      })

      expect(mockPrisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [{ gender: 'Male' }],
          },
        })
      )
    })

    it('should handle custom sorting', async () => {
      mockPrisma.athlete.findMany.mockResolvedValue([])
      mockPrisma.athlete.count.mockResolvedValue(0)

      await AthleteService.getAthletes({ sortBy: 'totalFollowers', sortOrder: 'desc' })

      expect(mockPrisma.athlete.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { totalFollowers: 'desc' },
        })
      )
    })
  })

  describe('getFilterOptions', () => {
    it('should return filter options', async () => {
      const mockSchools = [
        { id: 1, label: 'School 1', conference: 'Conference A' },
        { id: 2, label: 'School 2', conference: 'Conference B' },
      ]
      const mockSports = [
        { id: 1, label: 'Football' },
        { id: 2, label: 'Basketball' },
      ]
      const mockConferences = [
        { conference: 'Conference A' },
        { conference: 'Conference B' },
      ]
      const mockGrades = [
        { grade: 'Freshman' },
        { grade: 'Sophomore' },
      ]

      mockPrisma.school.findMany
        .mockResolvedValueOnce(mockSchools)
        .mockResolvedValueOnce(mockConferences)
      mockPrisma.sport.findMany.mockResolvedValue(mockSports)
      mockPrisma.athlete.findMany.mockResolvedValue(mockGrades)

      const result = await AthleteService.getFilterOptions()

      expect(mockPrisma.school.findMany).toHaveBeenCalledWith({
        select: { id: true, label: true, conference: true },
        orderBy: { label: 'asc' },
      })
      expect(mockPrisma.sport.findMany).toHaveBeenCalledWith({
        select: { id: true, label: true },
        orderBy: { label: 'asc' },
      })

      expect(result).toEqual({
        schools: mockSchools,
        sports: mockSports,
        conferences: ['Conference A', 'Conference B'],
        grades: ['Freshman', 'Sophomore'],
      })
    })
  })

  describe('getAthleteStats', () => {
    it('should return athlete statistics', async () => {
      mockPrisma.athlete.count
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(80)
        .mockResolvedValueOnce(20)
      mockPrisma.athlete.aggregate
        .mockResolvedValueOnce({ _avg: { score: 75.5 } })
        .mockResolvedValueOnce({ _avg: { totalFollowers: 5000 } })
        .mockResolvedValueOnce({ _avg: { engagementRate: 8.2 } })

      const result = await AthleteService.getAthleteStats()

      expect(mockPrisma.athlete.count).toHaveBeenCalledTimes(3)
      expect(mockPrisma.athlete.aggregate).toHaveBeenCalledTimes(3)
      expect(result).toEqual({
        totalAthletes: 100,
        activeAthletes: 80,
        alumniAthletes: 20,
        avgScore: 75.5,
        avgFollowers: 5000,
        avgEngagement: 8.2,
      })
    })
  })
})
