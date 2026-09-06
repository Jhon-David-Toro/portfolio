import type Lenis from 'lenis'

// A plain module-level singleton rather than React context: the one
// consumer outside useSmoothScroll (ScrollToHash) needs an imperative
// escape hatch to trigger a scroll, not a reactive subscription to state —
// the same pattern already used for i18n's singleton instance.
let instance: Lenis | null = null

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis
}

export function getLenisInstance(): Lenis | null {
  return instance
}
