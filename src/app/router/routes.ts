// Route path constants, kept in one place so the router config and any link
// builders (e.g. project cards linking to their case study) can't drift apart.
export const ROUTE_PATHS = {
  home: '/',
  projectDetail: '/projects/:slug',
} as const

export function buildProjectPath(slug: string): string {
  return `/projects/${slug}`
}
