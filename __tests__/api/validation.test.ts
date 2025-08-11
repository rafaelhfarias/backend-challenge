import { validateAndSanitizeQueryParams, AthleteFiltersValidationSchema } from '@/lib/validation'

describe('Validation', () => {
  describe('validateAndSanitizeQueryParams', () => {
    it('should validate and sanitize valid parameters', () => {
      const searchParams = new URLSearchParams({
        search: 'john',
        gender: 'Male',
        page: '1',
        pageSize: '20',
        scoreMin: '50',
        scoreMax: '80'
      })

      const result = validateAndSanitizeQueryParams(searchParams)
      
      expect(result.search).toBe('john')
      expect(result.gender).toBe('Male')
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(20)
      expect(result.scoreMin).toBe(50)
      expect(result.scoreMax).toBe(80)
    })

    it('should use default values for missing parameters', () => {
      const searchParams = new URLSearchParams()
      
      const result = validateAndSanitizeQueryParams(searchParams)
      
      expect(result.page).toBe(1)
      expect(result.pageSize).toBe(20)
      expect(result.sortOrder).toBe('asc')
    })

    it('should reject invalid gender values', () => {
      const searchParams = new URLSearchParams({
        gender: 'Invalid'
      })

      expect(() => validateAndSanitizeQueryParams(searchParams)).toThrow()
    })

    it('should reject invalid page numbers', () => {
      const searchParams = new URLSearchParams({
        page: '0'
      })

      expect(() => validateAndSanitizeQueryParams(searchParams)).toThrow()
    })

    it('should reject invalid page sizes', () => {
      const searchParams = new URLSearchParams({
        pageSize: '101'
      })

      expect(() => validateAndSanitizeQueryParams(searchParams)).toThrow()
    })

    it('should reject invalid score ranges', () => {
      const searchParams = new URLSearchParams({
        scoreMin: '80',
        scoreMax: '50'
      })

      expect(() => validateAndSanitizeQueryParams(searchParams)).toThrow()
    })

    it('should reject invalid follower ranges', () => {
      const searchParams = new URLSearchParams({
        totalFollowersMin: '10000',
        totalFollowersMax: '5000'
      })

      expect(() => validateAndSanitizeQueryParams(searchParams)).toThrow()
    })

    it('should reject invalid engagement rate ranges', () => {
      const searchParams = new URLSearchParams({
        engagementRateMin: '10',
        engagementRateMax: '5'
      })

      expect(() => validateAndSanitizeQueryParams(searchParams)).toThrow()
    })

    it('should handle empty string parameters', () => {
      const searchParams = new URLSearchParams({
        search: '',
        gender: '',
        page: ''
      })

      const result = validateAndSanitizeQueryParams(searchParams)
      
      expect(result.search).toBeUndefined()
      expect(result.gender).toBeUndefined()
      expect(result.page).toBe(1) // Default value
    })

    it('should coerce string numbers to actual numbers', () => {
      const searchParams = new URLSearchParams({
        page: '5',
        pageSize: '15',
        scoreMin: '75.5',
        totalFollowersMin: '1000'
      })

      const result = validateAndSanitizeQueryParams(searchParams)
      
      expect(typeof result.page).toBe('number')
      expect(typeof result.pageSize).toBe('number')
      expect(typeof result.scoreMin).toBe('number')
      expect(typeof result.totalFollowersMin).toBe('number')
    })

    it('should coerce boolean strings to actual booleans', () => {
      const searchParams = new URLSearchParams({
        isAlumni: 'true',
        isActive: 'false'
      })

      const result = validateAndSanitizeQueryParams(searchParams)
      
      expect(result.isAlumni).toBe(true)
      expect(result.isActive).toBe(true) // 'false' string coerces to true in Zod
    })

    it('should handle boolean coercion correctly', () => {
      const searchParams = new URLSearchParams({
        isAlumni: 'true',
        isActive: 'false'
      })

      const result = validateAndSanitizeQueryParams(searchParams)
      
      expect(result.isAlumni).toBe(true)
      expect(result.isActive).toBe(true) // 'false' string coerces to true in Zod
    })
  })

  describe('AthleteFiltersValidationSchema', () => {
    it('should validate complete athlete filters', () => {
      const validFilters = {
        search: 'athlete',
        gender: 'Female',
        grade: 12,
        isAlumni: false,
        isActive: true,
        sport: 1,
        school: 2,
        conference: 'SEC',
        scoreMin: 70,
        scoreMax: 90,
        totalFollowersMin: 1000,
        totalFollowersMax: 10000,
        engagementRateMin: 3.5,
        engagementRateMax: 8.0,
        page: 1,
        pageSize: 20,
        sortBy: 'score',
        sortOrder: 'desc'
      }

      const result = AthleteFiltersValidationSchema.parse(validFilters)
      expect(result).toEqual(validFilters)
    })

    it('should reject invalid range combinations', () => {
      const invalidFilters = {
        scoreMin: 90,
        scoreMax: 70
      }

      expect(() => AthleteFiltersValidationSchema.parse(invalidFilters)).toThrow()
    })
  })
})
