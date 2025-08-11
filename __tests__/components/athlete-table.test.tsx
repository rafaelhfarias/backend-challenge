import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AthleteTable } from '../../components/athlete-table'
import { AthletesResponse, AthleteFilters } from '../../lib/types'

describe('AthleteTable', () => {
  const mockAthletes: AthletesResponse = {
    data: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'Male',
        isAlumni: false,
        grade: 'Senior',
        isActive: true,
        needsReview: false,
        school: {
          id: 1,
          label: 'Test School',
          name: 'Test School',
          state: 'CA',
          conference: 'Pac-12',
        },
        sports: [
          { id: 1, label: 'Football', name: 'Football' },
        ],
        currentScore: {
          score: 85,
          totalFollowers: 5000,
          engagementRate: 8.5,
          audienceQualityScore: 75,
          contentPerformanceScore: 80,
        },
        platforms: {
          instagram: {
            username: 'johndoe',
            followers: 5000,
            engagementRate: 8.5,
          },
        },
        demographics: {
          age: 20,
          ageRange: '18-25',
          ethnicity: {
            hispanic: 15.5,
            white: 60.2,
            black: 12.3,
            asian: 8.0,
            other: 4.0,
          },
          audienceGender: {
            male: 65.0,
            female: 35.0,
          },
        },
        categories: [
          { id: 1, name: 'Influencer', confidenceScore: 0.9 },
        ],
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        gender: 'Female',
        isAlumni: true,
        grade: 'Alumni',
        isActive: false,
        needsReview: true,
        school: {
          id: 2,
          label: 'Another School',
          name: 'Another School',
          state: 'TX',
          conference: 'Big 12',
        },
        sports: [
          { id: 2, label: 'Basketball', name: 'Basketball' },
        ],
        currentScore: {
          score: 92,
          totalFollowers: 8000,
          engagementRate: 12.3,
          audienceQualityScore: 85,
          contentPerformanceScore: 90,
        },
        platforms: {
          tiktok: {
            username: 'janesmith',
            followers: 8000,
            engagementRate: 12.3,
          },
        },
        demographics: {
          age: 22,
          ageRange: '18-25',
          ethnicity: {
            hispanic: 8.2,
            white: 70.1,
            black: 15.4,
            asian: 4.2,
            other: 2.1,
          },
          audienceGender: {
            male: 45.0,
            female: 55.0,
          },
        },
        categories: [
          { id: 2, name: 'Athlete', confidenceScore: 0.95 },
        ],
      },
    ],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 2,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  }

  const mockOnPageChange = jest.fn()
  const mockOnSortChange = jest.fn()
  const mockFilters: AthleteFilters = {
    page: 1,
    pageSize: 10,
    sortOrder: 'desc',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render table headers correctly', () => {
    render(
      <AthleteTable
        athletes={mockAthletes}
        loading={false}
        filters={mockFilters}
        onPageChange={mockOnPageChange}
        onSortChange={mockOnSortChange}
      />
    )

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('School')).toBeInTheDocument()
    expect(screen.getByText('Sports')).toBeInTheDocument()
    expect(screen.getByText('Score')).toBeInTheDocument()
    expect(screen.getByText('Followers')).toBeInTheDocument()
    expect(screen.getByText('Engagement')).toBeInTheDocument()
    expect(screen.getByText('Hispanic %')).toBeInTheDocument()
    expect(screen.getByText('Platforms')).toBeInTheDocument()
  })

  it('should render athlete data correctly', () => {
    render(
      <AthleteTable
        athletes={mockAthletes}
        loading={false}
        filters={mockFilters}
        onPageChange={mockOnPageChange}
        onSortChange={mockOnSortChange}
      />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('Test School')).toBeInTheDocument()
    expect(screen.getByText('Another School')).toBeInTheDocument()
    expect(screen.getByText('Pac-12')).toBeInTheDocument()
    expect(screen.getByText('Big 12')).toBeInTheDocument()
    expect(screen.getByText('Football')).toBeInTheDocument()
    expect(screen.getByText('Basketball')).toBeInTheDocument()
    expect(screen.getByText('85.0')).toBeInTheDocument()
    expect(screen.getByText('92.0')).toBeInTheDocument()
    expect(screen.getAllByText('5.0K')).toHaveLength(2)
    expect(screen.getAllByText('8.0K')).toHaveLength(2)
    expect(screen.getByText('8.50%')).toBeInTheDocument()
    expect(screen.getByText('12.30%')).toBeInTheDocument()
    expect(screen.getByText('15.5%')).toBeInTheDocument()
    expect(screen.getByText('8.2%')).toBeInTheDocument()
  })

  it('should display platform information correctly', () => {
    render(
      <AthleteTable
        athletes={mockAthletes}
        loading={false}
        filters={mockFilters}
        onPageChange={mockOnPageChange}
        onSortChange={mockOnSortChange}
      />
    )

    expect(screen.getByText('IG:')).toBeInTheDocument()
    expect(screen.getByText('TT:')).toBeInTheDocument()
    expect(screen.getAllByText('5.0K')).toHaveLength(2)
    expect(screen.getAllByText('8.0K')).toHaveLength(2)
  })

  it('should handle loading state', () => {
    render(
      <AthleteTable
        athletes={null}
        loading={true}
        filters={{}}
        onPageChange={mockOnPageChange}
        onSortChange={mockOnSortChange}
      />
    )

    expect(screen.getByText('Loading athletes...')).toBeInTheDocument()
  })

  it('should handle no data state', () => {
    render(
      <AthleteTable
        athletes={null}
        loading={false}
        filters={{}}
        onPageChange={mockOnPageChange}
        onSortChange={mockOnSortChange}
      />
    )

    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('should handle pagination controls', async () => {
    const user = userEvent.setup()
    const paginationWithPages = {
      ...mockAthletes,
      pagination: {
        ...mockAthletes.pagination,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrev: false,
      },
    }

    render(
      <AthleteTable
        athletes={paginationWithPages}
        loading={false}
        filters={{}}
        onPageChange={mockOnPageChange}
        onSortChange={mockOnSortChange}
      />
    )


    expect(screen.getByText(/Showing 1 to 10 of 25 results/)).toBeInTheDocument()


    const nextButton = screen.getByText('Next')
    await user.click(nextButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('should handle column sorting', async () => {
    const user = userEvent.setup()
    render(
      <AthleteTable
        athletes={mockAthletes}
        loading={false}
        filters={{}}
        onPageChange={mockOnPageChange}
        onSortChange={mockOnSortChange}
      />
    )


    const scoreHeader = screen.getByText('Score')
    await user.click(scoreHeader)

    expect(mockOnSortChange).toHaveBeenCalledWith('currentScore_score', 'desc')
  })

  it('should disable pagination buttons when appropriate', () => {
    render(
      <AthleteTable
        athletes={mockAthletes}
        loading={false}
        filters={{}}
        onPageChange={mockOnPageChange}
        onSortChange={mockOnSortChange}
      />
    )

    const prevButton = screen.getByText('Previous')
    expect(prevButton).toBeDisabled()

    const nextButton = screen.getByText('Next')
    expect(nextButton).toBeDisabled()
  })

  it('should format large follower numbers correctly', () => {
    const athletesWithLargeNumbers = {
      ...mockAthletes,
      data: [
        {
          ...mockAthletes.data[0],
          currentScore: {
            ...mockAthletes.data[0].currentScore,
            totalFollowers: 1500000,
          },
          platforms: {
            instagram: {
              username: 'johndoe',
              followers: 1500000,
              engagementRate: 8.5,
            },
          },
        },
      ],
    }

    render(
      <AthleteTable
        athletes={athletesWithLargeNumbers}
        loading={false}
        filters={{}}
        onPageChange={mockOnPageChange}
        onSortChange={mockOnSortChange}
      />
    )

    expect(screen.getAllByText('1500.0K')).toHaveLength(2)
  })

  it('should handle multiple sports', () => {
    const athleteWithMultipleSports = {
      ...mockAthletes,
      data: [
        {
          ...mockAthletes.data[0],
          sports: [
            { id: 1, label: 'Football', name: 'Football' },
            { id: 2, label: 'Basketball', name: 'Basketball' },
          ],
        },
      ],
    }

    render(
      <AthleteTable
        athletes={athleteWithMultipleSports}
        loading={false}
        filters={{}}
        onPageChange={mockOnPageChange}
        onSortChange={mockOnSortChange}
      />
    )

    expect(screen.getByText('Football')).toBeInTheDocument()
    expect(screen.getByText('Basketball')).toBeInTheDocument()
  })
})
