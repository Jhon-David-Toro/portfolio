import type { ReactNode } from 'react'
import styles from './Container.module.scss'

/** Props accepted by the shared responsive content container. */
type ContainerProps = {
  readonly children: ReactNode
}

/** Constrains page content to the shared readable width. */
export function Container({ children }: ContainerProps) {
  return <div className={styles.container}>{children}</div>
}
