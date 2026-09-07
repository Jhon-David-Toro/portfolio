import type Lenis from 'lenis'

/** Scrolls `target` into view using Lenis when active, or native scroll otherwise. */
export function scrollToTarget(target: HTMLElement, lenis: Lenis | null, prefersReducedMotion: boolean) {
  if (lenis) {
    lenis.scrollTo(target, { immediate: prefersReducedMotion })
    return
  }
  target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
}
