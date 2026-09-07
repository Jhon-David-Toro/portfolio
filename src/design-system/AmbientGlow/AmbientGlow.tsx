import { cx } from '@/core/style/cx'
import type { AmbientGlowPosition, AmbientGlowProps } from './AmbientGlow.types'
import styles from './AmbientGlow.module.scss'

const POSITION_CLASSES: Record<AmbientGlowPosition, string> = {
  center: styles.center,
  'top-left': styles.topLeft,
  'top-right': styles.topRight,
  'bottom-left': styles.bottomLeft,
  'bottom-right': styles.bottomRight,
}

/**
 * A soft, static blurred accent bloom — adds atmospheric depth to a section
 * without competing with its content. Purely decorative (`aria-hidden`) and
 * static (no animation), so it costs nothing beyond one composited paint.
 * `position` picks one of a fixed set of presets defined entirely in
 * AmbientGlow.module.scss — call sites never write their own position/size
 * overrides, only the host section needs `position: relative; overflow:
 * hidden` (Section already provides both).
 */
export function AmbientGlow({ position }: AmbientGlowProps) {
  return <span className={cx(styles.glow, POSITION_CLASSES[position])} aria-hidden="true" />
}
