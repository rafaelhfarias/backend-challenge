'use client'

import { useState } from 'react'
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
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      <div className="space-y-4">
        {/* Text Search */}
        <div>
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

        {/* Status Filters */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Status</label>
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
        </div>

        {/* Performance Ranges */}
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

        {/* Demographics */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hispanic Audience (%)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Min"
              type="number"
              step="0.1"
              value={localFilters.ethnicityHispanicMin || ''}
              onChange={(e) => handleInputChange('ethnicityHispanicMin', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
            <Input
              placeholder="Max"
              type="number"
              step="0.1"
              value={localFilters.ethnicityHispanicMax || ''}
              onChange={(e) => handleInputChange('ethnicityHispanicMax', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>
        </div>

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
