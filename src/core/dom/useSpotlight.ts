import { useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

/**
 * Tracks the pointer position over an element as CSS custom properties
 * (`--spotlight-x`/`--spotlight-y`, in px), driving a cursor-following glow
 * defined entirely in CSS (see abstracts/mixins' `spotlight-hover`). Written
 * straight to the DOM rather than React state — nothing needs to read the
 * glow's position back, so routing it through state would only cost a
 * render on every pointer move.
 *
 * The bounding rect is cached on pointer-enter and reused during move
 * instead of re-read on every event, so moving the mouse doesn't force a
 * layout read each time.
 */
export function useSpotlight() {
  const rectRef = useRef<DOMRect | null>(null)

  function handlePointerEnter(event: ReactPointerEvent<HTMLElement>) {
    rectRef.current = event.currentTarget.getBoundingClientRect()
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    const rect = rectRef.current
    if (!rect) {
      return
    }
    event.currentTarget.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`)
  }

  return { onPointerEnter: handlePointerEnter, onPointerMove: handlePointerMove }
}
