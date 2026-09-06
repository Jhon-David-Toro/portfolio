import { useEffect, useRef, type RefObject } from 'react'
import { trapTabFocus } from './trapTabFocus'

/** Refs to wire up a dismissable floating panel. */
export type DismissablePanel = {
  /** Wraps both the trigger and the panel — an outside click is anything outside this. */
  readonly wrapperRef: RefObject<HTMLDivElement | null>
  /** The panel itself — Tab is trapped between its first and last focusable descendants. */
  readonly panelRef: RefObject<HTMLDivElement | null>
}

/**
 * Shared behavior for a floating, anchored popover panel (settings menu,
 * launcher, chat widget): closes on Escape or a click outside `wrapperRef`,
 * and traps Tab focus inside `panelRef` while open.
 *
 * @param open - Whether the panel is currently open.
 * @param onClose - Called to close the panel (Escape, outside click).
 */
export function useDismissablePanel(open: boolean, onClose: () => void): DismissablePanel {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    function handlePointerDown(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'Tab' && panelRef.current) {
        trapTabFocus(event, panelRef.current)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  return { wrapperRef, panelRef }
}
