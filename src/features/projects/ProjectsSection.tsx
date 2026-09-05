import { useCallback, useId, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { buildProjectPath } from '../../app/router/routes'
import { fadeUpVariants, staggerContainerVariants } from '../../core/motion/variants'
import { getProjectMeta, getProjects } from '../../content/projects/projects'
import { Badge } from '../../design-system/Badge/Badge'
import { Card } from '../../design-system/Card/Card'
import { Modal } from '../../design-system/Modal/Modal'
import { Section } from '../../design-system/Section/Section'
import styles from './ProjectsSection.module.scss'

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
      <motion.div className={styles.grid} variants={staggerContainerVariants}>
        {projects.map((project) => (
          <motion.div key={project.slug} variants={fadeUpVariants}>
            <button
              type="button"
              className={styles.cardButton}
              onClick={() => {
                setOpenSlug(project.slug)
              }}
            >
              <Card>
                <h3>{t(`projects.items.${project.slug}.title`)}</h3>
                <p className={styles.summary}>{t(`projects.items.${project.slug}.summary`)}</p>
                <ul className={styles.tags}>
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <Badge>{tag}</Badge>
                    </li>
                  ))}
                </ul>
              </Card>
            </button>
          </motion.div>
        ))}
      </motion.div>

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
          <ul className={styles.tags}>
            {openProject.tags.map((tag) => (
              <li key={tag}>
                <Badge>{tag}</Badge>
              </li>
            ))}
          </ul>
          <Link to={buildProjectPath(openProject.slug)} className={styles.permalink}>
            {t('projects.modal.viewFullPage')}
          </Link>
        </Modal>
      )}
    </Section>
  )
}
