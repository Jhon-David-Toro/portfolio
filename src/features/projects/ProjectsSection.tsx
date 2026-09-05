import { motion } from 'motion/react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { buildProjectPath } from '../../app/router/routes'
import { fadeUpVariants, staggerContainerVariants } from '../../core/motion/variants'
import { getProjects } from '../../content/projects/projects'
import { Card } from '../../design-system/Card/Card'
import { Section } from '../../design-system/Section/Section'
import styles from './ProjectsSection.module.scss'

export function ProjectsSection() {
  const { t } = useTranslation()
  const projects = getProjects()

  return (
    <Section id="projects" aria-labelledby="projects-heading">
      <h2 id="projects-heading">{t('projects.heading')}</h2>
      <p className={styles.note}>{t('projects.mock.note')}</p>
      <motion.div className={styles.grid} variants={staggerContainerVariants}>
        {projects.map((project) => (
          <motion.div key={project.slug} variants={fadeUpVariants}>
            <Link to={buildProjectPath(project.slug)} className={styles.cardLink}>
              <Card>
                <h3>{t(`projects.items.${project.slug}.title`)}</h3>
                <p className={styles.summary}>{t(`projects.items.${project.slug}.summary`)}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
