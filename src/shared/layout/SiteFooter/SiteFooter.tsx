import { useTranslation } from 'react-i18next'
import { profile } from '../../../content/profile/profile'
import { Container } from '../../../design-system/Container/Container'
import styles from './SiteFooter.module.scss'

/** Renders the site-wide footer with copyright and direct contact links. */
export function SiteFooter() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.row}>
          <p className={styles.copyright}>
            © {year} {profile.name}. {t('footer.rights')}
          </p>

          <ul className={styles.links}>
            <li>
              <a className={styles.link} href={`mailto:${profile.email}`}>
                {t('footer.email')}
              </a>
            </li>
            <li>
              <a
                className={styles.link}
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('footer.github')}
              </a>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  )
}
