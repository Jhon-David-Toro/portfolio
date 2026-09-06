import type { BadgeProps } from './Badge.types'
import styles from './Badge.module.scss'

/** Renders a compact label for metadata and taxonomy. */
export function Badge({ children }: BadgeProps) {
  return <span className={styles.badge}>{children}</span>
}
