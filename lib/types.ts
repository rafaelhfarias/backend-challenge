import { z } from 'zod'

// Filter schemas
export const AthleteFiltersSchema = z.object({
  // Text search
  search: z.string().optional(),
  
  // Categorical filters
  gender: z.enum(['Male', 'Female']).optional(),
  grade: z.string().optional(),
  isAlumni: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sport: z.number().optional(),
  school: z.number().optional(),
  conference: z.string().optional(),
  
  // Performance ranges
  scoreMin: z.number().optional(),
  scoreMax: z.number().optional(),
  totalFollowersMin: z.number().optional(),
  totalFollowersMax: z.number().optional(),
  engagementRateMin: z.number().optional(),
  engagementRateMax: z.number().optional(),
  
  // Demographics
  ethnicityHispanicMin: z.number().optional(),
  ethnicityHispanicMax: z.number().optional(),
  ethnicityWhiteMin: z.number().optional(),
  ethnicityWhiteMax: z.number().optional(),
  ethnicityBlackMin: z.number().optional(),
  ethnicityBlackMax: z.number().optional(),
  ethnicityAsianMin: z.number().optional(),
  ethnicityAsianMax: z.number().optional(),
  audienceGenderMaleMin: z.number().optional(),
  audienceGenderMaleMax: z.number().optional(),
  audienceGenderFemaleMin: z.number().optional(),
  audienceGenderFemaleMax: z.number().optional(),
  
  // Platform filters
  instagramFollowersMin: z.number().optional(),
  instagramFollowersMax: z.number().optional(),
  tiktokFollowersMin: z.number().optional(),
  tiktokFollowersMax: z.number().optional(),
  
  // Pagination
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export type AthleteFilters = z.infer<typeof AthleteFiltersSchema>

// Highlighted text interface
export interface HighlightedText {
  text: string
  highlighted: boolean
}

// Response types
export interface AthleteResponse {
  id: number
  name: string
  email: string
  gender: string
  isAlumni: boolean
  grade: string
  isActive: boolean
  needsReview: boolean
  school: {
    id: number
    label: string
    name: string
    state: string
    conference: string
  }
  sports: Array<{
    id: number
    label: string
    name: string
  }>
  currentScore: {
    score: number
    totalFollowers: number
    engagementRate: number
    audienceQualityScore: number
    contentPerformanceScore: number
  }
  platforms: {
    instagram?: {
      username: string
      followers: number
      engagementRate: number
    }
    tiktok?: {
      username: string
      followers: number
      engagementRate: number
    }
  }
  demographics: {
    age: number
    ageRange: string
    ethnicity: {
      hispanic: number
      white: number
      black: number
      asian: number
      other: number
    }
    audienceGender: {
      male: number
      female: number
    }
  }
  categories: Array<{
    id: number
    name: string
    confidenceScore: number
  }>
  // Search highlighting (optional)
  highlightedName?: HighlightedText[]
  highlightedEmail?: HighlightedText[]
  highlightedSchool?: HighlightedText[]
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface AthletesResponse extends PaginatedResponse<AthleteResponse> {}

// Filter options for UI
export interface FilterOptions {
  schools: Array<{ id: number; label: string; conference: string }>
  sports: Array<{ id: number; label: string }>
  conferences: string[]
  grades: string[]
}
