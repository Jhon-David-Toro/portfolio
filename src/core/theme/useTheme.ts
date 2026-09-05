import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'
const THEME_COLOR: Record<Theme, string> = { light: '#ffffff', dark: '#121214' }

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isTheme(stored) ? stored : null
  } catch {
    return null
  }
}

function applyThemeColorMeta(theme: Theme) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
}

/**
 * Binary light/dark theme, backed by `document.documentElement.dataset.theme`
 * (already wired into styles/themes/_dark.scss) and persisted to
 * localStorage once the user makes an explicit choice. Until then, this
 * mirrors the OS `prefers-color-scheme` live — matching the app's behavior
 * before this toggle existed.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(
    () => readStoredTheme() ?? (window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'),
  )

  useEffect(() => {
    if (readStoredTheme()) {
      return
    }

    const mediaQuery = window.matchMedia(DARK_QUERY)

    function handleChange(event: MediaQueryListEvent) {
      // No-op once the user has made an explicit choice since this listener
      // was attached — storage is the source of truth, checked every time.
      if (readStoredTheme()) {
        return
      }
      setThemeState(event.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    applyThemeColorMeta(theme)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Preference just won't persist across reloads — it still applies now.
    }
    setThemeState(next)
  }, [])

  return { theme, setTheme } as const
}
