import type { ButtonHTMLAttributes, ReactNode } from 'react'

/** Visual treatments available for a button. */
export type ButtonVariant = 'primary' | 'secondary'

/** Props accepted by the shared button component. */
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly variant?: ButtonVariant
  readonly children: ReactNode
}
