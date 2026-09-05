// Canonical motion values for JS/Motion usage — kept in sync by hand with
// styles/tokens/_motion.scss (Sass custom properties can't be read from JS
// without a runtime lookup, and a codegen step isn't worth it for ~6 values).
//
// Preference order for any new animation in this app:
//   1. CSS transitions/animations — the default, use unless it can't do the job
//   2. Motion (this app's only animation dependency) — for orchestration,
//      viewport-triggered reveals, scroll-linked values
//   3. GSAP — not installed; nothing in this app has needed it
//   4. WebGL/Three.js — not installed; revisit only once real project
//      imagery exists to justify the bundle cost
//
// Lesson learned the hard way: do NOT wrap exit animations in
// <AnimatePresence> without proving out completion-tracking first — an
// AnimatePresence-driven Modal exit here once left an invisible,
// click-blocking backdrop stuck in the DOM forever (see design-system/Modal).
// Prefer immediate unmount + entrance-only animation unless you've verified
// the exit actually completes.
export const durations = {
  fast: 0.12,
  base: 0.2,
  slow: 0.32,
  slower: 0.48,
} as const

export const easings = {
  standard: [0.4, 0, 0.2, 1],
  decelerate: [0, 0, 0.2, 1],
  accelerate: [0.4, 0, 1, 1],
} as const

export const staggerBase = 0.08
