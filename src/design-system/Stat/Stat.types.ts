import type { ReactNode } from 'react'

/** Visual size of a stat's value text. */
export type StatSize = 'md' | 'lg'

/** Props for a single stat item — a value with a small label beneath it. */
export type StatProps = {
  readonly value: ReactNode
  readonly label: string
  readonly size?: StatSize
}
