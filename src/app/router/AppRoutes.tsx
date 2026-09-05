import { Route, Routes } from 'react-router'
import { HomePage } from '../../pages/Home/HomePage'
import { NotFoundPage } from '../../pages/NotFound/NotFoundPage'
import { ProjectPage } from '../../pages/Project/ProjectPage'
import { ROUTE_PATHS } from './routes'

/** Renders the application route tree. */
export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTE_PATHS.home} element={<HomePage />} />
      <Route path={ROUTE_PATHS.projectDetail} element={<ProjectPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
