/** Shared animation durations in seconds. */
export const durations = {
  fast: 0.12,
  base: 0.2,
  slow: 0.32,
  slower: 0.48,
} as const

/** Shared cubic-bezier curves for Motion animations. */
export const easings = {
  standard: [0.4, 0, 0.2, 1],
  decelerate: [0, 0, 0.2, 1],
  accelerate: [0.4, 0, 1, 1],
} as const

/** Default delay between children in a staggered animation. */
export const staggerBase = 0.08
