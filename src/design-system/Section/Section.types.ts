import type { ReactNode } from 'react'

/** Props for a motion-enabled, constrained page section. */
export type SectionProps = {
  readonly id?: string
  readonly children: ReactNode
  /** Extra class appended after the base section styles — for a rare,
   * genuine per-section layout need (e.g. the Hero filling the viewport). */
  readonly className?: string
  readonly 'aria-label'?: string
  readonly 'aria-labelledby'?: string
}
