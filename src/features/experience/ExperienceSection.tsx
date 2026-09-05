import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { formatMonthYear } from '../../core/date/formatMonthYear'
import { fadeUpVariants, staggerContainerVariants } from '../../core/motion/variants'
import { experience } from '../../content/experience/experience'
import { Badge } from '../../design-system/Badge/Badge'
import { Section } from '../../design-system/Section/Section'
import styles from './ExperienceSection.module.scss'

/** Renders the professional experience timeline. */
export function ExperienceSection() {
  const { t, i18n } = useTranslation()
  const [activeId, setActiveId] = useState<string | null>(null)
  const nodeRefs = useRef(new Map<string, HTMLLIElement>())
  const timelineRef = useRef<HTMLOListElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Drives the timeline's accent fill line — same useScroll/useTransform
  // pattern as HeroSection's parallax. Progress reaches 1 once the bottom of
  // the timeline reaches viewport center, so the fill roughly tracks how far
  // through the section the reader has scrolled.
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start center', 'end center'],
  })
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1])

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

  return (
    <Section id="experience" aria-labelledby="experience-heading">
      <h2 id="experience-heading">{t('experience.heading')}</h2>
      <motion.ol ref={timelineRef} className={styles.timeline} variants={staggerContainerVariants}>
        <motion.span
          className={styles.progressLine}
          aria-hidden="true"
          style={prefersReducedMotion ? undefined : { scaleY: progressScale }}
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
            <motion.li
              key={item.id}
              data-id={item.id}
              ref={(element) => {
                if (element) {
                  nodeRefs.current.set(item.id, element)
                } else {
                  nodeRefs.current.delete(item.id)
                }
              }}
              className={isActive ? `${styles.node} ${styles.active}` : styles.node}
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
            </motion.li>
          )
        })}
      </motion.ol>
    </Section>
  )
}
