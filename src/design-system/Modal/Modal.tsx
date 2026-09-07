import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { m } from 'motion/react'
import { trapTabFocus } from '@/core/dom/trapTabFocus'
import type { ModalProps } from './Modal.types'
import styles from './Modal.module.scss'

/**
 * Renders a focus-managed modal dialog.
 *
 * @remarks
 * The caller controls whether the modal is mounted; unmounting closes it.
 */
export function Modal({ onClose, titleId, closeLabel, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'Tab' && dialogRef.current) {
        trapTabFocus(event, dialogRef.current)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
      previouslyFocused?.focus()
    }
  }, [onClose])

  return createPortal(
    <m.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <m.div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label={closeLabel}>
          ×
        </button>
        {children}
      </m.div>
    </m.div>,
    document.body,
  )
}
