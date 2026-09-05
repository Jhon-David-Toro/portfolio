import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Synchronizes browser scroll position and focus with the URL hash.
 *
 * @remarks
 * Client-side navigation does not trigger the browser's native anchor behavior,
 * so this component restores scrolling and focus for hash links.
 */
export function ScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      return
    }

    const target = document.querySelector<HTMLElement>(hash)
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
    target.focus({ preventScroll: true })
  }, [hash])

  return null
}
