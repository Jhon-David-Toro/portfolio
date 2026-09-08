import type { ExperienceItem } from './experience.types'

/** Professional experience ordered from the most recent role. */
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
    location: 'Medellín, Colombia',
    workMode: 'onsite',
    startDate: '2025-05',
    endDate: '2025-08',
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
