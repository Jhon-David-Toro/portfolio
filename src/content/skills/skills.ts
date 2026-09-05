/** Stable identifiers for translated skill categories. */
export type SkillGroupId =
  | 'languagesFrameworks'
  | 'stylingData'
  | 'testingQuality'
  | 'toolsPractices'

/** Group of related technologies shown in the skills section. */
export type SkillGroup = {
  readonly id: SkillGroupId
  readonly items: readonly string[]
}

/** Technology groups displayed in the skills section. */
export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'languagesFrameworks',
    items: ['TypeScript', 'React', 'Next.js', 'Angular', 'Lit Element', 'Java', 'Go', 'Node.js'],
  },
  {
    id: 'stylingData',
    items: ['Sass', 'GraphQL', 'MySQL', 'RxJS'],
  },
  {
    id: 'testingQuality',
    items: ['Cucumber', 'Unit Testing'],
  },
  {
    id: 'toolsPractices',
    items: ['Git', 'Jenkins', 'Scrum', 'Kanban'],
  },
]
