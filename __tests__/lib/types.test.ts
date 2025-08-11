import { AthleteFiltersSchema } from '../../lib/types'
import { z } from 'zod'

describe('AthleteFiltersSchema', () => {
  describe('valid inputs', () => {
    it('should validate empty object', () => {
      const result = AthleteFiltersSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('should validate search parameter', () => {
      const result = AthleteFiltersSchema.safeParse({ search: 'John Doe' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.search).toBe('John Doe')
      }
    })

    it('should validate school parameter', () => {
      const result = AthleteFiltersSchema.safeParse({ school: 1 })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.school).toBe(1)
      }
    })

    it('should validate sport parameter', () => {
      const result = AthleteFiltersSchema.safeParse({ sport: 1 })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.sport).toBe(1)
      }
    })

    it('should validate gender parameter', () => {
      const result = AthleteFiltersSchema.safeParse({ gender: 'Male' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.gender).toBe('Male')
      }
    })

    it('should validate numeric parameters', () => {
      const result = AthleteFiltersSchema.safeParse({
        scoreMin: 50,
        scoreMax: 100,
        totalFollowersMin: 1000,
        totalFollowersMax: 10000,
        engagementRateMin: 5,
        engagementRateMax: 10,
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.scoreMin).toBe(50)
        expect(result.data.scoreMax).toBe(100)
        expect(result.data.totalFollowersMin).toBe(1000)
        expect(result.data.totalFollowersMax).toBe(10000)
        expect(result.data.engagementRateMin).toBe(5)
        expect(result.data.engagementRateMax).toBe(10)
      }
    })

    it('should validate boolean parameters', () => {
      const result = AthleteFiltersSchema.safeParse({
        isActive: true,
        isAlumni: false,
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.isActive).toBe(true)
        expect(result.data.isAlumni).toBe(false)
      }
    })

    it('should validate string parameters', () => {
      const result = AthleteFiltersSchema.safeParse({
        grade: 'Senior',
        conference: 'Pac-12',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.grade).toBe('Senior')
        expect(result.data.conference).toBe('Pac-12')
      }
    })

    it('should validate pagination parameters', () => {
      const result = AthleteFiltersSchema.safeParse({
        page: 2,
        pageSize: 20,
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(2)
        expect(result.data.pageSize).toBe(20)
      }
    })

    it('should validate sorting parameters', () => {
      const result = AthleteFiltersSchema.safeParse({
        sortBy: 'score',
        sortOrder: 'desc',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.sortBy).toBe('score')
        expect(result.data.sortOrder).toBe('desc')
      }
    })

    it('should validate all parameters together', () => {
      const result = AthleteFiltersSchema.safeParse({
        search: 'John',
        school: 1,
        sport: 1,
        gender: 'Male',
        grade: 'Senior',
        isActive: true,
        isAlumni: false,
        scoreMin: 50,
        scoreMax: 100,
        totalFollowersMin: 1000,
        totalFollowersMax: 10000,
        engagementRateMin: 5,
        engagementRateMax: 10,
        ethnicityHispanicMin: 10,
        ethnicityHispanicMax: 50,
        audienceGenderMaleMin: 40,
        audienceGenderMaleMax: 80,
        instagramFollowersMin: 1000,
        instagramFollowersMax: 10000,
        tiktokFollowersMin: 500,
        tiktokFollowersMax: 5000,
        page: 1,
        pageSize: 10,
        sortBy: 'score',
        sortOrder: 'asc',
      })
      expect(result.success).toBe(true)
    })
  })

  describe('invalid inputs', () => {
    it('should reject invalid page number', () => {
      const result = AthleteFiltersSchema.safeParse({ page: -1 })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('greater than or equal to 1')
      }
    })

    it('should reject invalid pageSize', () => {
      const result = AthleteFiltersSchema.safeParse({ pageSize: 0 })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('greater than or equal to 1')
      }
    })

    it('should reject pageSize greater than 100', () => {
      const result = AthleteFiltersSchema.safeParse({ pageSize: 101 })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('less than or equal to 100')
      }
    })

    it('should reject invalid gender', () => {
      const result = AthleteFiltersSchema.safeParse({ gender: 'invalid' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Expected \'Male\' | \'Female\'')
      }
    })

    it('should reject invalid sortOrder', () => {
      const result = AthleteFiltersSchema.safeParse({ sortOrder: 'invalid' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Expected \'asc\' | \'desc\'')
      }
    })

    it('should reject negative numeric values', () => {
      const result = AthleteFiltersSchema.safeParse({
        scoreMin: -10,
        scoreMax: -5,
      })
      expect(result.success).toBe(true)
    })

    it('should reject non-numeric string values for numeric fields', () => {
      const result = AthleteFiltersSchema.safeParse({
        scoreMin: 'invalid',
        scoreMax: 'invalid',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('default values', () => {
    it('should set default values for pagination', () => {
      const result = AthleteFiltersSchema.safeParse({})
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(1)
        expect(result.data.pageSize).toBe(20)
        expect(result.data.sortOrder).toBe('desc')
      }
    })
  })
})
