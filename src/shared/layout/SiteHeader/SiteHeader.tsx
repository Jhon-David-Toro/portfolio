import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { PORTFOLIO_SECTION_IDS } from '@/content/navigation/sections'
import { CV_FILE_PATH } from '@/content/profile/profile'
import { useActiveSection } from '@/core/scroll/useActiveSection'
import { cx } from '@/core/style/cx'
import { BottomNav } from '@/design-system/BottomNav/BottomNav'
import type { BottomNavItem } from '@/design-system/BottomNav/BottomNav.types'
import { Button } from '@/design-system/Button/Button'
import { Container } from '@/design-system/Container/Container'
import { Navigation } from '@/design-system/Navigation/Navigation'
import type { NavItem } from '@/design-system/Navigation/Navigation.types'
import { CommandPalette } from '@/shared/layout/CommandPalette/CommandPalette'
import styles from './SiteHeader.module.scss'

// 'hero' has no nav link of its own — it's tracked only so the brand mark can
// show as "active" while at the top of the page, instead of nothing being
// highlighted until the reader scrolls past it.
const SECTION_IDS = ['hero', ...PORTFOLIO_SECTION_IDS] as const

/** Renders the responsive site header and primary navigation surfaces. */
export function SiteHeader() {
  const { t } = useTranslation()
  const activeId = useActiveSection(SECTION_IDS)
  const isHeroActive = activeId === 'hero'

  const navItems: readonly NavItem[] = [
    { id: 'about', label: t('nav.about'), to: '/#about' },
    { id: 'experience', label: t('nav.experience'), to: '/#experience' },
    { id: 'education', label: t('nav.education'), to: '/#education' },
    { id: 'projects', label: t('nav.projects'), to: '/#projects' },
    { id: 'skills', label: t('nav.skills'), to: '/#skills' },
    { id: 'contact', label: t('nav.contact'), to: '/#contact' },
  ]

  // Curated subset for the mobile bottom nav — see BottomNav.tsx.
  const bottomNavItems: readonly BottomNavItem[] = [
    { id: 'about', label: t('nav.about'), to: '/#about', icon: 'about' },
    { id: 'experience', label: t('nav.experience'), to: '/#experience', icon: 'experience' },
    { id: 'projects', label: t('nav.projects'), to: '/#projects', icon: 'projects' },
    { id: 'skills', label: t('nav.skills'), to: '/#skills', icon: 'skills' },
    { id: 'contact', label: t('nav.contact'), to: '/#contact', icon: 'contact' },
  ]

  return (
    <>
      <header className={styles.header}>
        <Container>
          <div className={styles.row}>
            <Link
              to="/#hero"
              className={cx(styles.brand, isHeroActive && styles.active)}
              aria-current={isHeroActive ? 'location' : undefined}
            >
              JT
            </Link>

            <div className={styles.desktopNav}>
              <Navigation items={navItems} ariaLabel={t('nav.ariaLabel')} activeId={activeId} />
            </div>

            <div className={styles.controls}>
              <CommandPalette />
              <Button variant="secondary" href={CV_FILE_PATH} download className={styles.cvLink}>
                {t('nav.downloadCv')}
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <BottomNav items={bottomNavItems} activeId={activeId} ariaLabel={t('nav.bottomAriaLabel')} />
    </>
  )
}
