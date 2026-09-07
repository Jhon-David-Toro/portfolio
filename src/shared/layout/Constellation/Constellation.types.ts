/** A single drifting point in the constellation background. */
export type Particle = {
  x: number
  y: number
  vx: number
  vy: number
}

/** Canvas-local pointer position, used to link nearby particles to the cursor. */
export type PointerPosition = {
  x: number
  y: number
}
