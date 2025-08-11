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

const fuseOptions = {
  keys: [
    { name: 'name', weight: 0.7 },
    { name: 'email', weight: 0.5 },
    { name: 'school.name', weight: 0.6 },
    { name: 'sports.name', weight: 0.4 },
    { name: 'categories.category.name', weight: 0.3 }
  ],
  threshold: 0.3,
  distance: 100,
  includeMatches: true,
  ignoreLocation: true,
  useExtendedSearch: false,
  minMatchCharLength: 2
}

export function createFuseInstance(data: any[]) {
  return new Fuse(data, fuseOptions)
}

export function fuzzySearch(fuse: Fuse<any>, searchTerm: string, limit: number = 50): SearchResult[] {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return []
  }
  
  const results = fuse.search(searchTerm, { limit })
  return results as SearchResult[]
}

export function highlightText(text: string, searchTerm: string): HighlightedText[] {
  if (!searchTerm || !text) {
    return [{ text, highlighted: false }]
  }

  const lowerText = text.toLowerCase()
  const lowerSearchTerm = searchTerm.toLowerCase()
  const parts: HighlightedText[] = []
  let lastIndex = 0

  let index = lowerText.indexOf(lowerSearchTerm)
  while (index !== -1) {
    if (index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, index),
        highlighted: false
      })
    }

    parts.push({
      text: text.substring(index, index + searchTerm.length),
      highlighted: true
    })

    lastIndex = index + searchTerm.length
    index = lowerText.indexOf(lowerSearchTerm, lastIndex)
  }

  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      highlighted: false
    })
  }

  return parts.length > 0 ? parts : [{ text, highlighted: false }]
}

export function highlightTextWithMatches(text: string, matches: Array<{ indices: number[][] }>): HighlightedText[] {
  if (!matches || matches.length === 0) {
    return [{ text, highlighted: false }]
  }

  const parts: HighlightedText[] = []
  let lastIndex = 0

  const allIndices: number[][] = []
  matches.forEach(match => {
    match.indices.forEach(indices => {
      allIndices.push(indices)
    })
  })

  allIndices.sort((a, b) => a[0] - b[0])

  const mergedIndices: number[][] = []
  for (const indices of allIndices) {
    if (mergedIndices.length === 0) {
      mergedIndices.push([...indices])
    } else {
      const last = mergedIndices[mergedIndices.length - 1]
      if (indices[0] <= last[1] + 1) {
        last[1] = Math.max(last[1], indices[1])
      } else {
        mergedIndices.push([...indices])
      }
    }
  }

  for (const [start, end] of mergedIndices) {
    if (start > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, start),
        highlighted: false
      })
    }

    parts.push({
      text: text.substring(start, end + 1),
      highlighted: true
    })

    lastIndex = end + 1
  }

  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      highlighted: false
    })
  }

  return parts.length > 0 ? parts : [{ text, highlighted: false }]
}

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

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => {
    if (Array.isArray(current)) {
      return current.map(item => item[key]).join(' ')
    }
    return current?.[key] || ''
  }, obj)
}

export function calculateRelevanceScore(item: any, searchTerm: string): number {
  const lowerSearchTerm = searchTerm.toLowerCase()
  let score = 0

  if (item.name?.toLowerCase().includes(lowerSearchTerm)) score += 10
  if (item.email?.toLowerCase().includes(lowerSearchTerm)) score += 8
  if (item.school?.name?.toLowerCase().includes(lowerSearchTerm)) score += 6

  const words = lowerSearchTerm.split(' ').filter(word => word.length > 1)
  words.forEach(word => {
    if (item.name?.toLowerCase().includes(word)) score += 3
    if (item.email?.toLowerCase().includes(word)) score += 2
    if (item.school?.name?.toLowerCase().includes(word)) score += 2
  })

  return score
}
