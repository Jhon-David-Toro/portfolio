const MEASURING = '—'

/** Formats a millisecond duration as whole seconds, e.g. "0.9s". */
export function formatSeconds(ms: number | null): string {
  return ms === null ? MEASURING : `${(ms / 1000).toFixed(1)}s`
}

/** Formats a millisecond duration as whole milliseconds, e.g. "42ms". */
export function formatMs(ms: number | null): string {
  return ms === null ? MEASURING : `${Math.round(ms)}ms`
}

/** Formats a unitless layout-shift score to two decimals, e.g. "0.00". */
export function formatScore(value: number | null): string {
  return value === null ? MEASURING : value.toFixed(2)
}
