import { MotionConfig } from 'motion/react'
import { BrowserRouter } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AppRoutes } from './app/router/AppRoutes'
import { FocusOnNavigate } from './app/router/FocusOnNavigate'
import { ScrollToHash } from './app/router/ScrollToHash'
import { AiAssistant } from './shared/layout/AiAssistant/AiAssistant'
import { SettingsMenu } from './shared/layout/SettingsMenu/SettingsMenu'
import { SkipLink } from './shared/layout/SkipLink/SkipLink'
import { SiteFooter } from './shared/layout/SiteFooter/SiteFooter'
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
        <SettingsMenu />
        <AiAssistant />
        <main id="main-content" tabIndex={-1}>
          <AppRoutes />
        </main>
        <SiteFooter />
      </BrowserRouter>
    </MotionConfig>
  )
}

export default App
