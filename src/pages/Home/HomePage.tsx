import { AboutSection } from '../../features/about/AboutSection'
import { ContactSection } from '../../features/contact/ContactSection'
import { ExperienceSection } from '../../features/experience/ExperienceSection'
import { HeroSection } from '../../features/hero/HeroSection'
import { ProjectsSection } from '../../features/projects/ProjectsSection'
import { SkillsSection } from '../../features/skills/SkillsSection'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
    </>
  )
}
