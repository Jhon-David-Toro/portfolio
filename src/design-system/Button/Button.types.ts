import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from 'react'
import type { Link } from 'react-router'

/** Visual treatments available for a button. */
export type ButtonVariant = 'primary' | 'secondary'

type ButtonOwnProps = {
  readonly variant?: ButtonVariant
  readonly className?: string
  readonly children: ReactNode
}

/** Renders as a native `<button>` — for actions (submit, click handlers). */
type ButtonAsButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    readonly to?: undefined
    readonly href?: undefined
  }

/** Renders as a router `<Link>` — for internal, in-app navigation. */
type ButtonAsLinkProps = ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, 'className' | 'children'> & {
    readonly href?: undefined
  }

/** Renders as a plain `<a>` — for external links, `mailto:`, and downloads. */
type ButtonAsAnchorProps = ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<'a'>, 'className' | 'children'> & {
    readonly to?: undefined
  }

/**
 * Props accepted by the shared button component.
 *
 * @remarks
 * Polymorphic by which of `to`/`href` is passed: a real action (`onClick`,
 * `type="submit"`) renders a `<button>`, an internal route renders a router
 * `<Link>`, and an external/`mailto:`/download URL renders a plain `<a>` —
 * so every CTA in the app gets correct link semantics for free instead of
 * every caller choosing between `<Button>` and a hand-styled `<a>`.
 */
export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps | ButtonAsAnchorProps

/** `ButtonProps` minus the fields `Button` destructures itself — what's left to spread onto the underlying element. */
export type ButtonRest = Omit<ButtonProps, 'variant' | 'className' | 'children'>
