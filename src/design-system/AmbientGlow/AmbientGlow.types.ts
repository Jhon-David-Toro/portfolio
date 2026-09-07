/** Fixed set of placements AmbientGlow supports — see its module.scss. */
export type AmbientGlowPosition = 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

/** Props for `AmbientGlow`. */
export type AmbientGlowProps = {
  /** Where the bloom sits within its (relatively positioned) host section. */
  readonly position: AmbientGlowPosition
}
