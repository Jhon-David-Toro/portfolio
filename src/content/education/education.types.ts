/** Structured education entry displayed on the portfolio. */
export type EducationItem = {
  readonly id: string
  readonly institution: string
  readonly startYear: number
  readonly endYear: number
}

/** Completed course or certification entry. */
export type Course = {
  readonly title: string
  readonly provider: string
}
