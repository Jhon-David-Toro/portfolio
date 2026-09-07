import { useCallback, useEffect, useState } from 'react'
import type { Theme, ThemeChangeOrigin } from './useTheme.types'

const STORAGE_KEY = 'theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
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

function persistTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch (error) {
    // Preference just won't persist across reloads — it still applies now.
    console.warn('Failed to persist theme preference:', error)
  }
}

function canAnimateThemeChange(): boolean {
  return typeof document.startViewTransition === 'function' && !window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function resolveRevealOrigin(origin: ThemeChangeOrigin | undefined): ThemeChangeOrigin {
  if (origin) {
    return origin
  }
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 }
}

// The circle must reach the viewport's farthest corner from the origin to
// fully cover the screen — a fixed percentage would clip on wide viewports
// when the origin sits near an edge instead of the center.
function distanceToFarthestCorner(origin: ThemeChangeOrigin): number {
  const x = Math.max(origin.x, window.innerWidth - origin.x)
  const y = Math.max(origin.y, window.innerHeight - origin.y)
  return Math.hypot(x, y)
}

// Read by the circular-reveal keyframes in styles/base/_view-transitions.scss.
function setRevealOrigin(origin: ThemeChangeOrigin): void {
  const root = document.documentElement.style
  root.setProperty('--theme-reveal-x', `${origin.x}px`)
  root.setProperty('--theme-reveal-y', `${origin.y}px`)
  root.setProperty('--theme-reveal-radius', `${distanceToFarthestCorner(origin)}px`)
}

/**
 * Provides the active theme and persists explicit user selections.
 *
 * @remarks
 * Binary light/dark theme, backed by `document.documentElement.dataset.theme`
 * (already wired into styles/themes/_dark.scss) and persisted to
 * localStorage once the user makes an explicit choice. Until then, this
 * mirrors the OS `prefers-color-scheme` live — matching the app's behavior
 * before this toggle existed.
 *
 * @returns The current theme and a setter that applies it to the document.
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

  const setTheme = useCallback((next: Theme, origin?: ThemeChangeOrigin) => {
    const applyChange = () => {
      document.documentElement.dataset.theme = next
      persistTheme(next)
      setThemeState(next)
    }

    if (!canAnimateThemeChange()) {
      applyChange()
      return
    }

    setRevealOrigin(resolveRevealOrigin(origin))
    document.startViewTransition(applyChange)
  }, [])

  return { theme, setTheme } as const
}
