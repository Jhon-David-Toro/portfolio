import { useEffect, useState } from 'react'
import type { LayoutShiftEntry, WebVitals } from './useWebVitals.types'

/**
 * Measures this page load's real Core Web Vitals via the native
 * PerformanceObserver API — no client library. Each metric quietly stays
 * `null` on browsers that don't support its entry type (Safari and Firefox
 * don't expose `largest-contentful-paint`/`layout-shift` as of this writing).
 */
export function useWebVitals(): WebVitals {
  const [lcp, setLcp] = useState<number | null>(null)
  const [cls, setCls] = useState<number | null>(null)
  // Available synchronously from Navigation Timing (fixed once navigation
  // completes) — a lazy initializer, not an effect, since there's nothing to
  // subscribe to for this one.
  const [ttfb] = useState<number | null>(() => {
    const [navigationEntry] = performance.getEntriesByType(
      'navigation',
    ) as PerformanceNavigationTiming[]
    return navigationEntry ? navigationEntry.responseStart : null
  })

  useEffect(() => {
    const observers: PerformanceObserver[] = []

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          setLcp(lastEntry.startTime)
        }
      })
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
      observers.push(lcpObserver)
    } catch {
      // Entry type unsupported in this browser — lcp stays null.
    }

    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as LayoutShiftEntry[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            setCls(clsValue)
          }
        }
      })
      clsObserver.observe({ type: 'layout-shift', buffered: true })
      observers.push(clsObserver)
    } catch {
      // Entry type unsupported in this browser — cls stays null.
    }

    return () => {
      for (const observer of observers) {
        observer.disconnect()
      }
    }
  }, [])

  return { lcp, cls, ttfb }
}
