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

// Role titles and highlight bullets are translated content — see
// content/locales/{en,es}.json under `experience.items.<id>`.
export const experience: readonly ExperienceItem[] = [
  {
    id: 'epam',
    company: 'EPAM Systems',
    location: 'Bogotá, Colombia',
    workMode: 'remote',
    startDate: '2026-07',
    endDate: null,
  },
  {
    id: 'neoris',
    company: 'NEORIS',
    location: 'Bogotá, Colombia',
    workMode: 'remote',
    startDate: '2025-08',
    endDate: '2026-07',
  },
  {
    id: 'fisapay',
    company: 'Fisapay',
    location: 'Bogotá, Colombia',
    workMode: 'remote',
    startDate: '2025-05',
    endDate: null,
  },
  {
    id: 'emberalab',
    company: 'Emberalab',
    location: 'Medellín, Colombia',
    workMode: 'hybrid',
    startDate: '2024-09',
    endDate: '2025-05',
  },
]
