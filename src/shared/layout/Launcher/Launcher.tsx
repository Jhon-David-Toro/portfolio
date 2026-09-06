import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useDismissablePanel } from '@/core/dom/useDismissablePanel'
import { durations } from '@/core/motion/tokens'
import { LanguageSwitcher } from '@/design-system/LanguageSwitcher/LanguageSwitcher'
import { ThemeToggle } from '@/design-system/ThemeToggle/ThemeToggle'
import { ChatIcon } from '@/design-system/icons/ChatIcon'
import { SparkleIcon } from '@/design-system/icons/SparkleIcon'
import { TerminalIcon } from '@/design-system/icons/TerminalIcon'
import { dispatchOpenAssistant } from '@/shared/layout/AiAssistant/aiAssistantEvents'
import { dispatchOpenTerminal, TERMINAL_BACKGROUND_EVENT } from '@/shared/layout/Terminal/terminalEvents'
import styles from './Launcher.module.scss'

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
      <motion.button
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t('launcher.openLabel')}
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ duration: durations.fast }}
        onClick={() => {
          setOpen((value) => !value)
        }}
      >
        <SparkleIcon />
        {terminalMinimized && (
          <span className={styles.badge} aria-hidden="true">
            1
          </span>
        )}
      </motion.button>

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

            <hr className={styles.divider} />

            <ThemeToggle />
            <LanguageSwitcher />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
