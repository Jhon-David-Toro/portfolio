import { useTranslation } from 'react-i18next'
import { formatMonthYear } from '../../core/date/formatMonthYear'
import { experience } from '../../content/experience/experience'
import { Section } from '../../design-system/Section/Section'
import styles from './ExperienceSection.module.scss'

export function ExperienceSection() {
  const { t, i18n } = useTranslation()

  return (
    <Section id="experience" aria-labelledby="experience-heading">
      <h2 id="experience-heading">{t('experience.heading')}</h2>
      <ol className={styles.list}>
        {experience.map((item) => {
          // Safe: `experience.items.<id>.highlights` is always authored as a
          // string array in content/locales/{en,es}.json — we own the shape.
          const highlights = t(`experience.items.${item.id}.highlights`, {
            returnObjects: true,
          }) as string[]

          const start = formatMonthYear(item.startDate, i18n.language)
          const end = item.endDate
            ? formatMonthYear(item.endDate, i18n.language)
            : t('experience.present')

          return (
            <li key={item.id} className={styles.item}>
              <h3 className={styles.role}>{t(`experience.items.${item.id}.role`)}</h3>
              <p className={styles.meta}>
                {item.company} · {start} – {end} · {item.location}
              </p>
              {highlights.length > 0 && (
                <ul className={styles.highlights}>
                  {highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
