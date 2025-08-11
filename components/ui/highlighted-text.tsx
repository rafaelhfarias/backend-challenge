import React from 'react'
import { HighlightedText } from '@/lib/types'

interface HighlightedTextProps {
  parts: HighlightedText[]
  className?: string
  highlightClassName?: string
}

export function HighlightedTextComponent({ 
  parts, 
  className = '', 
  highlightClassName = 'bg-yellow-200 font-semibold' 
}: HighlightedTextProps) {
  return (
    <span className={className}>
      {parts.map((part, index) => (
        <span
          key={index}
          className={part.highlighted ? highlightClassName : ''}
        >
          {part.text}
        </span>
      ))}
    </span>
  )
}

interface SearchHighlightProps {
  text: string
  searchTerm?: string
  className?: string
  highlightClassName?: string
}

export function SearchHighlight({ 
  text, 
  searchTerm, 
  className = '', 
  highlightClassName = 'bg-yellow-200 font-semibold' 
}: SearchHighlightProps) {
  if (!searchTerm || !text) {
    return <span className={className}>{text}</span>
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

  return <HighlightedTextComponent 
    parts={parts} 
    className={className} 
    highlightClassName={highlightClassName} 
  />
}
