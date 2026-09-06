type IconProps = {
  readonly className?: string
}

/** Renders the certificate/course-completion icon. */
export function BadgeCheckIcon({ className }: IconProps) {
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
      <path d="m12 2 2.4 1.4 2.77-.3 1.1 2.55 2.55 1.1-.3 2.77L22 12l-1.48 2.48.3 2.77-2.55 1.1-1.1 2.55-2.77-.3L12 22l-2.4-1.4-2.77.3-1.1-2.55-2.55-1.1.3-2.77L2 12l1.48-2.48-.3-2.77 2.55-1.1 1.1-2.55 2.77.3L12 2Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
