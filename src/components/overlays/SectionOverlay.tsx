import { AnimatePresence } from 'framer-motion'
import { useSceneStore } from '@/store/sceneStore'
import { SectionShell } from '@/components/sections/SectionShell'
import { AboutSection } from '@/components/sections/AboutSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { GithubSection } from '@/components/sections/GithubSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ResumeSection } from '@/components/sections/ResumeSection'
import { ContactSection } from '@/components/sections/ContactSection'

const sectionComponents: Record<string, React.ComponentType> = {
  about: AboutSection,
  projects: ProjectsSection,
  github: GithubSection,
  skills: SkillsSection,
  resume: ResumeSection,
  contact: ContactSection,
}

export function SectionOverlay() {
  const currentSection = useSceneStore((state) => state.currentSection)
  const transitionState = useSceneStore((state) => state.transitionState)
  const Section = currentSection ? sectionComponents[currentSection] : null

  return (
    <AnimatePresence mode="wait">
      {Section && transitionState !== 'traveling' && (
        <SectionShell key={currentSection}>
          <Section />
        </SectionShell>
      )}
    </AnimatePresence>
  )
}
