import type { ContainerProps } from './Container.types'
import styles from './Container.module.scss'

/** Constrains page content to the shared readable width. */
export function Container({ children }: ContainerProps) {
  return <div className={styles.container}>{children}</div>
}
