/** Structured employment entry displayed in the experience timeline. */
export type ExperienceItem = {
  readonly id: string
  readonly company: string
  readonly location: string
  readonly workMode: 'remote' | 'hybrid' | 'onsite'
  /** ISO year-month, e.g. "2025-08". */
  readonly startDate: string
  /** ISO year-month, or null for an ongoing role. */
  readonly endDate: string | null
}
