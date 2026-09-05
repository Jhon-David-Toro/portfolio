// Section landmarks matching the header's anchors. Content (Hero, About,
// Projects, Skills, Contact copy) is introduced in a later phase.
export function HomePage() {
  return (
    <>
      <section id="about" aria-label="About" />
      <section id="projects" aria-label="Projects" />
      <section id="skills" aria-label="Skills" />
      <section id="contact" aria-label="Contact" />
    </>
  )
}
