import { useEffect } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { upsertMeta, usePageMeta } from '@/core/seo/usePageMeta'
import { profile } from '@/content/profile/profile'
import { Section } from '@/design-system/Section/Section'
import styles from './NotFoundPage.module.scss'

// Rendered for any unmatched route — the app shell always owns the
// surrounding header/footer, so this only needs to fill the space between.
/** Renders the fallback page for unknown routes. */
export function NotFoundPage() {
  const { t } = useTranslation()
  usePageMeta(`${t('notFound.heading')} — ${profile.name}`)

  // This route always responds with HTTP 200 (client-side routing has no
  // server to 404 with) — without this, search engines would index a "soft
  // 404" for every mistyped or removed URL.
  useEffect(() => {
    upsertMeta('name', 'robots', 'noindex')
    return () => upsertMeta('name', 'robots', 'index, follow')
  }, [])

  return (
    <Section aria-labelledby="not-found-heading" className={styles.section}>
      <p className={styles.eyebrow}>
        <span aria-hidden="true">$ </span>
        {t('notFound.eyebrow')}
        <span className={styles.cursor} aria-hidden="true" />
      </p>
      <p className={styles.code} aria-hidden="true">404</p>
      <h1 id="not-found-heading" className={styles.heading}>
        {t('notFound.heading')}
      </h1>
      <p className={styles.message}>{t('notFound.message')}</p>
      <Link to="/" className={styles.action}>
        {t('notFound.backHome')}
      </Link>
    </Section>
  )
}
