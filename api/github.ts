import { GITHUB_USERNAME } from '../src/content/profile/profile'
import type { GithubActivity, GithubRepo } from '../src/shared/layout/GithubRepos/GithubRepos.types'
import type { GraphQLRepoNode, GraphQLResponse } from './github.types'

// Vercel Edge Function — runs server-side only, so this is the one place
// allowed to hold a GitHub token. Uses Web-standard Request/Response/fetch,
// adding zero new dependencies to the project (same approach as chat.ts).
export const config = { runtime: 'edge' }

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql'
// A repo's default-branch commit count and star/language data barely change
// minute to minute — letting Vercel's edge cache serve repeat requests for
// 5 minutes means most visitors never actually re-hit GitHub's API at all.
const CACHE_CONTROL = 'public, max-age=300, s-maxage=300, stale-while-revalidate=3600'

// One GraphQL request replaces the ~1-per-repo REST calls the client used to
// make just to learn each repo's commit count — both trims the request
// count drastically and moves the GitHub token (and its 5,000/hour
// authenticated limit) off a per-visitor unauthenticated 60/hour budget.
const ACTIVITY_QUERY = `
  query GithubActivity($login: String!) {
    user(login: $login) {
      followers {
        totalCount
      }
      allPublicRepos: repositories(privacy: PUBLIC, ownerAffiliations: [OWNER]) {
        totalCount
      }
      ownRepos: repositories(
        privacy: PUBLIC
        isFork: false
        ownerAffiliations: [OWNER]
        first: 100
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        nodes {
          databaseId
          name
          url
          description
          primaryLanguage {
            name
          }
          stargazerCount
          defaultBranchRef {
            target {
              ... on Commit {
                history {
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  }
`

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
}

function unavailableResponse(): Response {
  return jsonResponse({ error: 'GitHub activity is temporarily unavailable.' }, 502)
}

function resolveLanguage(node: GraphQLRepoNode): string | null {
  return node.primaryLanguage ? node.primaryLanguage.name : null
}

function resolveCommitCount(node: GraphQLRepoNode): number | null {
  return node.defaultBranchRef ? node.defaultBranchRef.target.history.totalCount : null
}

function mapRepo(node: GraphQLRepoNode): GithubRepo {
  return {
    id: node.databaseId,
    name: node.name,
    htmlUrl: node.url,
    description: node.description,
    language: resolveLanguage(node),
    stargazersCount: node.stargazerCount,
    commitCount: resolveCommitCount(node),
  }
}

/** Calls GitHub's GraphQL API and shapes the result into `GithubActivity`. */
async function fetchActivity(token: string): Promise<GithubActivity | null> {
  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `bearer ${token}`,
    },
    body: JSON.stringify({ query: ACTIVITY_QUERY, variables: { login: GITHUB_USERNAME } }),
  })

  if (!response.ok) {
    return null
  }

  const result = (await response.json()) as GraphQLResponse
  const user = result.data?.user
  if (!user) {
    return null
  }

  // Excludes the profile README repo (not a project) — everything else
  // real is kept, already sorted most-recently-pushed-first by the query.
  const repos = user.ownRepos.nodes
    .filter((node) => node.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase())
    .map(mapRepo)

  return {
    profile: { publicRepos: user.allPublicRepos.totalCount, followers: user.followers.totalCount },
    repos,
  }
}

/** Fetches the activity and shapes the final response — success or a graceful failure. */
async function loadActivityResponse(token: string): Promise<Response> {
  try {
    const activity = await fetchActivity(token)
    if (!activity) {
      return unavailableResponse()
    }
    return new Response(JSON.stringify(activity), {
      status: 200,
      headers: { 'content-type': 'application/json', 'cache-control': CACHE_CONTROL },
    })
  } catch {
    return unavailableResponse()
  }
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return jsonResponse({ error: 'GitHub activity is not configured yet.' }, 503)
  }

  return loadActivityResponse(token)
}
