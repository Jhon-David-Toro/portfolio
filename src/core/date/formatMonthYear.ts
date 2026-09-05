/**
 * Formats an ISO year-month value as a localized month and year label.
 *
 * @param isoMonth - Year-month value in `YYYY-MM` format.
 * @param locale - BCP 47 locale used by `Intl.DateTimeFormat`.
 * @returns The formatted month and year.
 */
export function formatMonthYear(isoMonth: string, locale: string): string {
  const [year, month] = isoMonth.split('-').map(Number)
  const date = new Date(year, month - 1)
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(date)
}
