import { useTranslation } from 'react-i18next'
import { profile } from '@/content/profile/profile'
import { useWebVitals } from '@/core/performance/useWebVitals'
import { Container } from '@/design-system/Container/Container'
import styles from './SiteFooter.module.scss'

const MEASURING = '—'

/** Formats a millisecond duration as whole seconds, e.g. "0.9s". */
function formatSeconds(ms: number | null): string {
  return ms === null ? MEASURING : `${(ms / 1000).toFixed(1)}s`
}

/** Formats a millisecond duration as whole milliseconds, e.g. "42ms". */
function formatMs(ms: number | null): string {
  return ms === null ? MEASURING : `${Math.round(ms)}ms`
}

/** Formats a unitless layout-shift score to two decimals, e.g. "0.00". */
function formatScore(value: number | null): string {
  return value === null ? MEASURING : value.toFixed(2)
}

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
