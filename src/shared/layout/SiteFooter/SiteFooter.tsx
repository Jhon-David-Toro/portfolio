import { useTranslation } from 'react-i18next'
import { profile } from '@/content/profile/profile'
import { useWebVitals } from '@/core/performance/useWebVitals'
import { Container } from '@/design-system/Container/Container'
import { formatMs, formatScore, formatSeconds } from './SiteFooter.helpers'
import styles from './SiteFooter.module.scss'

/** Renders the site-wide footer with copyright, contact links, and live Core Web Vitals. */
export function SiteFooter() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  const { lcp, cls, ttfb } = useWebVitals()

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

        <p className={styles.vitals}>
          <span className={styles.vitalsLabel}>{t('footer.vitalsLabel')}</span>
          <span title="Largest Contentful Paint">LCP {formatSeconds(lcp)}</span>
          <span aria-hidden="true">·</span>
          <span title="Cumulative Layout Shift">CLS {formatScore(cls)}</span>
          <span aria-hidden="true">·</span>
          <span title="Time to First Byte">TTFB {formatMs(ttfb)}</span>
        </p>
      </Container>
    </footer>
  )
}
