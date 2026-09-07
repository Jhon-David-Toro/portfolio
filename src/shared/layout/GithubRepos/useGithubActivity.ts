import { useCallback, useEffect, useState } from 'react'
import { fetchGithubActivity, readCachedActivity } from './githubApi'
import type { GithubActivityState } from './GithubRepos.types'

/**
 * Loads a live snapshot of real GitHub activity — profile stats and
 * repositories. The returned `retry` re-attempts the fetch after a failure.
 */
export function useGithubActivity(): readonly [GithubActivityState, () => void] {
  const [state, setState] = useState<GithubActivityState>(() => {
    const cached = readCachedActivity()
    return cached ? { kind: 'success', data: cached } : { kind: 'loading' }
  })

  useEffect(() => {
    if (state.kind !== 'loading') {
      return
    }

    // AbortController (not a `cancelled` flag) is what actually stops the
    // in-flight request under StrictMode's dev-only double-invoke — without
    // it, every mount fires two real requests against the rate-limited API.
    const controller = new AbortController()

    fetchGithubActivity(controller.signal)
      .then((data) => {
        setState({ kind: 'success', data })
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        setState({ kind: 'error' })
      })

    return () => {
      controller.abort()
    }
  }, [state.kind])

  const retry = useCallback(() => {
    setState({ kind: 'loading' })
  }, [])

  return [state, retry] as const
}
