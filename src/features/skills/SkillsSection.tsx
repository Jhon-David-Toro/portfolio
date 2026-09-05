import { useTranslation } from 'react-i18next'
import { skillGroups } from '../../content/skills/skills'
import { Badge } from '../../design-system/Badge/Badge'
import { Section } from '../../design-system/Section/Section'
import styles from './SkillsSection.module.scss'

export function SkillsSection() {
  const { t } = useTranslation()

  return (
    <Section id="skills" aria-labelledby="skills-heading">
      <h2 id="skills-heading">{t('skills.heading')}</h2>
      <div className={styles.groups}>
        {skillGroups.map((group) => (
          <div key={group.id}>
            <h3 className={styles.groupLabel}>{t(`skills.groups.${group.id}`)}</h3>
            <ul className={styles.badgeList}>
              {group.items.map((item) => (
                <li key={item}>
                  <Badge>{item}</Badge>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
