import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.scss'

/** Visual treatments available for a button. */
type ButtonVariant = 'primary' | 'secondary'

/** Props accepted by the shared button component. */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly variant?: ButtonVariant
  readonly children: ReactNode
}

/** Renders a styled native button while preserving standard button attributes. */
export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(' ')

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
