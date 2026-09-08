import type { ProjectMeta } from './project.types'

/** Project metadata used by the portfolio project views. */
const projects: readonly ProjectMeta[] = [
  {
    slug: 'project-one',
    tags: ['Next.js', 'TypeScript', 'SASS', 'Strapi'],
    repositoryUrl: 'https://github.com/Jhon-Toro/Ecommerce-CMS-FrontEnd',
    liveUrl: 'https://shop.labs-develop.cloud/',
  },
  {
    slug: 'project-two',
    tags: ['React', 'TypeScript', 'SASS', 'IndexedDB', 'Redux'],
    repositoryUrl: 'https://github.com/Jhon-Toro/todo-app',
    liveUrl: 'https://jhon-toro.github.io/todo-app/',
  },
  {
    slug: 'project-three',
    tags: ['React', 'TypeScript', 'SASS', 'Redux', 'PayPal'],
    repositoryUrl: 'https://github.com/Jhon-Toro/StoreFrontEnd',
    liveUrl: 'https://store-front-end-ten.vercel.app/',
  },
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
