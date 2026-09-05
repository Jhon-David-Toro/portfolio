import styles from './SkipLink.module.scss'

type SkipLinkProps = {
  readonly label: string
}

// Hidden until focused — the first Tab stop for keyboard users, letting them
// jump past the header/nav straight to the page content.
export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a href="#main-content" className={styles.skipLink}>
      {label}
    </a>
  )
}
