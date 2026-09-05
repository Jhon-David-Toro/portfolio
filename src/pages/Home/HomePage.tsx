import { useTranslation } from 'react-i18next'
import { usePageMeta } from '../../core/seo/usePageMeta'
import { profile } from '../../content/profile/profile'
import { AboutSection } from '../../features/about/AboutSection'
import { ContactSection } from '../../features/contact/ContactSection'
import { EducationSection } from '../../features/education/EducationSection'
import { ExperienceSection } from '../../features/experience/ExperienceSection'
import { HeroSection } from '../../features/hero/HeroSection'
import { ProjectsSection } from '../../features/projects/ProjectsSection'
import { SkillsSection } from '../../features/skills/SkillsSection'

/** Renders the complete portfolio home page. */
export function HomePage() {
  const { t } = useTranslation()
  usePageMeta(`${profile.name} — ${t('hero.eyebrow')}`, t('hero.tagline'))

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
    </>
  )
}
