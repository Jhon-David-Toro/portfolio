import type { ProjectMeta } from './project.types'

/** Project metadata used by the portfolio project views. */
const projects: readonly ProjectMeta[] = [
  { slug: 'project-one', tags: ['React', 'TypeScript', 'GraphQL', 'MySQL'] },
  { slug: 'project-two', tags: ['Angular', 'RxJS', 'Node.js'] },
  { slug: 'project-three', tags: ['Lit Element', 'TypeScript', 'Cucumber'] },
]

/** Returns the project metadata used by the projects section. */
export function getProjects(): readonly ProjectMeta[] {
  return projects
}

/**
 * Finds project metadata by its URL-safe slug.
 *
 * @param slug - Project identifier to look up.
 * @returns The matching project, or `undefined` when it does not exist.
 */
export function getProjectMeta(slug: string): ProjectMeta | undefined {
  return projects.find((project) => project.slug === slug)
}
