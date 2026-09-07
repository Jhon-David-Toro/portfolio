import type { IconProps } from './icon.types'

/** Renders a star icon used to display a repository's star count. */
export function StarIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.5l2.9 6.26L21 9.77l-4.5 4.4L17.8 21.5 12 18.27 6.2 21.5l1.3-7.33L3 9.77l6.1-1.01L12 2.5Z" />
    </svg>
  )
}
