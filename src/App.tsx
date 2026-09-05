import { MotionConfig } from 'motion/react'
import { BrowserRouter } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AppRoutes } from './app/router/AppRoutes'
import { FocusOnNavigate } from './app/router/FocusOnNavigate'
import { ScrollToHash } from './app/router/ScrollToHash'
import { SkipLink } from './shared/layout/SkipLink/SkipLink'
import { SiteHeader } from './shared/layout/SiteHeader/SiteHeader'

/** Renders the application shell, providers, navigation, and active route. */
function App() {
  const { t } = useTranslation()

  return (
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
