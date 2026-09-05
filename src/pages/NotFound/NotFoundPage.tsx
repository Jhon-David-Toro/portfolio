import { useTranslation } from 'react-i18next'
import { usePageMeta } from '../../core/seo/usePageMeta'
import { profile } from '../../content/profile/profile'

// Rendered both for unmatched routes and for a project slug that doesn't
// exist yet — the app shell always owns the surrounding <main>, so this
// stays a plain section rather than another landmark.
export function NotFoundPage() {
  const { t } = useTranslation()
  usePageMeta(`${t('notFound.heading')} — ${profile.name}`)

  return (
    <section aria-labelledby="not-found-heading">
      <h1 id="not-found-heading">{t('notFound.heading')}</h1>
    </section>
  )
}
