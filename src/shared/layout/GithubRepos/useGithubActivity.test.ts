import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { GithubActivity } from './GithubRepos.types'
import * as githubApi from './githubApi'
import { useGithubActivity } from './useGithubActivity'

const ACTIVITY: GithubActivity = {
  profile: { publicRepos: 1, followers: 2 },
  repos: [],
}

describe('useGithubActivity', () => {
  beforeEach(() => {
    vi.spyOn(githubApi, 'readCachedActivity').mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts in the loading state when nothing is cached', () => {
    vi.spyOn(githubApi, 'fetchGithubActivity').mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useGithubActivity())

    expect(result.current[0]).toEqual({ kind: 'loading' })
  })

  it('starts in the success state immediately when a fresh cache exists', () => {
    vi.spyOn(githubApi, 'readCachedActivity').mockReturnValue(ACTIVITY)

    const { result } = renderHook(() => useGithubActivity())

    expect(result.current[0]).toEqual({ kind: 'success', data: ACTIVITY })
  })

  it('transitions to success once the fetch resolves', async () => {
    vi.spyOn(githubApi, 'fetchGithubActivity').mockResolvedValue(ACTIVITY)

    const { result } = renderHook(() => useGithubActivity())

    await waitFor(() => {
      expect(result.current[0]).toEqual({ kind: 'success', data: ACTIVITY })
    })
  })

  it('transitions to error when the fetch rejects', async () => {
    vi.spyOn(githubApi, 'fetchGithubActivity').mockRejectedValue(new Error('network down'))

    const { result } = renderHook(() => useGithubActivity())

    await waitFor(() => {
      expect(result.current[0]).toEqual({ kind: 'error' })
    })
  })

  it('retry re-enters the loading state and fetches again', async () => {
    const fetchSpy = vi
      .spyOn(githubApi, 'fetchGithubActivity')
      .mockRejectedValueOnce(new Error('first attempt fails'))
      .mockResolvedValueOnce(ACTIVITY)

    const { result } = renderHook(() => useGithubActivity())

    await waitFor(() => {
      expect(result.current[0]).toEqual({ kind: 'error' })
    })

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toEqual({ kind: 'loading' })

    await waitFor(() => {
      expect(result.current[0]).toEqual({ kind: 'success', data: ACTIVITY })
    })
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })
})
