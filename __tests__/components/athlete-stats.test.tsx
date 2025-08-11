import React from 'react'
import { render, screen } from '@testing-library/react'
import { AthleteStats } from '../../components/athlete-stats'

describe('AthleteStats', () => {
  const mockStats = {
    totalAthletes: 150,
    activeAthletes: 120,
    alumniAthletes: 30,
    avgScore: 78.5,
    avgFollowers: 7500,
    avgEngagement: 9.2,
  }

  it('should render all statistics correctly', () => {
    render(<AthleteStats stats={mockStats} />)

    expect(screen.getByText('150')).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText('78.5')).toBeInTheDocument()
    expect(screen.getByText('7.5K')).toBeInTheDocument()
    expect(screen.getByText('9.20%')).toBeInTheDocument()
  })

  it('should display correct labels', () => {
    render(<AthleteStats stats={mockStats} />)

    expect(screen.getByText('Total Athletes')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Alumni')).toBeInTheDocument()
    expect(screen.getByText('Avg Score')).toBeInTheDocument()
    expect(screen.getByText('Avg Followers')).toBeInTheDocument()
    expect(screen.getByText('Avg Engagement')).toBeInTheDocument()
  })

  it('should handle zero values', () => {
    const zeroStats = {
      totalAthletes: 0,
      activeAthletes: 0,
      alumniAthletes: 0,
      avgScore: 0,
      avgFollowers: 0,
      avgEngagement: 0,
    }

    render(<AthleteStats stats={zeroStats} />)

    expect(screen.getAllByText('0')).toHaveLength(4)
    expect(screen.getByText('0.0')).toBeInTheDocument()
    expect(screen.getByText('0.00%')).toBeInTheDocument()
  })

  it('should format large numbers correctly', () => {
    const largeStats = {
      ...mockStats,
      avgFollowers: 1500000,
    }

    render(<AthleteStats stats={largeStats} />)

    expect(screen.getByText('1500.0K')).toBeInTheDocument()
  })

  it('should handle decimal values correctly', () => {
    const decimalStats = {
      ...mockStats,
      avgScore: 85.123,
      avgEngagement: 12.456,
    }

    render(<AthleteStats stats={decimalStats} />)

    expect(screen.getByText('85.1')).toBeInTheDocument()
    expect(screen.getByText('12.46%')).toBeInTheDocument()
  })
})
