import { useParams } from 'react-router'
import { getProjectBySlug } from '../../content/projects/projects'
import { NotFoundPage } from '../NotFound/NotFoundPage'

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  if (!project) {
    return <NotFoundPage />
  }

  return (
    <article aria-labelledby="project-title">
      <h1 id="project-title">{project.title}</h1>
      <p>{project.summary}</p>
    </article>
  )
}
