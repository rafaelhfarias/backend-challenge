'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { AthleteFilters as AthleteFiltersType, FilterOptions } from '@/lib/types'

interface AthleteFiltersProps {
  filters?: Partial<AthleteFiltersType>
  filterOptions: FilterOptions | null
  onFiltersChange: (filters: Partial<AthleteFiltersType>) => void
}

export function AthleteFilters({ filters = {}, filterOptions, onFiltersChange }: AthleteFiltersProps) {
  const [localFilters, setLocalFilters] = useState<Partial<AthleteFiltersType>>(filters)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localFilters.search !== filters.search) {
        onFiltersChange(localFilters)
      }
    }, 300) // 300ms delay

    return () => clearTimeout(timeoutId)
  }, [localFilters.search, filters.search, onFiltersChange])

  const handleInputChange = (key: keyof AthleteFiltersType, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      page: 1,
      pageSize: 20,
      sortBy: 'score',
      sortOrder: 'desc' as const,
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  if (!filterOptions) {
    return <div className="bg-white p-4 rounded-lg shadow">Loading filters...</div>
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
        </Button>
      </div>
      
      <div className="space-y-4">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Text Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <Input
              placeholder="Name, email, or school..."
              value={localFilters.search || ''}
              onChange={(e) => handleInputChange('search', e.target.value)}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <Select
              value={localFilters.gender || ''}
              onChange={(e) => handleInputChange('gender', e.target.value || undefined)}
            >
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Select>
          </div>

          {/* Grade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade
            </label>
            <Select
              value={localFilters.grade || ''}
              onChange={(e) => handleInputChange('grade', e.target.value || undefined)}
            >
              <option value="">All</option>
              {filterOptions.grades.map((grade) => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </Select>
          </div>

          {/* School */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School
            </label>
            <Select
              value={localFilters.school || ''}
              onChange={(e) => handleInputChange('school', e.target.value ? parseInt(e.target.value) : undefined)}
            >
              <option value="">All Schools</option>
              {filterOptions.schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.label} ({school.conference})
                </option>
              ))}
            </Select>
          </div>

          {/* Conference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conference
            </label>
            <Select
              value={localFilters.conference || ''}
              onChange={(e) => handleInputChange('conference', e.target.value || undefined)}
            >
              <option value="">All Conferences</option>
              {filterOptions.conferences.map((conference) => (
                <option key={conference} value={conference}>{conference}</option>
              ))}
            </Select>
          </div>

          {/* Sport */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sport
            </label>
            <Select
              value={localFilters.sport || ''}
              onChange={(e) => handleInputChange('sport', e.target.value ? parseInt(e.target.value) : undefined)}
            >
              <option value="">All Sports</option>
              {filterOptions.sports.map((sport) => (
                <option key={sport.id} value={sport.id}>{sport.label}</option>
              ))}
            </Select>
          </div>

          {/* Platform Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform Type
            </label>
            <Select
              value={localFilters.platformType || ''}
              onChange={(e) => handleInputChange('platformType', e.target.value || undefined)}
            >
              <option value="">All Platforms</option>
              <option value="instagram">Instagram Only</option>
              <option value="tiktok">TikTok Only</option>
              <option value="both">Both Platforms</option>
            </Select>
          </div>
        </div>

        {/* Status Filters */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={localFilters.isActive ?? true}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="isActive" className="text-sm">Active</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAlumni"
                checked={localFilters.isAlumni ?? false}
                onChange={(e) => handleInputChange('isAlumni', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="isAlumni" className="text-sm">Alumni</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasBothPlatforms"
                checked={localFilters.hasBothPlatforms ?? false}
                onChange={(e) => handleInputChange('hasBothPlatforms', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="hasBothPlatforms" className="text-sm">Both Platforms</label>
            </div>
          </div>
        </div>

        {/* Performance Ranges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Score Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Min"
                type="number"
                value={localFilters.scoreMin || ''}
                onChange={(e) => handleInputChange('scoreMin', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
              <Input
                placeholder="Max"
                type="number"
                value={localFilters.scoreMax || ''}
                onChange={(e) => handleInputChange('scoreMax', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Followers Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Min"
                type="number"
                value={localFilters.totalFollowersMin || ''}
                onChange={(e) => handleInputChange('totalFollowersMin', e.target.value ? parseInt(e.target.value) : undefined)}
              />
              <Input
                placeholder="Max"
                type="number"
                value={localFilters.totalFollowersMax || ''}
                onChange={(e) => handleInputChange('totalFollowersMax', e.target.value ? parseInt(e.target.value) : undefined)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Engagement Rate Range (%)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Min"
                type="number"
                step="0.1"
                value={localFilters.engagementRateMin || ''}
                onChange={(e) => handleInputChange('engagementRateMin', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
              <Input
                placeholder="Max"
                type="number"
                step="0.1"
                value={localFilters.engagementRateMax || ''}
                onChange={(e) => handleInputChange('engagementRateMax', e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900">Advanced Filters</h3>
            
            {/* Date Ranges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={localFilters.createdAfter || ''}
                    onChange={(e) => handleInputChange('createdAfter', e.target.value || undefined)}
                  />
                  <Input
                    type="date"
                    value={localFilters.createdBefore || ''}
                    onChange={(e) => handleInputChange('createdBefore', e.target.value || undefined)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Updated Date Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={localFilters.updatedAfter || ''}
                    onChange={(e) => handleInputChange('updatedAfter', e.target.value || undefined)}
                  />
                  <Input
                    type="date"
                    value={localFilters.updatedBefore || ''}
                    onChange={(e) => handleInputChange('updatedBefore', e.target.value || undefined)}
                  />
                </div>
              </div>
            </div>

            {/* Content Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Categories
                 </label>
                 <select
                   multiple
                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   value={localFilters.categoryIds?.map(String) || []}
                   onChange={(e) => {
                     const values = Array.from(e.target.selectedOptions, option => parseInt(option.value))
                     handleInputChange('categoryIds', values)
                   }}
                 >
                   {filterOptions.categories.map((category) => (
                     <option key={category.id} value={category.id}>{category.name}</option>
                   ))}
                 </select>
               </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Confidence Range (%)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Min"
                    type="number"
                    step="0.1"
                    value={localFilters.categoryConfidenceMin || ''}
                    onChange={(e) => handleInputChange('categoryConfidenceMin', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    step="0.1"
                    value={localFilters.categoryConfidenceMax || ''}
                    onChange={(e) => handleInputChange('categoryConfidenceMax', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </div>

            {/* Complex Demographics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Audience Age Distribution (%)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">13-17</label>
                  <div className="grid grid-cols-2 gap-1">
                    <Input
                      placeholder="Min"
                      type="number"
                      step="0.1"
                      value={localFilters.audienceAge13_17Min || ''}
                      onChange={(e) => handleInputChange('audienceAge13_17Min', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      step="0.1"
                      value={localFilters.audienceAge13_17Max || ''}
                      onChange={(e) => handleInputChange('audienceAge13_17Max', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">18-24</label>
                  <div className="grid grid-cols-2 gap-1">
                    <Input
                      placeholder="Min"
                      type="number"
                      step="0.1"
                      value={localFilters.audienceAge18_24Min || ''}
                      onChange={(e) => handleInputChange('audienceAge18_24Min', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      step="0.1"
                      value={localFilters.audienceAge18_24Max || ''}
                      onChange={(e) => handleInputChange('audienceAge18_24Max', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">25-34</label>
                  <div className="grid grid-cols-2 gap-1">
                    <Input
                      placeholder="Min"
                      type="number"
                      step="0.1"
                      value={localFilters.audienceAge25_34Min || ''}
                      onChange={(e) => handleInputChange('audienceAge25_34Min', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      step="0.1"
                      value={localFilters.audienceAge25_34Max || ''}
                      onChange={(e) => handleInputChange('audienceAge25_34Max', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">35-44</label>
                  <div className="grid grid-cols-2 gap-1">
                    <Input
                      placeholder="Min"
                      type="number"
                      step="0.1"
                      value={localFilters.audienceAge35_44Min || ''}
                      onChange={(e) => handleInputChange('audienceAge35_44Min', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      step="0.1"
                      value={localFilters.audienceAge35_44Max || ''}
                      onChange={(e) => handleInputChange('audienceAge35_44Max', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">45+</label>
                  <div className="grid grid-cols-2 gap-1">
                    <Input
                      placeholder="Min"
                      type="number"
                      step="0.1"
                      value={localFilters.audienceAge45PlusMin || ''}
                      onChange={(e) => handleInputChange('audienceAge45PlusMin', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      step="0.1"
                      value={localFilters.audienceAge45PlusMax || ''}
                      onChange={(e) => handleInputChange('audienceAge45PlusMax', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location Demographics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location Distribution (%)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">United States</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      step="0.1"
                      value={localFilters.locationUsMin || ''}
                      onChange={(e) => handleInputChange('locationUsMin', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      step="0.1"
                      value={localFilters.locationUsMax || ''}
                      onChange={(e) => handleInputChange('locationUsMax', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Mexico</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      step="0.1"
                      value={localFilters.locationMexicoMin || ''}
                      onChange={(e) => handleInputChange('locationMexicoMin', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      step="0.1"
                      value={localFilters.locationMexicoMax || ''}
                      onChange={(e) => handleInputChange('locationMexicoMax', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Canada</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      step="0.1"
                      value={localFilters.locationCanadaMin || ''}
                      onChange={(e) => handleInputChange('locationCanadaMin', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      step="0.1"
                      value={localFilters.locationCanadaMax || ''}
                      onChange={(e) => handleInputChange('locationCanadaMax', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Post Performance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Post Performance Metrics</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Instagram Avg Likes</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={localFilters.instagramAvgLikesMin || ''}
                      onChange={(e) => handleInputChange('instagramAvgLikesMin', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={localFilters.instagramAvgLikesMax || ''}
                      onChange={(e) => handleInputChange('instagramAvgLikesMax', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Instagram Avg Comments</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={localFilters.instagramAvgCommentsMin || ''}
                      onChange={(e) => handleInputChange('instagramAvgCommentsMin', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={localFilters.instagramAvgCommentsMax || ''}
                      onChange={(e) => handleInputChange('instagramAvgCommentsMax', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">TikTok Avg Likes</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={localFilters.tiktokAvgLikesMin || ''}
                      onChange={(e) => handleInputChange('tiktokAvgLikesMin', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={localFilters.tiktokAvgLikesMax || ''}
                      onChange={(e) => handleInputChange('tiktokAvgLikesMax', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">TikTok Avg Comments</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Min"
                      type="number"
                      value={localFilters.tiktokAvgCommentsMin || ''}
                      onChange={(e) => handleInputChange('tiktokAvgCommentsMin', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                    <Input
                      placeholder="Max"
                      type="number"
                      value={localFilters.tiktokAvgCommentsMax || ''}
                      onChange={(e) => handleInputChange('tiktokAvgCommentsMax', e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4">
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear
          </Button>
        </div>
      </div>
    </div>
  )
}
