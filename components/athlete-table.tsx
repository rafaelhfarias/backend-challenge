'use client'

import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { AthleteResponse, AthletesResponse, AthleteFilters } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

interface AthleteTableProps {
  athletes: AthletesResponse | null
  loading: boolean
  filters: AthleteFilters
  onPageChange: (page: number) => void
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void
}

const columnHelper = createColumnHelper<AthleteResponse>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => (
      <div>
        <div className="font-medium">{info.getValue()}</div>
        <div className="text-sm text-gray-500">{info.row.original.email}</div>
      </div>
    ),
  }),
  columnHelper.accessor('school', {
    header: 'School',
    cell: (info) => (
      <div>
        <div className="font-medium">{info.getValue().label}</div>
        <div className="text-sm text-gray-500">{info.getValue().conference}</div>
      </div>
    ),
  }),
  columnHelper.accessor('sports', {
    header: 'Sports',
    cell: (info) => (
      <div className="flex flex-wrap gap-1">
        {info.getValue().map((sport) => (
          <span
            key={sport.id}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
          >
            {sport.label}
          </span>
        ))}
      </div>
    ),
  }),
  columnHelper.accessor('currentScore.score', {
    header: 'Score',
    cell: (info) => (
      <div className="text-center">
        <div className="font-bold text-lg">{info.getValue().toFixed(1)}</div>
      </div>
    ),
  }),
  columnHelper.accessor('currentScore.totalFollowers', {
    header: 'Followers',
    cell: (info) => {
      const followers = info.getValue()
      return (
        <div className="text-center">
          <div className="font-medium">
            {followers > 1000 ? `${(followers / 1000).toFixed(1)}K` : followers}
          </div>
        </div>
      )
    },
  }),
  columnHelper.accessor('currentScore.engagementRate', {
    header: 'Engagement',
    cell: (info) => (
      <div className="text-center">
        <div className="font-medium">{info.getValue().toFixed(2)}%</div>
      </div>
    ),
  }),
  columnHelper.accessor('demographics.ethnicity.hispanic', {
    header: 'Hispanic %',
    cell: (info) => (
      <div className="text-center">
        <div className="font-medium">{info.getValue().toFixed(1)}%</div>
      </div>
    ),
  }),
  columnHelper.accessor('platforms', {
    header: 'Platforms',
    cell: (info) => {
      const platforms = info.getValue()
      return (
        <div className="space-y-1">
          {platforms.instagram && (
            <div className="text-sm">
              <span className="font-medium">IG:</span> {platforms.instagram.followers > 1000 
                ? `${(platforms.instagram.followers / 1000).toFixed(1)}K` 
                : platforms.instagram.followers
              }
            </div>
          )}
          {platforms.tiktok && (
            <div className="text-sm">
              <span className="font-medium">TT:</span> {platforms.tiktok.followers > 1000 
                ? `${(platforms.tiktok.followers / 1000).toFixed(1)}K` 
                : platforms.tiktok.followers
              }
            </div>
          )}
        </div>
      )
    },
  }),
]

export function AthleteTable({ athletes, loading, filters, onPageChange, onSortChange }: AthleteTableProps) {
  const [sorting, setSorting] = useState<any[]>([])

  const table = useReactTable({
    data: athletes?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  })

  const handleSort = (columnId: string) => {
    const currentSort = sorting.find(s => s.id === columnId)
    const newSortOrder = currentSort?.desc ? 'asc' : 'desc'
    onSortChange(columnId, newSortOrder)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading athletes...</p>
        </div>
      </div>
    )
  }

  if (!athletes) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-8 text-center">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => header.column.getCanSort() && handleSort(header.id)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                      {header.column.getCanSort() && (
                        <div className="flex flex-col">
                          <ChevronUp className="h-3 w-3" />
                          <ChevronDown className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {athletes.pagination && (
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((athletes.pagination.page - 1) * athletes.pagination.pageSize) + 1} to{' '}
              {Math.min(athletes.pagination.page * athletes.pagination.pageSize, athletes.pagination.total)} of{' '}
              {athletes.pagination.total} results
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(athletes.pagination.page - 1)}
                disabled={!athletes.pagination.hasPrev}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <span className="text-sm text-gray-700">
                Page {athletes.pagination.page} of {athletes.pagination.totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(athletes.pagination.page + 1)}
                disabled={!athletes.pagination.hasNext}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
