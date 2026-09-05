import type { ReactNode } from 'react'
import styles from './Card.module.scss'

type CardProps = {
  readonly children: ReactNode
}

// Static container only — an interactive card gets its hover/focus affordance
// from whatever wraps it (e.g. a Link), not from Card itself.
export function Card({ children }: CardProps) {
  return <div className={styles.card}>{children}</div>
}
