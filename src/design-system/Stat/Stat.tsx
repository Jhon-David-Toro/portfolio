import { cx } from '@/core/style/cx'
import type { StatProps } from './Stat.types'
import styles from './Stat.module.scss'

/**
 * Renders a single stat — a large value with a small label beneath it.
 *
 * @remarks
 * Renders an `<li>`: always place inside a `<ul>`/`<ol>` with its own
 * `display: grid` (or flex) wrapper — the grid/column layout is the
 * caller's concern, this only owns the item's own box.
 */
export function Stat({ value, label, size = 'lg' }: StatProps) {
  return (
    <li className={styles.stat}>
      <span className={cx(styles.value, size === 'md' && styles.valueMd)}>{value}</span>
      <span className={styles.label}>{label}</span>
    </li>
  )
}
