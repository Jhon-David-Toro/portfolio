import { lazy, Suspense, useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { BrowserRouter } from 'react-router'
import { useTranslation } from 'react-i18next'
import { AppRoutes } from './app/router/AppRoutes'
import { FocusOnNavigate } from './app/router/FocusOnNavigate'
import { ScrollToHash } from './app/router/ScrollToHash'
import { useSmoothScroll } from './core/scroll/useSmoothScroll'
import { OPEN_ASSISTANT_EVENT } from './shared/layout/AiAssistant/aiAssistantEvents'
import { Launcher } from './shared/layout/Launcher/Launcher'
import { SkipLink } from './shared/layout/SkipLink/SkipLink'
import { SiteFooter } from './shared/layout/SiteFooter/SiteFooter'
import { SiteHeader } from './shared/layout/SiteHeader/SiteHeader'
import { isTypingInField } from './shared/layout/Terminal/Terminal.helpers'
import { OPEN_TERMINAL_EVENT } from './shared/layout/Terminal/terminalEvents'

// Both widgets are opt-in (opened via the Launcher menu, the command
// palette, or — for the terminal — a keyboard shortcut) and each pulls in
// its own real content (experience, education, projects, i18n copy) plus
// the /api/chat client, so most visits never need either. Lazy-loaded so
// that weight isn't part of everyone's initial bundle.
const AiAssistant = lazy(() =>
  import('./shared/layout/AiAssistant/AiAssistant').then((module) => ({ default: module.AiAssistant })),
)
const Terminal = lazy(() =>
  import('./shared/layout/Terminal/Terminal').then((module) => ({ default: module.Terminal })),
)

/** Renders the application shell, providers, navigation, and active route. */
function App() {
  const { t } = useTranslation()
  useSmoothScroll()
  const [assistantRequested, setAssistantRequested] = useState(false)
  const [terminalRequested, setTerminalRequested] = useState(false)

  // Each widget normally opens itself by listening for its own open-event
  // (see AiAssistant/Terminal). Before either has ever been requested, it
  // isn't mounted yet — so listens here instead, just long enough to decide
  // when to lazy-mount it. The event that arrives here is what the mounted
  // widget then replays via its own `initialOpen` prop, since this same
  // event won't still be "in flight" for its listener to catch.
  useEffect(() => {
    if (assistantRequested) {
      return
    }
    function requestAssistant() {
      setAssistantRequested(true)
    }
    window.addEventListener(OPEN_ASSISTANT_EVENT, requestAssistant)
    return () => window.removeEventListener(OPEN_ASSISTANT_EVENT, requestAssistant)
  }, [assistantRequested])

  useEffect(() => {
    if (terminalRequested) {
      return
    }
    function requestTerminal() {
      setTerminalRequested(true)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === '`' && !isTypingInField(event.target)) {
        requestTerminal()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener(OPEN_TERMINAL_EVENT, requestTerminal)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener(OPEN_TERMINAL_EVENT, requestTerminal)
    }
  }, [terminalRequested])

  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <SkipLink label={t('common.skipToContent')} />
        <ScrollToHash />
        <FocusOnNavigate />
        <SiteHeader />
        <Launcher />
        {assistantRequested && (
          <Suspense fallback={null}>
            <AiAssistant initialOpen />
          </Suspense>
        )}
        {terminalRequested && (
          <Suspense fallback={null}>
            <Terminal initialOpen />
          </Suspense>
        )}
        <main id="main-content" tabIndex={-1}>
          <AppRoutes />
        </main>
        <SiteFooter />
      </BrowserRouter>
    </MotionConfig>
  )
}

export default App
