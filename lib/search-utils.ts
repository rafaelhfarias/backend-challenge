import Fuse from 'fuse.js'

export interface SearchResult {
  item: any
  refIndex: number
  score: number
  matches?: Array<{
    indices: number[][]
    key: string
    value: string
  }>
}

export interface HighlightedText {
  text: string
  highlighted: boolean
}

// Fuse.js configuration for fuzzy search
const fuseOptions = {
  keys: [
    { name: 'name', weight: 0.7 },
    { name: 'email', weight: 0.5 },
    { name: 'school.name', weight: 0.6 },
    { name: 'sports.name', weight: 0.4 },
    { name: 'categories.category.name', weight: 0.3 }
  ],
  threshold: 0.3, // Lower threshold = more strict matching
  distance: 100, // Maximum distance for fuzzy matching
  includeMatches: true, // Include match information for highlighting
  ignoreLocation: true, // Ignore location of matches in strings
  useExtendedSearch: false,
  minMatchCharLength: 2
}

// Create Fuse instance for fuzzy search
export function createFuseInstance(data: any[]) {
  return new Fuse(data, fuseOptions)
}

// Perform fuzzy search
export function fuzzySearch(fuse: Fuse<any>, searchTerm: string, limit: number = 50): SearchResult[] {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return []
  }
  
  const results = fuse.search(searchTerm, { limit })
  return results
}

// Highlight text based on search matches
export function highlightText(text: string, searchTerm: string): HighlightedText[] {
  if (!searchTerm || !text) {
    return [{ text, highlighted: false }]
  }

  const lowerText = text.toLowerCase()
  const lowerSearchTerm = searchTerm.toLowerCase()
  const parts: HighlightedText[] = []
  let lastIndex = 0

  // Find all occurrences of the search term
  let index = lowerText.indexOf(lowerSearchTerm)
  while (index !== -1) {
    // Add text before the match
    if (index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, index),
        highlighted: false
      })
    }

    // Add the highlighted match
    parts.push({
      text: text.substring(index, index + searchTerm.length),
      highlighted: true
    })

    lastIndex = index + searchTerm.length
    index = lowerText.indexOf(lowerSearchTerm, lastIndex)
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      highlighted: false
    })
  }

  return parts.length > 0 ? parts : [{ text, highlighted: false }]
}

// Highlight text based on Fuse.js matches
export function highlightTextWithMatches(text: string, matches: Array<{ indices: number[][] }>): HighlightedText[] {
  if (!matches || matches.length === 0) {
    return [{ text, highlighted: false }]
  }

  const parts: HighlightedText[] = []
  let lastIndex = 0

  // Collect all match indices
  const allIndices: number[][] = []
  matches.forEach(match => {
    match.indices.forEach(indices => {
      allIndices.push(indices)
    })
  })

  // Sort indices by start position
  allIndices.sort((a, b) => a[0] - b[0])

  // Merge overlapping indices
  const mergedIndices: number[][] = []
  for (const indices of allIndices) {
    if (mergedIndices.length === 0) {
      mergedIndices.push([...indices])
    } else {
      const last = mergedIndices[mergedIndices.length - 1]
      if (indices[0] <= last[1] + 1) {
        // Overlapping or adjacent, merge them
        last[1] = Math.max(last[1], indices[1])
      } else {
        // Non-overlapping, add new
        mergedIndices.push([...indices])
      }
    }
  }

  // Create highlighted parts
  for (const [start, end] of mergedIndices) {
    // Add text before the match
    if (start > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, start),
        highlighted: false
      })
    }

    // Add the highlighted match
    parts.push({
      text: text.substring(start, end + 1),
      highlighted: true
    })

    lastIndex = end + 1
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      highlighted: false
    })
  }

  return parts.length > 0 ? parts : [{ text, highlighted: false }]
}

// Simple text search with highlighting (fallback)
export function simpleSearch(data: any[], searchTerm: string, fields: string[]): any[] {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return data
  }

  const lowerSearchTerm = searchTerm.toLowerCase()
  
  return data.filter(item => {
    return fields.some(field => {
      const value = getNestedValue(item, field)
      return value && value.toLowerCase().includes(lowerSearchTerm)
    })
  })
}

// Get nested object value by path (e.g., 'school.name')
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => {
    if (Array.isArray(current)) {
      return current.map(item => item[key]).join(' ')
    }
    return current?.[key] || ''
  }, obj)
}

// Calculate search relevance score
export function calculateRelevanceScore(item: any, searchTerm: string): number {
  const lowerSearchTerm = searchTerm.toLowerCase()
  let score = 0

  // Exact matches get higher scores
  if (item.name?.toLowerCase().includes(lowerSearchTerm)) score += 10
  if (item.email?.toLowerCase().includes(lowerSearchTerm)) score += 8
  if (item.school?.name?.toLowerCase().includes(lowerSearchTerm)) score += 6

  // Partial matches
  const words = lowerSearchTerm.split(' ').filter(word => word.length > 1)
  words.forEach(word => {
    if (item.name?.toLowerCase().includes(word)) score += 3
    if (item.email?.toLowerCase().includes(word)) score += 2
    if (item.school?.name?.toLowerCase().includes(word)) score += 2
  })

  return score
}
