import type { ButtonHTMLAttributes, ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router'
import { cx } from '@/core/style/cx'
import type { ButtonProps, ButtonRest } from './Button.types'
import styles from './Button.module.scss'

function hasTo(rest: ButtonRest): boolean {
  return 'to' in rest && rest.to !== undefined
}

function hasHref(rest: ButtonRest): boolean {
  return 'href' in rest && rest.href !== undefined
}

/** Renders a button as a native `<button>`, router `<Link>`, or `<a>` — picked by `to`/`href`. */
export function Button({ variant = 'primary', className, children, ...rest }: ButtonProps) {
  const classes = cx(styles.button, styles[variant], className)

  if (hasTo(rest)) {
    // Safe: hasTo() checks exactly what ButtonProps's union discriminates
    // on — TS just can't narrow a rest-spread from a boolean-returning check.
    const linkProps = rest as ComponentPropsWithoutRef<typeof Link>
    return (
      <Link className={classes} {...linkProps}>
        {children}
      </Link>
    )
  }

  if (hasHref(rest)) {
    const anchorProps = rest as ComponentPropsWithoutRef<'a'>
    return (
      <a className={classes} {...anchorProps}>
        {children}
      </a>
    )
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
