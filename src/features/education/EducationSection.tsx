import { m } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { fadeUpVariants, staggerContainerVariants } from '@/core/motion/variants'
import { courses, education } from '@/content/education/education'
import { Section } from '@/design-system/Section/Section'
import { BadgeCheckIcon } from '@/design-system/icons/BadgeCheckIcon'
import { GraduationCapIcon } from '@/design-system/icons/GraduationCapIcon'
import styles from './EducationSection.module.scss'

/** Renders formal education and additional courses. */
export function EducationSection() {
  const { t } = useTranslation()

  return (
    <Section id="education" aria-labelledby="education-heading">
      <h2 id="education-heading">{t('education.heading')}</h2>
      <m.ul className={styles.list} variants={staggerContainerVariants}>
        {education.map((item) => (
          <m.li key={item.id} className={styles.item} variants={fadeUpVariants}>
            <span className={styles.icon} aria-hidden="true">
              <GraduationCapIcon />
            </span>
            <div className={styles.itemContent}>
              <h3 className={styles.program}>{t(`education.items.${item.id}.program`)}</h3>
              <p className={styles.meta}>
                {item.institution} · {item.startYear}–{item.endYear}
              </p>
            </div>
          </m.li>
        ))}
      </m.ul>

      <h3 className={styles.coursesHeading}>{t('education.coursesHeading')}</h3>
      <m.ul className={styles.courseGrid} variants={staggerContainerVariants}>
        {courses.map((course) => (
          <m.li key={course.title} className={styles.courseCard} variants={fadeUpVariants}>
            <BadgeCheckIcon className={styles.courseIcon} />
            <div className={styles.courseText}>
              <p className={styles.courseTitle}>{course.title}</p>
              <p className={styles.courseProvider}>{course.provider}</p>
            </div>
          </m.li>
        ))}
      </m.ul>
    </Section>
  )
}
