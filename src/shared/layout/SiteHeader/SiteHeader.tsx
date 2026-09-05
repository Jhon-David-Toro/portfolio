import { Container } from '../../../design-system/Container/Container'
import { Navigation, type NavItem } from '../../../design-system/Navigation/Navigation'
import styles from './SiteHeader.module.scss'

// Anchors into the Home page's sections, plus a link back to `/` so the
// header works the same whether you're on Home or a project case study.
const NAV_ITEMS: readonly NavItem[] = [
  { label: 'About', to: '/#about' },
  { label: 'Projects', to: '/#projects' },
  { label: 'Skills', to: '/#skills' },
  { label: 'Contact', to: '/#contact' },
]

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Container>
        <Navigation items={NAV_ITEMS} ariaLabel="Primary" />
      </Container>
    </header>
  )
}
