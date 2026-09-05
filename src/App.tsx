import { MotionConfig } from 'motion/react'
import { BrowserRouter } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AppRoutes } from './app/router/AppRoutes'
import { FocusOnNavigate } from './app/router/FocusOnNavigate'
import { ScrollToHash } from './app/router/ScrollToHash'
import { SkipLink } from './shared/layout/SkipLink/SkipLink'
import { SiteHeader } from './shared/layout/SiteHeader/SiteHeader'

function App() {
  const { t } = useTranslation()

  return (
    // "user" makes every animation in the tree respect the OS-level
    // prefers-reduced-motion setting automatically — no per-component checks.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <SkipLink label={t('common.skipToContent')} />
        <ScrollToHash />
        <FocusOnNavigate />
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          <AppRoutes />
        </main>
      </BrowserRouter>
    </MotionConfig>
  )
}

export default App
