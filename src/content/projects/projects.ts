import type { ProjectMeta } from './project.types'

// Placeholder projects, standing in until real case studies are added.
// Tech tags are drawn from actual skills so the mocks stay plausible.
const projects: readonly ProjectMeta[] = [
  { slug: 'project-one', tags: ['React', 'TypeScript', 'GraphQL', 'MySQL'] },
  { slug: 'project-two', tags: ['Angular', 'RxJS', 'Node.js'] },
  { slug: 'project-three', tags: ['Lit Element', 'TypeScript', 'Cucumber'] },
]

export function getProjects(): readonly ProjectMeta[] {
  return projects
}

export function getProjectMeta(slug: string): ProjectMeta | undefined {
  return projects.find((project) => project.slug === slug)
}
