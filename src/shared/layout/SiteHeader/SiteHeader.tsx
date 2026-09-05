import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useActiveSection } from '../../../core/scroll/useActiveSection'
import { BottomNav, type BottomNavItem } from '../../../design-system/BottomNav/BottomNav'
import { Container } from '../../../design-system/Container/Container'
import { Navigation, type NavItem } from '../../../design-system/Navigation/Navigation'
import styles from './SiteHeader.module.scss'

const SECTION_IDS = ['about', 'experience', 'education', 'projects', 'skills', 'contact'] as const

/** Renders the responsive site header and primary navigation surfaces. */
export function SiteHeader() {
  const { t } = useTranslation()
  const activeId = useActiveSection(SECTION_IDS)

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
            <Link to="/" className={styles.brand}>
              JT
            </Link>

            <div className={styles.desktopNav}>
              <Navigation items={navItems} ariaLabel={t('nav.ariaLabel')} activeId={activeId} />
            </div>

            <div className={styles.controls}>
              <a className={styles.cvLink} href="/jhon-toro-cv.pdf" download>
                {t('nav.downloadCv')}
              </a>
            </div>
          </div>
        </Container>
      </header>

      <BottomNav items={bottomNavItems} activeId={activeId} ariaLabel={t('nav.bottomAriaLabel')} />
    </>
  )
}
