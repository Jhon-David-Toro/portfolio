/** Real Core Web Vitals measured for the current page load, in their native units. */
export type WebVitals = {
  /** Largest Contentful Paint, in milliseconds. */
  readonly lcp: number | null
  /** Cumulative Layout Shift, unitless. */
  readonly cls: number | null
  /** Time to First Byte, in milliseconds. */
  readonly ttfb: number | null
}

/** A layout-shift entry's extra fields — not yet part of TypeScript's DOM lib. */
export type LayoutShiftEntry = PerformanceEntry & {
  readonly value: number
  readonly hadRecentInput: boolean
}
