import type { SkipLinkProps } from './SkipLink.types'
import styles from './SkipLink.module.scss'

/** Renders the first keyboard stop for skipping site navigation. */
export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a href="#main-content" className={styles.skipLink}>
      {label}
    </a>
  )
}
