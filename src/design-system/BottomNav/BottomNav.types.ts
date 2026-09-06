/** Icon keys recognized by the mobile bottom navigation. */
export type IconName = 'about' | 'experience' | 'projects' | 'skills' | 'contact'

/** Destination, label, and icon for a mobile navigation entry. */
export type BottomNavItem = {
  readonly id: string
  readonly to: string
  readonly label: string
  readonly icon: IconName
}

/** Props accepted by the mobile bottom navigation surface. */
export type BottomNavProps = {
  readonly items: readonly BottomNavItem[]
  readonly activeId: string | null
  readonly ariaLabel: string
}
