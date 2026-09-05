import type { Variants } from 'motion/react'
import { durations, easings, staggerBase } from './tokens'

/** Reveals content by fading it in while moving it upward. */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: easings.standard },
  },
}

/** Reveals content through opacity only. */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.slow, ease: easings.standard },
  },
}

/** Reveals content with a subtle scale transition. */
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.base, ease: easings.decelerate },
  },
}

/** Staggers direct children using the shared base delay. */
export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: staggerBase },
  },
}

/**
 * Creates a stagger container with a custom child delay.
 *
 * @param staggerChildren - Delay in seconds between child animations.
 * @returns Motion variants for a stagger container.
 */
export function makeStagger(staggerChildren: number = staggerBase): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren },
    },
  }
}
