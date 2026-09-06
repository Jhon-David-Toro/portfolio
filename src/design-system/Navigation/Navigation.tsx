import { Link } from 'react-router'
import { cx } from '../../core/style/cx'
import type { NavigationProps } from './Navigation.types'
import styles from './Navigation.module.scss'

/** Renders the primary navigation and marks the active destination. */
export function Navigation({ items, ariaLabel, activeId }: NavigationProps) {
  return (
    <nav className={styles.nav} aria-label={ariaLabel}>
      <ul className={styles.list}>
        {items.map((item) => {
          const isActive = item.id === activeId

          return (
            <li key={item.id}>
              <Link
                to={item.to}
                className={cx(styles.link, isActive && styles.active)}
                aria-current={isActive ? 'location' : undefined}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
