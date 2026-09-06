import { MotionConfig } from 'motion/react'
import { BrowserRouter } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AppRoutes } from './app/router/AppRoutes'
import { FocusOnNavigate } from './app/router/FocusOnNavigate'
import { ScrollToHash } from './app/router/ScrollToHash'
import { useSmoothScroll } from './core/scroll/useSmoothScroll'
import { AiAssistant } from './shared/layout/AiAssistant/AiAssistant'
import { Launcher } from './shared/layout/Launcher/Launcher'
import { SkipLink } from './shared/layout/SkipLink/SkipLink'
import { SiteFooter } from './shared/layout/SiteFooter/SiteFooter'
import { SiteHeader } from './shared/layout/SiteHeader/SiteHeader'
import { Terminal } from './shared/layout/Terminal/Terminal'

/** Renders the application shell, providers, navigation, and active route. */
function App() {
  const { t } = useTranslation()
  useSmoothScroll()

  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <SkipLink label={t('common.skipToContent')} />
        <ScrollToHash />
        <FocusOnNavigate />
        <SiteHeader />
        <Launcher />
        <AiAssistant />
        <Terminal />
        <main id="main-content" tabIndex={-1}>
          <AppRoutes />
        </main>
        <SiteFooter />
      </BrowserRouter>
    </MotionConfig>
  )
}

export default App
