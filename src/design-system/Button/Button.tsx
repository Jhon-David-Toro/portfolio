import { cx } from '../../core/style/cx'
import type { ButtonProps } from './Button.types'
import styles from './Button.module.scss'

/** Renders a styled native button while preserving standard button attributes. */
export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  const classes = cx(styles.button, styles[variant], className)

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
