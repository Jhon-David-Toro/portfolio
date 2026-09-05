import { BrowserRouter } from 'react-router'
import { AppRoutes } from './app/router/AppRoutes'
import { ScrollToHash } from './app/router/ScrollToHash'
import { SiteHeader } from './shared/layout/SiteHeader/SiteHeader'

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <SiteHeader />
      <main>
        <AppRoutes />
      </main>
    </BrowserRouter>
  )
}

export default App
