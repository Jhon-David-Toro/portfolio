import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { durations } from '../../../core/motion/tokens'
import { GearIcon } from '../../../design-system/icons/GearIcon'
import { LanguageSwitcher } from '../../../design-system/LanguageSwitcher/LanguageSwitcher'
import { ThemeToggle } from '../../../design-system/ThemeToggle/ThemeToggle'
import styles from './SettingsMenu.module.scss'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/**
 * Renders the floating settings trigger (gear FAB) and its theme/language
 * popover — bottom-left on desktop, top-left under the header on mobile.
 */
export function SettingsMenu() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const previouslyFocused = document.activeElement as HTMLElement | null
    panelRef.current?.focus()

    function handlePointerDown(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return
      }

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusable.length === 0) {
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [open])

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <motion.button
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t('settings.openLabel')}
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ duration: durations.fast }}
        onClick={() => {
          setOpen((value) => !value)
        }}
      >
        <GearIcon />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="settings-panel"
            ref={panelRef}
            className={styles.panel}
            role="dialog"
            aria-label={t('settings.heading')}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: durations.fast }}
          >
            <p className={styles.panelLabel}>{t('settings.themeLabel')}</p>
            <ThemeToggle />
            <p className={styles.panelLabel}>{t('settings.languageLabel')}</p>
            <LanguageSwitcher />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
