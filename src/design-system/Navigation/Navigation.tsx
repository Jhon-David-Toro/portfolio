import { Link } from 'react-router'
import styles from './Navigation.module.scss'

/** Destination and accessible label for a primary navigation entry. */
export type NavItem = {
  readonly id: string
  readonly label: string
  readonly to: string
}

/** Props accepted by the primary navigation component. */
type NavigationProps = {
  readonly items: readonly NavItem[]
  readonly ariaLabel: string
  readonly activeId?: string | null
}

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
                className={isActive ? `${styles.link} ${styles.active}` : styles.link}
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
