import type { Variants } from 'motion/react'
import { durations, easings, staggerBase } from './tokens'

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: easings.standard },
  },
}

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.slow, ease: easings.standard },
  },
}

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.base, ease: easings.decelerate },
  },
}

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: staggerBase },
  },
}

/** Stagger container with a custom per-child delay — Hero/Experience/Projects want different paces. */
export function makeStagger(staggerChildren: number = staggerBase): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren },
    },
  }
}
