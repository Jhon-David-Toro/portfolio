import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { getLenisInstance } from '../../core/scroll/lenisSingleton'

/**
 * Synchronizes browser scroll position and focus with the URL hash.
 *
 * @remarks
 * Client-side navigation does not trigger the browser's native anchor behavior,
 * so this component restores scrolling and focus for hash links. When Lenis
 * smooth scroll is active (see useSmoothScroll), it drives the scroll instead
 * of the native API so anchor jumps share the same inertia as the rest of
 * the page — Lenis reads the same `scroll-margin-top` CSS already keeping
 * sections clear of the sticky header, so the landing position matches
 * exactly either way.
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

    const lenis = getLenisInstance()
    if (lenis) {
      lenis.scrollTo(target, { immediate: prefersReducedMotion })
    } else {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    }
    target.focus({ preventScroll: true })
  }, [hash])

  return null
}
