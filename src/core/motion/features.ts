import { domMax } from 'motion/react'

/**
 * Loaded lazily via `LazyMotion`'s async `features` prop (see App.tsx), so
 * this — the actual gesture/layout/drag implementation code every `m.*`
 * component draws on — code-splits into its own chunk instead of bloating
 * the main bundle every visitor downloads up front. `domMax` (not the
 * smaller `domAnimation`) because ContactForm's submit button uses the
 * `layout` prop, which only `domMax` includes.
 */
export default domMax
