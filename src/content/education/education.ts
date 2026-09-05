// Institution/provider names and course titles are language-neutral (proper
// nouns / citation-like). Program names are translated — see
// content/locales/{en,es}.json under `education.items.<id>.program`.
export type EducationItem = {
  readonly id: string
  readonly institution: string
  readonly startYear: number
  readonly endYear: number
}

export const education: readonly EducationItem[] = [
  { id: 'cesde', institution: 'CESDE', startYear: 2023, endYear: 2024 },
  { id: 'bernal', institution: 'I.E José María Bernal', startYear: 2016, endYear: 2021 },
]

export type Course = {
  readonly title: string
  readonly provider: string
}

export const courses: readonly Course[] = [
  { title: 'Angular: De cero a experto - Edición 2025', provider: 'Udemy' },
  { title: 'Principios SOLID y Clean Code', provider: 'Udemy' },
  { title: 'React: De cero a experto', provider: 'Udemy' },
  { title: 'TypeScript', provider: 'Udemy' },
]
