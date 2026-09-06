import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { getLenisInstance } from '@/core/scroll/lenisSingleton'
import type Lenis from 'lenis'

/** Scrolls `target` into view using Lenis when active, or native scroll otherwise. */
function scrollToTarget(target: HTMLElement, lenis: Lenis | null, prefersReducedMotion: boolean) {
  if (lenis) {
    lenis.scrollTo(target, { immediate: prefersReducedMotion })
    return
  }
  target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
}

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
 *
 * Depends on `key`, not just `hash`: React Router only changes `hash` when
 * its *value* changes, so re-clicking a link back to the section you're
 * already on (scrolled away without the hash changing, e.g. the Hero's
 * scroll cue) wouldn't otherwise re-run this effect. `key` is a fresh string
 * on every navigation, same hash or not, so every click scrolls.
 */
export function ScrollToHash() {
  const { hash, key } = useLocation()

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

    scrollToTarget(target, getLenisInstance(), prefersReducedMotion)
    target.focus({ preventScroll: true })
  }, [hash, key])

  return null
}
