import type { TFunction } from 'i18next'
import { profile } from '@/content/profile/profile'
import type { ProjectMeta } from '@/content/projects/project.types'

/** Builds the document title/description for a resolved project's case study. */
export function buildProjectPageMeta(
  project: ProjectMeta | undefined,
  t: TFunction,
): { readonly title: string | null; readonly description: string | undefined } {
  if (!project) {
    return { title: null, description: undefined }
  }
  return {
    title: `${t(`projects.items.${project.slug}.title`)} — ${profile.name}`,
    description: t(`projects.items.${project.slug}.summary`),
  }
}
