import { Link } from 'react-router'
import { BriefcaseIcon } from '../icons/BriefcaseIcon'
import { GridIcon } from '../icons/GridIcon'
import { LayersIcon } from '../icons/LayersIcon'
import { MailIcon } from '../icons/MailIcon'
import { UserIcon } from '../icons/UserIcon'
import styles from './BottomNav.module.scss'

type IconName = 'about' | 'experience' | 'projects' | 'skills' | 'contact'

/** Destination, label, and icon for a mobile navigation entry. */
export type BottomNavItem = {
  readonly id: string
  readonly to: string
  readonly label: string
  readonly icon: IconName
}

const ICONS: Record<IconName, typeof UserIcon> = {
  about: UserIcon,
  experience: BriefcaseIcon,
  projects: GridIcon,
  skills: LayersIcon,
  contact: MailIcon,
}

/** Props accepted by the mobile bottom navigation surface. */
type BottomNavProps = {
  readonly items: readonly BottomNavItem[]
  readonly activeId: string | null
  readonly ariaLabel: string
}

/** Renders the mobile-only bottom navigation with an active destination. */
export function BottomNav({ items, activeId, ariaLabel }: BottomNavProps) {
  return (
    <nav className={styles.nav} aria-label={ariaLabel}>
      <ul className={styles.list}>
        {items.map((item) => {
          const Icon = ICONS[item.icon]
          const isActive = item.id === activeId

          return (
            <li key={item.id} className={styles.item}>
              <Link
                to={item.to}
                className={isActive ? `${styles.link} ${styles.active}` : styles.link}
                aria-label={item.label}
                aria-current={isActive ? 'location' : undefined}
              >
                <span className={styles.iconWrap}>
                  <Icon />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
