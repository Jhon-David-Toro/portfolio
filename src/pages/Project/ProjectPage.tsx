import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { projectExists } from '../../content/projects/projects'
import { NotFoundPage } from '../NotFound/NotFoundPage'

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()

  if (!slug || !projectExists(slug)) {
    return <NotFoundPage />
  }

  return (
    <article aria-labelledby="project-title">
      <h1 id="project-title">{t(`projects.items.${slug}.title`)}</h1>
      <p>{t(`projects.items.${slug}.summary`)}</p>
    </article>
  )
}
