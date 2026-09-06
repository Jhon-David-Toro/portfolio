/** Destination and accessible label for a primary navigation entry. */
export type NavItem = {
  readonly id: string
  readonly label: string
  readonly to: string
}

/** Props accepted by the primary navigation component. */
export type NavigationProps = {
  readonly items: readonly NavItem[]
  readonly ariaLabel: string
  readonly activeId?: string | null
}
