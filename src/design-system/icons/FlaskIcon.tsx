type IconProps = {
  readonly className?: string
}

/** Renders the flask icon for the testing & quality skill group. */
export function FlaskIcon({ className }: IconProps) {
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
      <path d="M9 3h6" />
      <path d="M10 3v6.5L4.8 18a1.5 1.5 0 0 0 1.3 2.3h11.8a1.5 1.5 0 0 0 1.3-2.3L14 9.5V3" />
      <path d="M7.5 15h9" />
    </svg>
  )
}
