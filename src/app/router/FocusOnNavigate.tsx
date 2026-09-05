import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

// Moves focus to the main content landmark on a real page navigation (a
// pathname change), so screen-reader users get told the page changed — the
// browser only does this for free on a full page load, not client-side
// routing. Skipped on the first render (nothing "navigated" yet) and on
// hash-only changes (ScrollToHash already handles those).
export function FocusOnNavigate() {
  const { pathname, hash } = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (hash) {
      return
    }

    document.getElementById('main-content')?.focus()
  }, [pathname, hash])

  return null
}
