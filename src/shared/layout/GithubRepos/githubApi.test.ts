import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { GithubActivity } from './GithubRepos.types'
import { fetchGithubActivity, readCachedActivity } from './githubApi'

const ACTIVITY: GithubActivity = {
  profile: { publicRepos: 12, followers: 34 },
  repos: [
    {
      id: 1,
      name: 'demo-repo',
      htmlUrl: 'https://github.com/Jhon-Toro/demo-repo',
      description: 'A demo repo',
      language: 'TypeScript',
      stargazersCount: 5,
      commitCount: 42,
    },
  ],
}

describe('readCachedActivity', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('returns null when nothing is cached', () => {
    expect(readCachedActivity()).toBeNull()
  })

  it('returns null when the cache entry is malformed JSON', () => {
    sessionStorage.setItem('github-activity:Jhon-Toro:v5', '{not json')
    expect(readCachedActivity()).toBeNull()
  })
})

describe('fetchGithubActivity', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('resolves with the parsed activity and caches it for next time', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(ACTIVITY), { status: 200 }))

    const result = await fetchGithubActivity()

    expect(result).toEqual(ACTIVITY)
    // A cached read right after should hit the fresh cache written above,
    // without needing a second fetch — exercises the two functions together
    // exactly as useGithubActivity relies on them to.
    expect(readCachedActivity()).toEqual(ACTIVITY)
  })

  it('throws when the response is not ok, and does not cache anything', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 502 }))

    await expect(fetchGithubActivity()).rejects.toThrow()
    expect(readCachedActivity()).toBeNull()
  })
})
