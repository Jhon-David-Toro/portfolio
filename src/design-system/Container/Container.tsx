import type { ReactNode } from 'react'
import styles from './Container.module.scss'

type ContainerProps = {
  readonly children: ReactNode
}

export function Container({ children }: ContainerProps) {
  return <div className={styles.container}>{children}</div>
}
