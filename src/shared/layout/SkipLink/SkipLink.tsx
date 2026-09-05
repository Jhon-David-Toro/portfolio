import styles from './SkipLink.module.scss'

/** Props accepted by the keyboard navigation skip link. */
type SkipLinkProps = {
  readonly label: string
}

/** Renders the first keyboard stop for skipping site navigation. */
export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a href="#main-content" className={styles.skipLink}>
      {label}
    </a>
  )
}
