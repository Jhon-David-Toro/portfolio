import { useEffect, type RefObject } from 'react'

/**
 * Focuses `ref`'s element once `open` becomes true.
 *
 * @remarks
 * Waits a frame via `requestAnimationFrame` so the target has mounted/settled
 * (e.g. an `AnimatePresence` panel) before focus is applied.
 */
export function useFocusOnOpen(open: boolean, ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) {
      return
    }
    const frame = requestAnimationFrame(() => ref.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [open, ref])
}
