import { useEffect, useRef } from 'react'
import { trapTabFocus } from './trapTabFocus'
import type { DismissablePanel } from './useDismissablePanel.types'

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
