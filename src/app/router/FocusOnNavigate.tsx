import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

/** Moves focus to the main content region after route navigation. */
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
