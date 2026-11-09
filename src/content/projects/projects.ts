import type { ProjectMeta } from './project.types'

/**
 * Project metadata used by the portfolio project views.
 * Order: web front ends, then the desktop and Android apps, then the backend APIs.
 */
const projects: readonly ProjectMeta[] = [
  {
    slug: 'convet',
    category: 'app',
    tags: ['Next.js', 'React 19', 'TypeScript', 'SASS', 'Vitest'],
    repositoryUrl: 'https://github.com/Jhon-David-Toro/convet-website',
    liveUrl: 'https://convet-website.vercel.app/',
    image: '/projects/convet.jpg',
  },
  {
    slug: 'project-one',
    category: 'app',
    tags: ['Next.js', 'TypeScript', 'SASS', 'Zustand', 'Vitest'],
    repositoryUrl: 'https://github.com/Jhon-David-Toro/Ecommerce-CMS-FrontEnd',
    image: '/projects/ecommerce.jpg',
  },
  {
    slug: 'beacon-ui',
    category: 'app',
    tags: ['Lit 3', 'Web Components', 'TypeScript', 'SCSS', 'Vitest'],
    repositoryUrl: 'https://github.com/Jhon-David-Toro/beacon-ui',
    liveUrl: 'https://beacon-ui.doxel.dev',
    image: '/projects/Beacon-Ui.jpg',
  },
  {
    slug: 'matiz-studio',
    category: 'app',
    tags: ['Next.js', 'React 19', 'TypeScript', 'SCSS', 'Vitest'],
    repositoryUrl: 'https://github.com/Jhon-David-Toro/matiz-studio',
    liveUrl: 'https://matiz-studio.doxel.dev',
    image: '/projects/Matiz.png',
  },
  {
    slug: 'gymwarrior',
    category: 'app',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Drizzle', 'Zustand'],
    repositoryUrl: 'https://github.com/Jhon-David-Toro/GymWarrior',
    liveUrl: 'https://gymwarrior.doxel.dev/',
    image: '/projects/GymWarrior.png',
  },
  {
    slug: 'weather',
    category: 'app',
    tags: ['Angular 22', 'TypeScript', 'SCSS', 'Vitest', 'Open-Meteo'],
    repositoryUrl: 'https://github.com/Jhon-David-Toro/clima-app',
    liveUrl: 'hhttps://weather.doxel.dev/',
    image: '/projects/Weather.png',
  },
  {
    slug: 'project-three',
    category: 'app',
    tags: ['React', 'TypeScript', 'SASS', 'Redux', 'PayPal'],
    repositoryUrl: 'https://github.com/Jhon-David-Toro/StoreFrontEnd',
    liveUrl: 'https://store-front-end-ten.vercel.app/',
    image: '/projects/storefront.jpg',
  },
  {
    slug: 'project-two',
    category: 'app',
    tags: ['React', 'TypeScript', 'SASS', 'IndexedDB', 'Redux'],
    repositoryUrl: 'https://github.com/Jhon-David-Toro/todo-app',
    liveUrl: 'https://jhon-toro.github.io/todo-app/',
    image: '/projects/todo.jpg',
  },
  {
    slug: 'flix-desktop',
    category: 'app',
    tags: ['Kotlin', 'Compose Desktop', 'libmpv', 'Room', 'Coroutines'],
    repositoryUrl: 'https://github.com/Jhon-David-Toro/Flix-Desktop',
    downloadUrl: 'https://github.com/Jhon-David-Toro/Flix-Desktop/releases/latest',
    image: '/projects/flix-desktop.jpg',
  },
  {
    slug: 'flix-music',
    category: 'app',
    tags: ['Kotlin', 'Jetpack Compose', 'Media3', 'Room', 'Hilt'],
    repositoryUrl: 'https://github.com/Jhon-David-Toro/FlixMusic-App',
    downloadUrl: 'https://github.com/Jhon-David-Toro/FlixMusic-App/releases/latest',
    image: '/projects/flix-music.jpg',
  },
  {
    slug: 'api-ecommerce',
    category: 'api',
    tags: ['Java 21', 'Spring Boot', 'Spring Security', 'JWT', 'PostgreSQL', 'JPA'],
    repositoryUrl: 'https://github.com/Jhon-David-Toro/API-REST-JAVA-ECOMMERCE',
    endpoints: [
      'POST /api/auth/login',
      'GET  /api/public/products?q=&sort=&page=',
      'GET  /api/public/products/new-arrivals',
      '     /api/admin/products · /api/admin/users',
    ],
  },
  {
    slug: 'api-store',
    category: 'api',
    tags: ['Python', 'FastAPI', 'Uvicorn', 'PayPal', 'REST'],
    repositoryUrl: 'https://github.com/Jhon-David-Toro/StoreApi',
    endpoints: ['POST /auth/login', 'GET  /products/', 'POST /orders/', 'PUT  /orders/{id}/status'],
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
