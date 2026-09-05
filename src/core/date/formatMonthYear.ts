/** Formats an ISO "yyyy-mm" string as a locale-aware "MMM yyyy" label. */
export function formatMonthYear(isoMonth: string, locale: string): string {
  const [year, month] = isoMonth.split('-').map(Number)
  const date = new Date(year, month - 1)
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(date)
}
