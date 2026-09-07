import { useEffect, useRef, useState } from 'react'
import { m } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { formatMonthYear } from '@/core/date/formatMonthYear'
import { cx } from '@/core/style/cx'
import { fadeUpVariants, staggerContainerVariants } from '@/core/motion/variants'
import { experience } from '@/content/experience/experience'
import { AmbientGlow } from '@/design-system/AmbientGlow/AmbientGlow'
import { Badge } from '@/design-system/Badge/Badge'
import { Section } from '@/design-system/Section/Section'
import styles from './ExperienceSection.module.scss'

/** Renders the professional experience timeline. */
export function ExperienceSection() {
  const { t, i18n } = useTranslation()
  const [activeId, setActiveId] = useState<string | null>(null)
  const nodeRefs = useRef(new Map<string, HTMLLIElement>())

  // Local, tighter-banded observer than useActiveSection's page-level one —
  // this drives the timeline's scroll-linked node highlight, a purely
  // visual class toggle (never moves focus; ScrollToHash/FocusOnNavigate
  // own that job).
  useEffect(() => {
    const elements = Array.from(nodeRefs.current.values())
    if (elements.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.find((entry) => entry.isIntersecting)
        if (intersecting) {
          setActiveId(intersecting.target.getAttribute('data-id'))
        }
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )

    for (const element of elements) {
      observer.observe(element)
    }

    return () => {
      observer.disconnect()
      setActiveId(null)
    }
  }, [])

  // Filled up to the currently active node (same activeId that highlights
  // its dot below) rather than an independent scroll-position calculation —
  // keeps the line and the dot it corresponds to always in sync.
  const activeIndex = experience.findIndex((item) => item.id === activeId)
  const filledFraction = activeIndex === -1 ? 0 : (activeIndex + 1) / experience.length

  return (
    <Section id="experience" aria-labelledby="experience-heading">
      <AmbientGlow position="bottom-left" />
      <h2 id="experience-heading">{t('experience.heading')}</h2>
      <m.ol className={styles.timeline} variants={staggerContainerVariants}>
        <span
          className={styles.progressLine}
          aria-hidden="true"
          style={{ transform: `scaleY(${filledFraction})` }}
        />
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
          const isActive = item.id === activeId

          return (
            <m.li
              key={item.id}
              data-id={item.id}
              ref={(element) => {
                if (element) {
                  nodeRefs.current.set(item.id, element)
                } else {
                  nodeRefs.current.delete(item.id)
                }
              }}
              className={cx(styles.node, isActive && styles.active)}
              variants={fadeUpVariants}
            >
              <div className={styles.track}>
                <span className={styles.dot} />
              </div>
              <div className={styles.content}>
                <div className={styles.roleRow}>
                  <h3 className={styles.role}>{t(`experience.items.${item.id}.role`)}</h3>
                  <Badge>{t(`experience.workMode.${item.workMode}`)}</Badge>
                </div>
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
              </div>
            </m.li>
          )
        })}
      </m.ol>
    </Section>
  )
}
