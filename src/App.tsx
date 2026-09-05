import { MotionConfig } from 'motion/react'
import { BrowserRouter } from 'react-router'
import { AppRoutes } from './app/router/AppRoutes'
import { ScrollToHash } from './app/router/ScrollToHash'
import { SiteHeader } from './shared/layout/SiteHeader/SiteHeader'

function App() {
  return (
    // "user" makes every animation in the tree respect the OS-level
    // prefers-reduced-motion setting automatically — no per-component checks.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ScrollToHash />
        <SiteHeader />
        <main>
          <AppRoutes />
        </main>
      </BrowserRouter>
    </MotionConfig>
  )
}

export default App
