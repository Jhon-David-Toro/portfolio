import { useCallback, useId, useState } from 'react'
import { m } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useSpotlight } from '@/core/dom/useSpotlight'
import { durations } from '@/core/motion/tokens'
import { fadeUpVariants, staggerContainerVariants } from '@/core/motion/variants'
import { getProjectMeta, getProjects } from '@/content/projects/projects'
import type { ProjectCategory, ProjectMeta } from '@/content/projects/project.types'
import { Badge } from '@/design-system/Badge/Badge'
import { Button } from '@/design-system/Button/Button'
import { Modal } from '@/design-system/Modal/Modal'
import { SectionNote } from '@/design-system/SectionNote/SectionNote'
import { Section } from '@/design-system/Section/Section'
import styles from './ProjectsSection.module.scss'

const IMAGE_WIDTH = 1200
const IMAGE_HEIGHT = 750
const categories: readonly ProjectCategory[] = ['app', 'api']

/** Renders project summaries (apps, then backend APIs) and case-study navigation. */
export function ProjectsSection() {
  const { t } = useTranslation()
  const projects = getProjects()
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const titleId = useId()
  const spotlight = useSpotlight()

  const closeModal = useCallback(() => {
    setOpenSlug(null)
  }, [])

  const openProject = openSlug ? getProjectMeta(openSlug) : undefined

  return (
    <Section id="projects" aria-labelledby="projects-heading">
      <h2 id="projects-heading">{t('projects.heading')}</h2>
      <SectionNote>{t('projects.mock.note')}</SectionNote>

      {categories.map((category) => {
        const group = projects.filter((project) => project.category === category)
        if (group.length === 0) return null
        const headingId = `projects-${category}-heading`
        return (
          <div key={category} className={styles.group} role="group" aria-labelledby={headingId}>
            <h3 id={headingId} className={styles.groupHeading}>
              {t(`projects.groups.${category === 'app' ? 'apps' : 'apis'}`)}
            </h3>
            <m.ol className={styles.grid} variants={staggerContainerVariants}>
              {group.map((project) => (
                <m.li key={project.slug} variants={fadeUpVariants}>
                  <m.button
                    type="button"
                    className={styles.card}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: durations.fast }}
                    onClick={() => {
                      setOpenSlug(project.slug)
                    }}
                    {...spotlight}
                  >
                    <ProjectVisual project={project} alt={t(`projects.items.${project.slug}.imageAlt`, { defaultValue: '' })} />
                    <span className={styles.cardNumber}>
                      {String(projects.indexOf(project) + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.cardTitle}>{t(`projects.items.${project.slug}.title`)}</span>
                    <span className={styles.cardSummary}>
                      {t(`projects.items.${project.slug}.summary`)}
                    </span>
                    <span className={styles.tags}>
                      {project.tags.map((tag) => (
                        <Badge key={tag}>{tag}</Badge>
                      ))}
                    </span>
                  </m.button>
                </m.li>
              ))}
            </m.ol>
          </div>
        )
      })}

      {openProject && (
        <Modal
          key={openProject.slug}
          onClose={closeModal}
          titleId={titleId}
          closeLabel={t('common.close')}
        >
          <h3 id={titleId}>{t(`projects.items.${openProject.slug}.title`)}</h3>
          <ProjectVisual
            project={openProject}
            alt={t(`projects.items.${openProject.slug}.imageAlt`, { defaultValue: '' })}
            large
          />
          <p className={styles.modalDescription}>
            {t(`projects.items.${openProject.slug}.description`)}
          </p>
          <span className={styles.tags}>
            {openProject.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </span>
          <div className={styles.links}>
            <Button
              href={openProject.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
            >
              {t('projects.links.repository')}
            </Button>
            {openProject.liveUrl && (
              <Button
                href={openProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                {t('projects.links.live')}
              </Button>
            )}
            {openProject.downloadUrl && (
              <Button
                href={openProject.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                {t('projects.links.release')}
              </Button>
            )}
          </div>
        </Modal>
      )}
    </Section>
  )
}

type ProjectVisualProps = {
  readonly project: ProjectMeta
  readonly alt: string
  readonly large?: boolean
}

/** A screenshot for apps, or a code-style list of real routes for APIs. */
function ProjectVisual({ project, alt, large = false }: ProjectVisualProps) {
  const className = large ? `${styles.visual} ${styles.visualLarge}` : styles.visual

  if (project.image) {
    return (
      <img
        className={className}
        src={project.image}
        alt={alt}
        width={IMAGE_WIDTH}
        height={IMAGE_HEIGHT}
        loading="lazy"
        decoding="async"
      />
    )
  }

  if (project.endpoints) {
    return (
      <pre className={`${className} ${styles.endpoints}`} aria-label="API endpoints">
        <code>{project.endpoints.join('\n')}</code>
      </pre>
    )
  }

  return null
}
