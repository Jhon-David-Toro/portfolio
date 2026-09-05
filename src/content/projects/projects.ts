import type { ProjectMeta } from './project.types'

// Placeholder projects, standing in until real case studies are added.
// Their title/summary come from content/locales/{en,es}.json.
const projects: readonly ProjectMeta[] = [
  { slug: 'project-one' },
  { slug: 'project-two' },
  { slug: 'project-three' },
]

export function getProjects(): readonly ProjectMeta[] {
  return projects
}

export function projectExists(slug: string): boolean {
  return projects.some((project) => project.slug === slug)
}
