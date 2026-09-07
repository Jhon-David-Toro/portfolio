import { describe, expect, it } from 'vitest'
import { formatMonthYear } from './formatMonthYear'

describe('formatMonthYear', () => {
  it('formats a year-month as a short month and full year in English', () => {
    expect(formatMonthYear('2024-09', 'en')).toBe('Sep 2024')
  })

  it('formats the same value in Spanish', () => {
    expect(formatMonthYear('2024-09', 'es')).toMatch(/sept?\.?\s*2024/i)
  })

  it('handles single-digit months correctly', () => {
    expect(formatMonthYear('2025-01', 'en')).toBe('Jan 2025')
  })

  it('handles December without rolling over to the next year', () => {
    expect(formatMonthYear('2025-12', 'en')).toBe('Dec 2025')
  })
})
