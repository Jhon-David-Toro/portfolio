import { describe, expect, it } from 'vitest'
import { formatMs, formatScore, formatSeconds } from './SiteFooter.helpers'

describe('formatSeconds', () => {
  it('formats milliseconds as seconds with one decimal', () => {
    expect(formatSeconds(925)).toBe('0.9s')
  })

  it('rounds to one decimal place', () => {
    expect(formatSeconds(3140)).toBe('3.1s')
  })

  it('shows the "still measuring" placeholder for null', () => {
    expect(formatSeconds(null)).toBe('—')
  })
})

describe('formatMs', () => {
  it('formats and rounds to the nearest whole millisecond', () => {
    expect(formatMs(41.6)).toBe('42ms')
  })

  it('shows the placeholder for null', () => {
    expect(formatMs(null)).toBe('—')
  })
})

describe('formatScore', () => {
  it('formats a unitless score to two decimals', () => {
    expect(formatScore(0)).toBe('0.00')
    expect(formatScore(0.123)).toBe('0.12')
  })

  it('shows the placeholder for null', () => {
    expect(formatScore(null)).toBe('—')
  })
})
