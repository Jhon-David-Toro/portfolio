type IconProps = {
  readonly className?: string
}

/** Renders the wrench icon for the tools & practices skill group. */
export function WrenchIcon({ className }: IconProps) {
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
      <path d="M14.7 6.3a4 4 0 0 0-5.4 4.6L3 17.2V21h3.8l6.3-6.3a4 4 0 0 0 4.6-5.4l-2.8 2.8-2.6-.6-.6-2.6 2.8-2.8Z" />
    </svg>
  )
}
