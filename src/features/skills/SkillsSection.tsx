import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { fadeUpVariants, staggerContainerVariants } from '../../core/motion/variants'
import { skillGroups } from '../../content/skills/skills'
import type { SkillGroupId } from '../../content/skills/skills.types'
import { Badge } from '../../design-system/Badge/Badge'
import { Section } from '../../design-system/Section/Section'
import { CodeBracketsIcon } from '../../design-system/icons/CodeBracketsIcon'
import { FlaskIcon } from '../../design-system/icons/FlaskIcon'
import { PaletteIcon } from '../../design-system/icons/PaletteIcon'
import { WrenchIcon } from '../../design-system/icons/WrenchIcon'
import type { IconComponent } from './SkillsSection.types'
import styles from './SkillsSection.module.scss'

const GROUP_ICONS: Record<SkillGroupId, IconComponent> = {
  languagesFrameworks: CodeBracketsIcon,
  stylingData: PaletteIcon,
  testingQuality: FlaskIcon,
  toolsPractices: WrenchIcon,
}

/** Renders the grouped technology skills section. */
export function SkillsSection() {
  const { t } = useTranslation()

  return (
    <Section id="skills" aria-labelledby="skills-heading">
      <h2 id="skills-heading">{t('skills.heading')}</h2>
      <motion.div className={styles.grid} variants={staggerContainerVariants}>
        {skillGroups.map((group) => {
          const GroupIcon = GROUP_ICONS[group.id]
          return (
            <motion.div key={group.id} className={styles.panel} variants={fadeUpVariants}>
              <h3 className={styles.panelLabel}>
                <span className={styles.icon} aria-hidden="true">
                  <GroupIcon />
                </span>
                <span className={styles.key}>&quot;{t(`skills.groups.${group.id}`)}&quot;</span>
                <span className={styles.punctuation}>: [</span>
              </h3>
              <ul className={styles.chipList}>
                {group.items.map((item) => (
                  <li key={item}>
                    <Badge>{item}</Badge>
                  </li>
                ))}
              </ul>
              <p className={styles.punctuation} aria-hidden="true">
                ]
              </p>
            </motion.div>
          )
        })}
      </motion.div>
    </Section>
  )
}
