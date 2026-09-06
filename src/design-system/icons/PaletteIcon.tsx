type IconProps = {
  readonly className?: string
}

/** Renders the palette icon for the styling & data skill group. */
export function PaletteIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3a9 8 0 0 0 0 16c1 0 1.3-.7.9-1.4-.3-.5-.1-1.1.4-1.3.5-.2 1 0 1.4.3.6.5 1.4.2 1.7-.5A9 8 0 0 0 12 3Z" />
      <circle cx="8" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}
