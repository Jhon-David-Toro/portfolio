import type { SkillGroup } from './skills.types'

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
