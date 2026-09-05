import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { fadeUpVariants, staggerContainerVariants } from '../../core/motion/variants'
import { skillGroups } from '../../content/skills/skills'
import { Section } from '../../design-system/Section/Section'
import styles from './SkillsSection.module.scss'

/** Renders the grouped technology skills section. */
export function SkillsSection() {
  const { t } = useTranslation()

  return (
    <Section id="skills" aria-labelledby="skills-heading">
      <h2 id="skills-heading">{t('skills.heading')}</h2>
      <motion.div className={styles.groups} variants={staggerContainerVariants}>
        {skillGroups.map((group) => (
          <motion.div key={group.id} className={styles.group} variants={fadeUpVariants}>
            <h3 className={styles.groupLabel}>{t(`skills.groups.${group.id}`)}</h3>
            <ul className={styles.itemList}>
              {group.items.map((item) => (
                <li key={item} className={styles.item}>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  )
}
