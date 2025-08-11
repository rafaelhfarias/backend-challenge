import { z } from 'zod'

// Enhanced validation schemas with better error messages and sanitization
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
})

export const SearchSchema = z.object({
  search: z.string().trim().min(1).max(100).optional()
})

export const CategoricalFiltersSchema = z.object({
  gender: z.enum(['Male', 'Female']).optional(),
  grade: z.coerce.number().int().min(1).max(12).optional(),
  isAlumni: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
  sport: z.coerce.number().int().positive().optional(),
  school: z.coerce.number().int().positive().optional(),
  conference: z.string().trim().max(50).optional()
})

export const PerformanceRangesSchema = z.object({
  scoreMin: z.coerce.number().min(0).max(100).optional(),
  scoreMax: z.coerce.number().min(0).max(100).optional(),
  totalFollowersMin: z.coerce.number().int().min(0).max(10000000).optional(),
  totalFollowersMax: z.coerce.number().int().min(0).max(10000000).optional(),
  engagementRateMin: z.coerce.number().min(0).max(100).optional(),
  engagementRateMax: z.coerce.number().min(0).max(100).optional()
})

export const DemographicsSchema = z.object({
  ethnicityHispanicMin: z.coerce.number().min(0).max(100).optional(),
  ethnicityHispanicMax: z.coerce.number().min(0).max(100).optional(),
  ethnicityWhiteMin: z.coerce.number().min(0).max(100).optional(),
  ethnicityWhiteMax: z.coerce.number().min(0).max(100).optional(),
  ethnicityBlackMin: z.coerce.number().min(0).max(100).optional(),
  ethnicityBlackMax: z.coerce.number().min(0).max(100).optional(),
  ethnicityAsianMin: z.coerce.number().min(0).max(100).optional(),
  ethnicityAsianMax: z.coerce.number().min(0).max(100).optional(),
  audienceGenderMaleMin: z.coerce.number().min(0).max(100).optional(),
  audienceGenderMaleMax: z.coerce.number().min(0).max(100).optional(),
  audienceGenderFemaleMin: z.coerce.number().min(0).max(100).optional(),
  audienceGenderFemaleMax: z.coerce.number().min(0).max(100).optional()
})

export const PlatformFiltersSchema = z.object({
  instagramFollowersMin: z.coerce.number().int().min(0).max(10000000).optional(),
  instagramFollowersMax: z.coerce.number().int().min(0).max(10000000).optional(),
  tiktokFollowersMin: z.coerce.number().int().min(0).max(10000000).optional(),
  tiktokFollowersMax: z.coerce.number().int().min(0).max(10000000).optional()
})

// Advanced Features Schemas
export const DateRangesSchema = z.object({
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
  updatedAfter: z.string().optional(),
  updatedBefore: z.string().optional()
})

export const ContentCategoriesSchema = z.object({
  categoryIds: z.string().optional(), // Will be parsed as comma-separated string
  categoryConfidenceMin: z.coerce.number().min(0).max(100).optional(),
  categoryConfidenceMax: z.coerce.number().min(0).max(100).optional()
})

export const MultiPlatformSchema = z.object({
  hasBothPlatforms: z.coerce.boolean().optional(),
  platformType: z.string().optional()
})

export const ComplexDemographicsSchema = z.object({
  audienceAge13_17Min: z.coerce.number().min(0).max(100).optional(),
  audienceAge13_17Max: z.coerce.number().min(0).max(100).optional(),
  audienceAge18_24Min: z.coerce.number().min(0).max(100).optional(),
  audienceAge18_24Max: z.coerce.number().min(0).max(100).optional(),
  audienceAge25_34Min: z.coerce.number().min(0).max(100).optional(),
  audienceAge25_34Max: z.coerce.number().min(0).max(100).optional(),
  audienceAge35_44Min: z.coerce.number().min(0).max(100).optional(),
  audienceAge35_44Max: z.coerce.number().min(0).max(100).optional(),
  audienceAge45PlusMin: z.coerce.number().min(0).max(100).optional(),
  audienceAge45PlusMax: z.coerce.number().min(0).max(100).optional()
})

export const PostPerformanceSchema = z.object({
  instagramAvgLikesMin: z.coerce.number().int().min(0).optional(),
  instagramAvgLikesMax: z.coerce.number().int().min(0).optional(),
  instagramAvgCommentsMin: z.coerce.number().int().min(0).optional(),
  instagramAvgCommentsMax: z.coerce.number().int().min(0).optional(),
  tiktokAvgLikesMin: z.coerce.number().int().min(0).optional(),
  tiktokAvgLikesMax: z.coerce.number().int().min(0).optional(),
  tiktokAvgCommentsMin: z.coerce.number().int().min(0).optional(),
  tiktokAvgCommentsMax: z.coerce.number().int().min(0).optional()
})

export const LocationSchema = z.object({
  locationUsMin: z.coerce.number().min(0).max(100).optional(),
  locationUsMax: z.coerce.number().min(0).max(100).optional(),
  locationMexicoMin: z.coerce.number().min(0).max(100).optional(),
  locationMexicoMax: z.coerce.number().min(0).max(100).optional(),
  locationCanadaMin: z.coerce.number().min(0).max(100).optional(),
  locationCanadaMax: z.coerce.number().min(0).max(100).optional()
})

// Combined schema for all athlete filters
export const AthleteFiltersValidationSchema = z.object({
  ...PaginationSchema.shape,
  ...SearchSchema.shape,
  ...CategoricalFiltersSchema.shape,
  ...PerformanceRangesSchema.shape,
  ...DemographicsSchema.shape,
  ...PlatformFiltersSchema.shape,
  ...DateRangesSchema.shape,
  ...ContentCategoriesSchema.shape,
  ...MultiPlatformSchema.shape,
  ...ComplexDemographicsSchema.shape,
  ...PostPerformanceSchema.shape,
  ...LocationSchema.shape
}).refine((data) => {
  // Validate that min values are not greater than max values
  if (data.scoreMin !== undefined && data.scoreMax !== undefined && data.scoreMin > data.scoreMax) {
    return false
  }
  if (data.totalFollowersMin !== undefined && data.totalFollowersMax !== undefined && data.totalFollowersMin > data.totalFollowersMax) {
    return false
  }
  if (data.engagementRateMin !== undefined && data.engagementRateMax !== undefined && data.engagementRateMin > data.engagementRateMax) {
    return false
  }
  return true
}, {
  message: "Minimum values cannot be greater than maximum values",
  path: ["rangeValidation"]
})

// Validation error formatter
export function formatValidationError(error: z.ZodError): { message: string; details: Record<string, string[]> } {
  const details: Record<string, string[]> = {}
  
  error.errors.forEach((err) => {
    const field = err.path.join('.')
    if (!details[field]) {
      details[field] = []
    }
    details[field].push(err.message)
  })

  return {
    message: 'Validation failed',
    details
  }
}

// Sanitize and validate query parameters
export function validateAndSanitizeQueryParams(searchParams: URLSearchParams) {
  const queryParams: Record<string, any> = {}
  
  // Extract all parameters
  for (const [key, value] of searchParams.entries()) {
    if (value !== null && value !== undefined && value !== '') {
      queryParams[key] = value
    }
  }

  try {
    const validatedParams = AthleteFiltersValidationSchema.parse(queryParams)
    
    // Process categoryIds - convert string to array
    if (validatedParams.categoryIds) {
      validatedParams.categoryIds = validatedParams.categoryIds.split(',').map(id => parseInt(id))
    }
    
    return validatedParams
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(formatValidationError(error)))
    }
    throw error
  }
}
