import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useDismissablePanel } from '@/core/dom/useDismissablePanel'
import { durations } from '@/core/motion/tokens'
import { LanguageSwitcher } from '@/design-system/LanguageSwitcher/LanguageSwitcher'
import { ThemeToggle } from '@/design-system/ThemeToggle/ThemeToggle'
import { ChatIcon } from '@/design-system/icons/ChatIcon'
import { GithubIcon } from '@/design-system/icons/GithubIcon'
import { SparkleIcon } from '@/design-system/icons/SparkleIcon'
import { TerminalIcon } from '@/design-system/icons/TerminalIcon'
import { dispatchOpenAssistant } from '@/shared/layout/AiAssistant/aiAssistantEvents'
import { dispatchOpenTerminal, TERMINAL_BACKGROUND_EVENT } from '@/shared/layout/Terminal/terminalEvents'
import type { LauncherTriggerProps } from './Launcher.types'
import styles from './Launcher.module.scss'

// Lazy: only visited via an explicit "Repositorios" click, never on first
// load, and it fetches live from GitHub's API — no reason to ship its code
// to every visitor just to see the home page.
const GithubReposModal = lazy(() =>
  import('@/shared/layout/GithubRepos/GithubReposModal').then((module) => ({
    default: module.GithubReposModal,
  })),
)

/** The floating ball button itself — its own rotate animation and resume badge. */
function LauncherTrigger({ open, terminalMinimized, label, onClick }: LauncherTriggerProps) {
  return (
    <motion.button
      type="button"
      className={styles.trigger}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label={label}
      animate={{ rotate: open ? 45 : 0 }}
      transition={{ duration: durations.fast }}
      onClick={onClick}
    >
      <SparkleIcon />
      {terminalMinimized && (
        <span className={styles.badge} aria-hidden="true">
          1
        </span>
      )}
    </motion.button>
  )
}

/**
 * Renders the single floating launcher ball (bottom-right) that replaces
 * separate triggers for the AI assistant, terminal, theme, and language —
 * clicking it reveals all of them in one small panel, rather than several
 * competing floating buttons fighting for screen space on mobile.
 */
export function Launcher() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [terminalMinimized, setTerminalMinimized] = useState(false)
  const [reposOpen, setReposOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const { wrapperRef, panelRef } = useDismissablePanel(open, close)

  useEffect(() => {
    function handleBackgroundEvent(event: Event) {
      setTerminalMinimized((event as CustomEvent<boolean>).detail)
    }
    window.addEventListener(TERMINAL_BACKGROUND_EVENT, handleBackgroundEvent)
    return () => window.removeEventListener(TERMINAL_BACKGROUND_EVENT, handleBackgroundEvent)
  }, [])

  function pick(dispatch: () => void) {
    dispatch()
    close()
  }

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <LauncherTrigger
        open={open}
        terminalMinimized={terminalMinimized}
        label={t('launcher.openLabel')}
        onClick={() => {
          setOpen((value) => !value)
        }}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            key="launcher-panel"
            ref={panelRef}
            className={styles.panel}
            role="dialog"
            aria-label={t('launcher.heading')}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: durations.fast }}
          >
            <button
              type="button"
              className={styles.actionItem}
              onClick={() => {
                pick(dispatchOpenAssistant)
              }}
            >
              <ChatIcon />
              {t('launcher.chatOption')}
            </button>
            <button
              type="button"
              className={styles.actionItem}
              onClick={() => {
                pick(dispatchOpenTerminal)
              }}
            >
              <TerminalIcon />
              {terminalMinimized ? t('launcher.continueTerminal') : t('launcher.terminalOption')}
            </button>
            <button
              type="button"
              className={styles.actionItem}
              onClick={() => {
                setReposOpen(true)
                close()
              }}
            >
              <GithubIcon />
              {t('launcher.reposOption')}
            </button>

            <hr className={styles.divider} />

            <ThemeToggle />
            <LanguageSwitcher />
          </motion.div>
        )}
      </AnimatePresence>

      {reposOpen && (
        <Suspense fallback={null}>
          <GithubReposModal
            onClose={() => {
              setReposOpen(false)
            }}
          />
        </Suspense>
      )}
    </div>
  )
}
