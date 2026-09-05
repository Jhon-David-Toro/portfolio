import { Link } from 'react-router'
import styles from './Navigation.module.scss'

export type NavItem = {
  readonly label: string
  readonly to: string
}

type NavigationProps = {
  readonly items: readonly NavItem[]
  readonly ariaLabel: string
}

export function Navigation({ items, ariaLabel }: NavigationProps) {
  return (
    <nav aria-label={ariaLabel}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.to}>
            <Link to={item.to} className={styles.link}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
