/** Stable identifiers for translated skill categories. */
export type SkillGroupId = 'languagesFrameworks' | 'stylingData' | 'testingQuality' | 'toolsPractices'

/** Group of related technologies shown in the skills section. */
export type SkillGroup = {
  readonly id: SkillGroupId
  readonly items: readonly string[]
}
