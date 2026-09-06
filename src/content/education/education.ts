import type { Course, EducationItem } from './education.types'

/** Education history ordered from the most recent entry. */
export const education: readonly EducationItem[] = [
  { id: 'cesde', institution: 'CESDE', startYear: 2023, endYear: 2024 },
  { id: 'bernal', institution: 'I.E José María Bernal', startYear: 2016, endYear: 2021 },
]

/** Additional courses displayed below formal education. */
export const courses: readonly Course[] = [
  { title: 'Angular: De cero a experto - Edición 2025', provider: 'Udemy' },
  { title: 'Principios SOLID y Clean Code', provider: 'Udemy' },
  { title: 'React: De cero a experto', provider: 'Udemy' },
  { title: 'TypeScript', provider: 'Udemy' },
]
