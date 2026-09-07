import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('defaults to light when nothing is stored and the OS has no dark preference', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('restores a previously persisted theme on mount', () => {
    localStorage.setItem('theme', 'dark')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
  })

  it('setTheme updates state, the document attribute, and persists the choice', () => {
    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.setTheme('dark')
    })

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('still applies the theme in memory if persisting to storage fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.setTheme('dark')
    })

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(warnSpy).toHaveBeenCalled()
  })

  it('ignores a malformed stored value and falls back to the default', () => {
    localStorage.setItem('theme', 'blue')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
  })
})
