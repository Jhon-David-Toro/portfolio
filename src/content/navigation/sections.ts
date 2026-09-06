/**
 * Canonical portfolio section ids, in page order — the single source of
 * truth previously copy-pasted (with `hero` sometimes included, sometimes
 * not) across SiteHeader, the command palette, and the terminal's `cd`
 * command.
 */
export const PORTFOLIO_SECTION_IDS = [
  'about',
  'experience',
  'education',
  'projects',
  'skills',
  'contact',
] as const

/** A navigable portfolio section id. */
export type PortfolioSectionId = (typeof PORTFOLIO_SECTION_IDS)[number]
