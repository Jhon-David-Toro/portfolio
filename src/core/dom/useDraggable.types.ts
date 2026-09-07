/** On-screen position of a dragged element. */
export type Position = {
  readonly x: number
  readonly y: number
}

/** Tracks the in-progress drag gesture between pointerdown and pointerup. */
export type DragState = {
  readonly pointerId: number
  readonly offsetX: number
  readonly offsetY: number
}
