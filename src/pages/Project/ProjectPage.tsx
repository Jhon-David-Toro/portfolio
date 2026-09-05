import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { getProjectMeta } from '../../content/projects/projects'
import { Badge } from '../../design-system/Badge/Badge'
import { NotFoundPage } from '../NotFound/NotFoundPage'

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const project = slug ? getProjectMeta(slug) : undefined

  if (!project) {
    return <NotFoundPage />
  }

  return (
    <article aria-labelledby="project-title">
      <h1 id="project-title">{t(`projects.items.${project.slug}.title`)}</h1>
      <p>{t(`projects.items.${project.slug}.description`)}</p>
      <ul>
        {project.tags.map((tag) => (
          <li key={tag}>
            <Badge>{tag}</Badge>
          </li>
        ))}
      </ul>
    </article>
  )
}
