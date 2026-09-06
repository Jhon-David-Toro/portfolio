import { Link } from 'react-router'
import { cx } from '@/core/style/cx'
import { BriefcaseIcon } from '@/design-system/icons/BriefcaseIcon'
import { GridIcon } from '@/design-system/icons/GridIcon'
import { LayersIcon } from '@/design-system/icons/LayersIcon'
import { MailIcon } from '@/design-system/icons/MailIcon'
import { UserIcon } from '@/design-system/icons/UserIcon'
import type { BottomNavProps, IconName } from './BottomNav.types'
import styles from './BottomNav.module.scss'

const ICONS: Record<IconName, typeof UserIcon> = {
  about: UserIcon,
  experience: BriefcaseIcon,
  projects: GridIcon,
  skills: LayersIcon,
  contact: MailIcon,
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
                className={cx(styles.link, isActive && styles.active)}
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
