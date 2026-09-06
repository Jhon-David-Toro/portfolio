import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { usePageMeta } from '@/core/seo/usePageMeta'
import { profile } from '@/content/profile/profile'
import { getProjectMeta } from '@/content/projects/projects'
import type { ProjectMeta } from '@/content/projects/project.types'
import { Badge } from '@/design-system/Badge/Badge'
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage'

/** Builds the document title/description for a resolved project's case study. */
function buildProjectPageMeta(
  project: ProjectMeta | undefined,
  t: TFunction,
): { readonly title: string | null; readonly description: string | undefined } {
  if (!project) {
    return { title: null, description: undefined }
  }
  return {
    title: `${t(`projects.items.${project.slug}.title`)} — ${profile.name}`,
    description: t(`projects.items.${project.slug}.summary`),
  }
}

/** Renders a project case study resolved from the route slug. */
export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const project = slug ? getProjectMeta(slug) : undefined
  const meta = buildProjectPageMeta(project, t)

  usePageMeta(meta.title, meta.description)

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
