import type { ReactNode } from 'react'
import styles from './Badge.module.scss'

type BadgeProps = {
  readonly children: ReactNode
}

export function Badge({ children }: BadgeProps) {
  return <span className={styles.badge}>{children}</span>
}
