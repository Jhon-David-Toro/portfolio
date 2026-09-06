import { useEffect } from 'react'
import Lenis from 'lenis'
import { setLenisInstance } from './lenisSingleton'

/**
 * Wires up Lenis's inertia-based smooth scrolling for the whole app.
 *
 * Lenis still moves the real `window` scroll position every frame (it does
 * not virtualize scrolling behind a transformed wrapper), so everything
 * already listening for native scroll/IntersectionObserver — the active-nav
 * highlight, the Experience timeline, Framer Motion's own scroll hooks —
 * keeps working unmodified.
 *
 * Skipped entirely under prefers-reduced-motion: native scrolling stays in
 * charge.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      allowNestedScroll: true,
    })
    setLenisInstance(lenis)

    let frame = 0
    function raf(time: number) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      setLenisInstance(null)
    }
  }, [])
}
