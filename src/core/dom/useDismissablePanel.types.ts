import type { RefObject } from 'react'

/** Refs to wire up a dismissable floating panel. */
export type DismissablePanel = {
  /** Wraps both the trigger and the panel — an outside click is anything outside this. */
  readonly wrapperRef: RefObject<HTMLDivElement | null>
  /** The panel itself — Tab is trapped between its first and last focusable descendants. */
  readonly panelRef: RefObject<HTMLDivElement | null>
}
