/** Route patterns shared by the router and link builders. */
export const ROUTE_PATHS = {
  home: '/',
  projectDetail: '/projects/:slug',
} as const

/**
 * Builds the canonical URL for a project case study.
 *
 * @param slug - URL-safe project identifier.
 * @returns The project detail path.
 */
export function buildProjectPath(slug: string): string {
  return `/projects/${slug}`
}
