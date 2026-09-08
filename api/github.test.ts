/* @vitest-environment node */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import handler from './github'
import type { GraphQLResponse } from './github.types'

function githubRequest(method = 'GET'): Request {
  return new Request('https://example.com/api/github', { method })
}

function graphqlSuccess(body: GraphQLResponse): Response {
  return new Response(JSON.stringify(body), { status: 200 })
}

describe('api/github handler', () => {
  beforeEach(() => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token')
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('rejects non-GET methods', async () => {
    const response = await handler(githubRequest('POST'))
    expect(response.status).toBe(405)
  })

  it('returns 503 when no GitHub token is configured', async () => {
    vi.stubEnv('GITHUB_TOKEN', '')

    const response = await handler(githubRequest())

    expect(response.status).toBe(503)
  })

  it('returns 502 when the GitHub API call fails', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 401 }))

    const response = await handler(githubRequest())

    expect(response.status).toBe(502)
  })

  it('shapes a successful response, excluding the profile-readme repo', async () => {
    vi.mocked(fetch).mockResolvedValue(
      graphqlSuccess({
        data: {
          user: {
            followers: { totalCount: 10 },
            allPublicRepos: { totalCount: 5 },
            ownRepos: {
              nodes: [
                {
                  databaseId: 1,
                  name: 'Jhon-David-Toro',
                  url: 'https://github.com/Jhon-David-Toro/Jhon-David-Toro',
                  description: null,
                  primaryLanguage: null,
                  stargazerCount: 0,
                  defaultBranchRef: null,
                },
                {
                  databaseId: 2,
                  name: 'cool-project',
                  url: 'https://github.com/Jhon-David-Toro/cool-project',
                  description: 'A cool project',
                  primaryLanguage: { name: 'TypeScript' },
                  stargazerCount: 7,
                  defaultBranchRef: { target: { history: { totalCount: 20 } } },
                },
              ],
            },
          },
        },
      }),
    )

    const response = await handler(githubRequest())
    const body = (await response.json()) as {
      profile: { publicRepos: number; followers: number }
      repos: { name: string; language: string | null; commitCount: number | null }[]
    }

    expect(response.status).toBe(200)
    expect(body.profile).toEqual({ publicRepos: 5, followers: 10 })
    expect(body.repos).toHaveLength(1)
    expect(body.repos[0]).toMatchObject({
      name: 'cool-project',
      language: 'TypeScript',
      commitCount: 20,
    })
  })

  it('returns 502 when GitHub reports no user for the configured login', async () => {
    vi.mocked(fetch).mockResolvedValue(graphqlSuccess({ data: undefined }))

    const response = await handler(githubRequest())

    expect(response.status).toBe(502)
  })
})
