import { useCallback, useId, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { buildProjectPath } from '@/app/router/routes'
import { durations } from '@/core/motion/tokens'
import { fadeUpVariants, staggerContainerVariants } from '@/core/motion/variants'
import { getProjectMeta, getProjects } from '@/content/projects/projects'
import { Badge } from '@/design-system/Badge/Badge'
import { Modal } from '@/design-system/Modal/Modal'
import { Section } from '@/design-system/Section/Section'
import styles from './ProjectsSection.module.scss'

/** Renders project summaries and case-study navigation. */
export function ProjectsSection() {
  const { t } = useTranslation()
  const projects = getProjects()
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const titleId = useId()

  const closeModal = useCallback(() => {
    setOpenSlug(null)
  }, [])

  const openProject = openSlug ? getProjectMeta(openSlug) : undefined

  return (
    <Section id="projects" aria-labelledby="projects-heading">
      <h2 id="projects-heading">{t('projects.heading')}</h2>
      <p className={styles.note}>{t('projects.mock.note')}</p>

      <motion.ol className={styles.grid} variants={staggerContainerVariants}>
        {projects.map((project, index) => (
          <motion.li key={project.slug} variants={fadeUpVariants}>
            <motion.button
              type="button"
              className={styles.card}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: durations.fast }}
              onClick={() => {
                setOpenSlug(project.slug)
              }}
            >
              <span className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</span>
              <span className={styles.cardTitle}>{t(`projects.items.${project.slug}.title`)}</span>
              <span className={styles.cardSummary}>
                {t(`projects.items.${project.slug}.summary`)}
              </span>
              <span className={styles.tags}>
                {project.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </span>
            </motion.button>
          </motion.li>
        ))}
      </motion.ol>

      {openProject && (
        <Modal
          key={openProject.slug}
          onClose={closeModal}
          titleId={titleId}
          closeLabel={t('common.close')}
        >
          <h3 id={titleId}>{t(`projects.items.${openProject.slug}.title`)}</h3>
          <p className={styles.modalDescription}>
            {t(`projects.items.${openProject.slug}.description`)}
          </p>
          <span className={styles.tags}>
            {openProject.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </span>
          <Link to={buildProjectPath(openProject.slug)} className={styles.permalink}>
            {t('projects.modal.viewFullPage')}
          </Link>
        </Modal>
      )}
    </Section>
  )
}
