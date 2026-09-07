import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { experience } from '@/content/experience/experience'
import { skillGroups } from '@/content/skills/skills'
import { computeAboutStats } from './aboutStats'

describe('computeAboutStats', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('counts roles as the number of experience entries', () => {
    vi.setSystemTime(new Date('2026-09-07'))
    expect(computeAboutStats().roleCount).toBe(experience.length)
  })

  it('counts technologies across every skill group', () => {
    vi.setSystemTime(new Date('2026-09-07'))
    const expected = skillGroups.reduce((total, group) => total + group.items.length, 0)
    expect(computeAboutStats().technologyCount).toBe(expected)
  })

  it('derives years of experience from the earliest role start date', () => {
    // Earliest role in content/experience/experience.ts starts 2024-09.
    vi.setSystemTime(new Date('2026-09-08'))
    expect(computeAboutStats().yearsOfExperience).toBe(2)
  })

  it('never returns a negative number, even right at the start date', () => {
    vi.setSystemTime(new Date('2024-09-01'))
    expect(computeAboutStats().yearsOfExperience).toBeGreaterThanOrEqual(0)
  })
})
