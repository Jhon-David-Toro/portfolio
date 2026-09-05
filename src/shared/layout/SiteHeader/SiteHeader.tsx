import { useTranslation } from 'react-i18next'
import { Container } from '../../../design-system/Container/Container'
import { LanguageSwitcher } from '../../../design-system/LanguageSwitcher/LanguageSwitcher'
import { Navigation, type NavItem } from '../../../design-system/Navigation/Navigation'
import styles from './SiteHeader.module.scss'

export function SiteHeader() {
  const { t } = useTranslation()

  // Anchors into the Home page's sections, plus a link back to `/` so the
  // header works the same whether you're on Home or a project case study.
  const navItems: readonly NavItem[] = [
    { label: t('nav.about'), to: '/#about' },
    { label: t('nav.experience'), to: '/#experience' },
    { label: t('nav.projects'), to: '/#projects' },
    { label: t('nav.skills'), to: '/#skills' },
    { label: t('nav.contact'), to: '/#contact' },
  ]

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.row}>
          <Navigation items={navItems} ariaLabel={t('nav.ariaLabel')} />
          <LanguageSwitcher />
        </div>
      </Container>
    </header>
  )
}
