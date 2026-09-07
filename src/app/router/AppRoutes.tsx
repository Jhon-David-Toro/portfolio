import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { HomePage } from '@/pages/Home/HomePage'
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage'
import { ROUTE_PATHS } from './routes'

// Lazy: only visited via an explicit project-card click, never on first
// load — keeping it out of the main bundle shrinks what every visitor
// downloads just to see the home page.
const ProjectPage = lazy(() =>
  import('@/pages/Project/ProjectPage').then((module) => ({ default: module.ProjectPage })),
)

/** Renders the application route tree. */
export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTE_PATHS.home} element={<HomePage />} />
      <Route
        path={ROUTE_PATHS.projectDetail}
        element={
          <Suspense fallback={null}>
            <ProjectPage />
          </Suspense>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
