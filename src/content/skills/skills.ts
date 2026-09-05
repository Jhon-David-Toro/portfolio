// Technology names are proper nouns — same in every locale. Group labels are
// translated content — see content/locales/{en,es}.json under `skills.groups`.
export type SkillGroupId =
  | 'languagesFrameworks'
  | 'stylingData'
  | 'testingQuality'
  | 'toolsPractices'

export type SkillGroup = {
  readonly id: SkillGroupId
  readonly items: readonly string[]
}

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
