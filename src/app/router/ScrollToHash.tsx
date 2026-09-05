import { useEffect } from 'react'
import { useLocation } from 'react-router'

// Synchronizes browser scroll position with the URL hash. Needed because
// client-side navigation (e.g. from a project page back to `/#about`) does
// not trigger the browser's native scroll-to-anchor behavior the way a full
// page load does.
export function ScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      return
    }

    const target = document.querySelector(hash)
    if (!target) {
      return
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }, [hash])

  return null
}
