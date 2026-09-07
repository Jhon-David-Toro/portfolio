import { Route, Routes } from 'react-router'
import { HomePage } from '@/pages/Home/HomePage'
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage'
import { ROUTE_PATHS } from './routes'

/** Renders the application route tree. */
export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTE_PATHS.home} element={<HomePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
