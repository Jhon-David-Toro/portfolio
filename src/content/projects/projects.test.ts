import { describe, expect, it } from 'vitest'
import { getProjectMeta, getProjects } from './projects'

describe('getProjects', () => {
  it('returns at least one project', () => {
    expect(getProjects().length).toBeGreaterThan(0)
  })

  it('gives every project a unique, non-empty slug', () => {
    const slugs = getProjects().map((project) => project.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugs.every((slug) => slug.length > 0)).toBe(true)
  })
})

describe('getProjectMeta', () => {
  it('finds a project by its slug', () => {
    const [first] = getProjects()
    expect(getProjectMeta(first.slug)).toEqual(first)
  })

  it('returns undefined for an unknown slug', () => {
    expect(getProjectMeta('does-not-exist')).toBeUndefined()
  })
})
