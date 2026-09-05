import type { ReactNode } from 'react'
import styles from './Badge.module.scss'

/** Props accepted by the compact badge component. */
type BadgeProps = {
  readonly children: ReactNode
}

/** Renders a compact label for metadata and taxonomy. */
export function Badge({ children }: BadgeProps) {
  return <span className={styles.badge}>{children}</span>
}
