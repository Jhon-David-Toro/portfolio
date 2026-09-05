import type { Project } from './project.types'

// No case studies are written yet — Phase 3 populates this. The accessor
// below already gives pages a real, working contract to depend on.
const projects: readonly Project[] = []

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
