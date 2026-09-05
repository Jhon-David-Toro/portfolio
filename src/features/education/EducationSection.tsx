import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { fadeUpVariants, staggerContainerVariants } from '../../core/motion/variants'
import { courses, education } from '../../content/education/education'
import { Badge } from '../../design-system/Badge/Badge'
import { Section } from '../../design-system/Section/Section'
import styles from './EducationSection.module.scss'

/** Renders formal education and additional courses. */
export function EducationSection() {
  const { t } = useTranslation()

  return (
    <Section id="education" aria-labelledby="education-heading">
      <h2 id="education-heading">{t('education.heading')}</h2>
      <motion.ul className={styles.list} variants={staggerContainerVariants}>
        {education.map((item) => (
          <motion.li key={item.id} className={styles.item} variants={fadeUpVariants}>
            <h3 className={styles.program}>{t(`education.items.${item.id}.program`)}</h3>
            <p className={styles.meta}>
              {item.institution} · {item.startYear}–{item.endYear}
            </p>
          </motion.li>
        ))}
      </motion.ul>

      <h3 className={styles.coursesHeading}>{t('education.coursesHeading')}</h3>
      <ul className={styles.badgeList}>
        {courses.map((course) => (
          <li key={course.title}>
            <Badge>{course.title}</Badge>
          </li>
        ))}
      </ul>
    </Section>
  )
}
