'use client'

import { useState, useEffect } from 'react'
import { AthleteTable } from '@/components/athlete-table'
import { AthleteFilters } from '@/components/athlete-filters'
import { AthleteStats } from '@/components/athlete-stats'
import { AthleteFilters as AthleteFiltersType, AthletesResponse, FilterOptions } from '@/lib/types'

export default function Home() {
  const [athletes, setAthletes] = useState<AthletesResponse | null>(null)
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<AthleteFiltersType>({
    page: 1,
    pageSize: 20,
    sortBy: 'score',
    sortOrder: 'desc',
  })

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/filters')
        const data = await response.json()
        setFilterOptions(data)
      } catch (error) {
        console.error('Error fetching filter options:', error)
      }
    }

    fetchFilterOptions()
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  useEffect(() => {
    const fetchAthletes = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value))
          }
        })

        const response = await fetch(`/api/athletes?${params.toString()}`)
        const data = await response.json()
        setAthletes(data)
      } catch (error) {
        console.error('Error fetching athletes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAthletes()
  }, [filters])

  const handleFiltersChange = (newFilters: Partial<AthleteFiltersType>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1,
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Athlete Discovery System
          </h1>
          <p className="text-gray-600">
            Advanced filtering and discovery platform for college athletes
          </p>
        </header>

        {stats && <AthleteStats stats={stats} />}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <AthleteFilters
              filters={filters}
              filterOptions={filterOptions}
              onFiltersChange={handleFiltersChange}
            />
          </div>
          
          <div className="lg:col-span-3">
            <AthleteTable
              athletes={athletes}
              loading={loading}
              filters={filters}
              onPageChange={handlePageChange}
              onSortChange={handleSortChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
