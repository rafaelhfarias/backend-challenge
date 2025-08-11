import { 
  createFuseInstance, 
  fuzzySearch, 
  highlightText, 
  highlightTextWithMatches,
  simpleSearch,
  calculateRelevanceScore 
} from '@/lib/search-utils'

const mockAthletes = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@ucla.edu',
    school: { name: 'UCLA' },
    sports: [{ name: 'Basketball' }],
    categories: [{ category: { name: 'Sports' } }]
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@duke.edu',
    school: { name: 'Duke University' },
    sports: [{ name: 'Soccer' }],
    categories: [{ category: { name: 'Lifestyle' } }]
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael.brown@alabama.edu',
    school: { name: 'Alabama' },
    sports: [{ name: 'Football' }],
    categories: [{ category: { name: 'Entertainment' } }]
  }
]

describe('Search Utils', () => {
  describe('Fuse.js Integration', () => {
    it('should create Fuse instance', () => {
      const fuse = createFuseInstance(mockAthletes)
      expect(fuse).toBeDefined()
    })

    it('should perform fuzzy search', () => {
      const fuse = createFuseInstance(mockAthletes)
      const results = fuzzySearch(fuse, 'john')
      
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].item.name).toContain('John')
    })

    it('should handle empty search term', () => {
      const fuse = createFuseInstance(mockAthletes)
      const results = fuzzySearch(fuse, '')
      
      expect(results).toEqual([])
    })

    it('should handle short search term', () => {
      const fuse = createFuseInstance(mockAthletes)
      const results = fuzzySearch(fuse, 'a')
      
      expect(results).toEqual([])
    })

    it('should find partial matches', () => {
      const fuse = createFuseInstance(mockAthletes)
      const results = fuzzySearch(fuse, 'ucla')
      
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].item.school.name).toBe('UCLA')
    })
  })

  describe('Text Highlighting', () => {
    it('should highlight exact matches', () => {
      const parts = highlightText('John Smith', 'John')
      
      expect(parts).toHaveLength(2)
      expect(parts[0]).toEqual({ text: 'John', highlighted: true })
      expect(parts[1]).toEqual({ text: ' Smith', highlighted: false })
    })

    it('should highlight multiple matches', () => {
      const parts = highlightText('John John Smith', 'John')
      
      expect(parts).toHaveLength(4)
      expect(parts[0]).toEqual({ text: 'John', highlighted: true })
      expect(parts[1]).toEqual({ text: ' ', highlighted: false })
      expect(parts[2]).toEqual({ text: 'John', highlighted: true })
      expect(parts[3]).toEqual({ text: ' Smith', highlighted: false })
    })

    it('should handle case insensitive highlighting', () => {
      const parts = highlightText('John Smith', 'john')
      
      expect(parts).toHaveLength(2)
      expect(parts[0]).toEqual({ text: 'John', highlighted: true })
      expect(parts[1]).toEqual({ text: ' Smith', highlighted: false })
    })

    it('should return original text when no match', () => {
      const parts = highlightText('John Smith', 'xyz')
      
      expect(parts).toHaveLength(1)
      expect(parts[0]).toEqual({ text: 'John Smith', highlighted: false })
    })

    it('should handle empty search term', () => {
      const parts = highlightText('John Smith', '')
      
      expect(parts).toHaveLength(1)
      expect(parts[0]).toEqual({ text: 'John Smith', highlighted: false })
    })
  })

  describe('Fuse.js Match Highlighting', () => {
    it('should highlight based on Fuse.js matches', () => {
      const matches = [
        {
          indices: [[0, 3]], // "John"
          key: 'name',
          value: 'John Smith'
        }
      ]
      
      const parts = highlightTextWithMatches('John Smith', matches)
      
      expect(parts).toHaveLength(2)
      expect(parts[0]).toEqual({ text: 'John', highlighted: true })
      expect(parts[1]).toEqual({ text: ' Smith', highlighted: false })
    })

    it('should merge overlapping indices', () => {
      const matches = [
        {
          indices: [[0, 3], [5, 8]], // "John" and "Smi"
          key: 'name',
          value: 'John Smith'
        }
      ]
      
      const parts = highlightTextWithMatches('John Smith', matches)
      
      expect(parts.length).toBeGreaterThan(1)
      expect(parts.some(part => part.highlighted)).toBe(true)
    })

    it('should handle empty matches', () => {
      const parts = highlightTextWithMatches('John Smith', [])
      
      expect(parts).toHaveLength(1)
      expect(parts[0]).toEqual({ text: 'John Smith', highlighted: false })
    })
  })

  describe('Simple Search', () => {
    it('should filter data by search term', () => {
      const results = simpleSearch(mockAthletes, 'john', ['name', 'email'])
      
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].name).toContain('John')
    })

    it('should search in nested fields', () => {
      const results = simpleSearch(mockAthletes, 'ucla', ['school.name'])
      
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].school.name).toBe('UCLA')
    })

    it('should return all data for empty search', () => {
      const results = simpleSearch(mockAthletes, '', ['name'])
      
      expect(results).toEqual(mockAthletes)
    })

    it('should handle case insensitive search', () => {
      const results = simpleSearch(mockAthletes, 'JOHN', ['name'])
      
      expect(results.length).toBeGreaterThan(0)
      expect(results[0].name).toContain('John')
    })
  })

  describe('Relevance Scoring', () => {
    it('should calculate relevance score for exact matches', () => {
      const score = calculateRelevanceScore(mockAthletes[0], 'John')
      
      expect(score).toBeGreaterThan(0)
    })

    it('should give higher scores for name matches', () => {
      const nameScore = calculateRelevanceScore(mockAthletes[0], 'John')
      const emailScore = calculateRelevanceScore(mockAthletes[0], 'john.smith')
      
      expect(nameScore).toBeGreaterThan(emailScore)
    })

    it('should handle partial word matches', () => {
      const score = calculateRelevanceScore(mockAthletes[0], 'john smith')
      
      expect(score).toBeGreaterThan(0)
    })

    it('should return zero for no matches', () => {
      const score = calculateRelevanceScore(mockAthletes[0], 'xyz')
      
      expect(score).toBe(0)
    })
  })
})
