import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AthleteFilters } from '../../components/athlete-filters'

describe('AthleteFilters', () => {
  const mockFilterOptions = {
    schools: [
      { id: 1, label: 'School 1', conference: 'Conference A' },
      { id: 2, label: 'School 2', conference: 'Conference B' },
      { id: 3, label: 'School 3', conference: 'Conference A' },
    ],
    sports: [
      { id: 1, label: 'Football' },
      { id: 2, label: 'Basketball' },
      { id: 3, label: 'Soccer' },
    ],
    conferences: ['Conference A', 'Conference B', 'Conference C'],
    grades: ['Freshman', 'Sophomore', 'Junior', 'Senior'],
  }

  const mockOnFiltersChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render all filter sections', () => {
    render(
      <AthleteFilters
        filterOptions={mockFilterOptions}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('Gender')).toBeInTheDocument()
    expect(screen.getByText('Grade')).toBeInTheDocument()
    expect(screen.getByText('School')).toBeInTheDocument()
    expect(screen.getByText('Conference')).toBeInTheDocument()
    expect(screen.getByText('Sport')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Score Range')).toBeInTheDocument()
    expect(screen.getByText('Followers Range')).toBeInTheDocument()
    expect(screen.getByText('Engagement Rate Range (%)')).toBeInTheDocument()
    expect(screen.getByText('Hispanic Audience (%)')).toBeInTheDocument()
  })

  it('should handle text search input', async () => {
    const user = userEvent.setup()
    render(
      <AthleteFilters
        filterOptions={mockFilterOptions}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const searchInput = screen.getByPlaceholderText('Name, email, or school...')
    await user.type(searchInput, 'John Doe')

    const applyButton = screen.getByText('Apply Filters')
    await user.click(applyButton)

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'John Doe',
        })
      )
    })
  })

  it('should handle school selection', async () => {
    const user = userEvent.setup()
    render(
      <AthleteFilters
        filterOptions={mockFilterOptions}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const schoolSelect = screen.getByDisplayValue('All Schools')
    await user.selectOptions(schoolSelect, '1')

    const applyButton = screen.getByText('Apply Filters')
    await user.click(applyButton)

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          school: 1,
        })
      )
    })
  })

  it('should handle sport selection', async () => {
    const user = userEvent.setup()
    render(
      <AthleteFilters
        filterOptions={mockFilterOptions}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const sportSelect = screen.getByDisplayValue('All Sports')
    await user.selectOptions(sportSelect, '1')

    const applyButton = screen.getByText('Apply Filters')
    await user.click(applyButton)

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          sport: 1,
        })
      )
    })
  })

  it('should handle gender selection', async () => {
    const user = userEvent.setup()
    render(
      <AthleteFilters
        filterOptions={mockFilterOptions}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const genderSelects = screen.getAllByDisplayValue('All')
    const genderSelect = genderSelects[0] 
    await user.selectOptions(genderSelect, 'Male')

    const applyButton = screen.getByText('Apply Filters')
    await user.click(applyButton)

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          gender: 'Male',
        })
      )
    })
  })

  it('should handle performance range inputs', async () => {
    const user = userEvent.setup()
    render(
      <AthleteFilters
        filterOptions={mockFilterOptions}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const minInputs = screen.getAllByPlaceholderText('Min')
    const maxInputs = screen.getAllByPlaceholderText('Max')
    const minScoreInput = minInputs[0]
    const maxScoreInput = maxInputs[0]

    await user.type(minScoreInput, '50')
    await user.type(maxScoreInput, '100')

    const applyButton = screen.getByText('Apply Filters')
    await user.click(applyButton)

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          scoreMin: 50,
          scoreMax: 100,
        })
      )
    })
  })

  it('should handle followers range inputs', async () => {
    const user = userEvent.setup()
    render(
      <AthleteFilters
        filterOptions={mockFilterOptions}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const minInputs = screen.getAllByPlaceholderText('Min')
    const maxInputs = screen.getAllByPlaceholderText('Max')
    const minFollowersInput = minInputs[1]
    const maxFollowersInput = maxInputs[1]

    await user.type(minFollowersInput, '1000')
    await user.type(maxFollowersInput, '10000')

    const applyButton = screen.getByText('Apply Filters')
    await user.click(applyButton)

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          totalFollowersMin: 1000,
          totalFollowersMax: 10000,
        })
      )
    })
  })

  it('should handle demographic filters', async () => {
    const user = userEvent.setup()
    render(
      <AthleteFilters
        filterOptions={mockFilterOptions}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const genderSelects = screen.getAllByDisplayValue('All')
    const genderSelect = genderSelects[0]
    await user.selectOptions(genderSelect, 'Male')

    const applyButton = screen.getByText('Apply Filters')
    await user.click(applyButton)

    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith(
        expect.objectContaining({
          gender: 'Male',
        })
      )
    })
  })

  it('should handle clear filters button', async () => {
    const user = userEvent.setup()
    render(
      <AthleteFilters
        filterOptions={mockFilterOptions}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    const clearButton = screen.getByText('Clear')
    await user.click(clearButton)

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      sortBy: 'score',
      sortOrder: 'desc',
    })
  })

  it('should handle empty filter options', () => {
    const emptyOptions = {
      schools: [],
      sports: [],
      conferences: [],
      grades: [],
    }

    render(
      <AthleteFilters
        filterOptions={emptyOptions}
        onFiltersChange={mockOnFiltersChange}
      />
    )

    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })
})
