import { GITHUB_USERNAME } from '@/content/profile/profile'
import type { GithubActivity } from './GithubRepos.types'

// Bump this whenever GithubActivity's shape changes, so a visitor who
// already cached the old shape doesn't get served stale, mismatched fields.
const CACHE_VERSION = 5
const CACHE_KEY = `github-activity:${GITHUB_USERNAME}:v${CACHE_VERSION}`
const CACHE_TTL_MS = 60 * 60 * 1000

type CachedActivity = {
  readonly fetchedAt: number
  readonly data: GithubActivity
}

/** Reads a still-fresh cached response, so repeat visits skip the network. */
export function readCachedActivity(): GithubActivity | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) {
      return null
    }
    const cached = JSON.parse(raw) as CachedActivity
    const isFresh = Date.now() - cached.fetchedAt < CACHE_TTL_MS
    return isFresh ? cached.data : null
  } catch {
    return null
  }
}

/** Caches a successful response — best-effort, never blocks on failure. */
function writeCachedActivity(data: GithubActivity): void {
  try {
    const cached: CachedActivity = { fetchedAt: Date.now(), data }
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(cached))
  } catch {
    // Storage can be unavailable (private browsing, quota) — caching is an
    // optimization, not a requirement, so a failed write is safely ignored.
  }
}

/**
 * Fetches live GitHub activity through our own server-side proxy
 * (api/github.ts) rather than calling GitHub directly — the proxy holds an
 * authenticated token (5,000 requests/hour) instead of every visitor
 * sharing GitHub's unauthenticated 60/hour-per-IP limit, and collapses
 * what used to be one REST call per repo into a single GraphQL request.
 *
 * @param signal - Aborts the request, e.g. from an effect's cleanup.
 */
export async function fetchGithubActivity(signal?: AbortSignal): Promise<GithubActivity> {
  const response = await fetch('/api/github', { signal })
  if (!response.ok) {
    throw new Error('GitHub activity request failed')
  }

  const activity = (await response.json()) as GithubActivity
  writeCachedActivity(activity)
  return activity
}
