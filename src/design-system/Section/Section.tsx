import type { ReactNode } from 'react'
import { Container } from '../Container/Container'
import styles from './Section.module.scss'

type SectionProps = {
  readonly id?: string
  readonly children: ReactNode
  readonly 'aria-label'?: string
  readonly 'aria-labelledby'?: string
}

export function Section({ id, children, ...aria }: SectionProps) {
  return (
    <section id={id} className={styles.section} {...aria}>
      <Container>{children}</Container>
    </section>
  )
}
