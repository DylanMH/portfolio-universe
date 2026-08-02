import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('merges class names and resolves conflicts', () => {
    expect(cn('px-4 px-6', 'bg-red-500 bg-blue-500')).toBe('px-6 bg-blue-500')
  })

  it('handles conditional classes', () => {
    const active = true
    expect(cn('base', active && 'active')).toBe('base active')
  })

  it('returns empty string for empty input', () => {
    expect(cn()).toBe('')
  })
})
