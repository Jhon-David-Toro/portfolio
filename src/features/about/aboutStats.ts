import { experience } from '@/content/experience/experience'
import { skillGroups } from '@/content/skills/skills'

/** Headline numbers for the About section, derived from real content. */
export type AboutStats = {
  readonly yearsOfExperience: number
  readonly roleCount: number
  readonly technologyCount: number
}

const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25

function earliestStartDate(): Date {
  const timestamps = experience.map((item) => new Date(`${item.startDate}-01`).getTime())
  return new Date(Math.min(...timestamps))
}

/**
 * Computes About's headline stats from the same experience/skills content
 * shown elsewhere on the page, so they can never drift out of sync with it.
 */
export function computeAboutStats(): AboutStats {
  const yearsOfExperience = Math.floor((Date.now() - earliestStartDate().getTime()) / MS_PER_YEAR)
  const technologyCount = skillGroups.reduce((total, group) => total + group.items.length, 0)

  return {
    yearsOfExperience,
    roleCount: experience.length,
    technologyCount,
  }
}
