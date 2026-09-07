import { useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react'
import type { DragState, Position } from './useDraggable.types'

// How much of the window must stay reachable on-screen after a drag — a
// window dragged fully off-screen could never be grabbed again.
const MIN_VISIBLE_EDGE = 120

/** Reads an element's current box size, or `0x0` if it isn't mounted yet. */
function getElementSize(element: HTMLElement | null): { readonly width: number; readonly height: number } {
  if (!element) {
    return { width: 0, height: 0 }
  }
  return { width: element.offsetWidth, height: element.offsetHeight }
}

/**
 * Makes an element draggable by a designated handle, using pointer capture
 * rather than document-level listeners — the browser keeps delivering move/up
 * events to the handle even once the pointer leaves it.
 *
 * Starts with no explicit position (the caller's own CSS controls initial
 * placement, typically centered via `transform`); the first drag reads the
 * element's actual on-screen position via `getBoundingClientRect` and takes
 * over from there, so centering and dragging never fight over the same
 * `transform`.
 */
export function useDraggable(elementRef: RefObject<HTMLElement | null>) {
  const [position, setPosition] = useState<Position | null>(null)
  const dragState = useRef<DragState | null>(null)

  // Plain functions, not useCallback: dragHandleProps below is a fresh
  // object every render regardless, and the only consumer (Terminal's
  // title bar) is a native DOM element, so there's no memoized child or
  // effect dependency that would benefit from stable references here.
  function handlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    // Let clicks on the traffic-light buttons through without starting a drag.
    if ((event.target as HTMLElement).closest('button')) {
      return
    }

    const element = elementRef.current
    if (!element) {
      return
    }

    const rect = element.getBoundingClientRect()
    dragState.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    }
    setPosition({ x: rect.left, y: rect.top })
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    const drag = dragState.current
    if (!drag || drag.pointerId !== event.pointerId) {
      return
    }

    const { width, height } = getElementSize(elementRef.current)
    const minX = MIN_VISIBLE_EDGE - width
    const maxX = window.innerWidth - MIN_VISIBLE_EDGE
    const maxY = window.innerHeight - Math.min(MIN_VISIBLE_EDGE, height)

    setPosition({
      x: Math.min(Math.max(event.clientX - drag.offsetX, minX), maxX),
      y: Math.min(Math.max(event.clientY - drag.offsetY, 0), maxY),
    })
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLElement>) {
    if (dragState.current?.pointerId === event.pointerId) {
      dragState.current = null
    }
  }

  return {
    position,
    dragHandleProps: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
    },
  }
}
