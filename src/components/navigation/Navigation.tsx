import { useState } from 'react'
import { Menu, X, Home } from 'lucide-react'
import { useSceneNavigation } from '@/hooks/useSceneNavigation'
import { useSceneStore } from '@/store/sceneStore'
import { useSettingsStore } from '@/store/settingsStore'
import { celestialSections, BLACK_HOLE_ID } from '@/content/scene'
import { cn } from '@/utils/cn'
import type { QualityLevel } from '@/types/scene'

export function Navigation() {
  const [open, setOpen] = useState(false)
  const { goToSection, goHome, currentSection } = useSceneNavigation()
  const transitionState = useSceneStore((state) => state.transitionState)

  const isLocked = transitionState === 'traveling'

  const handleNav = (id: string | null) => {
    setOpen(false)
    if (isLocked) return
    if (id === null) goHome()
    else goToSection(id)
  }

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-4 py-3 md:px-8">
        <div className="flex flex-col items-start">
          <button
            onClick={() => handleNav(null)}
            className="flex items-center gap-2 text-lg font-bold text-white transition hover:opacity-80"
          >
            <Home className="h-5 w-5" />
            <span className="hidden sm:inline">Dylan Houston</span>
          </button>
          <QualityToggle />
        </div>

        <div className="hidden items-center gap-1 md:flex">
          <NavButton active={currentSection === BLACK_HOLE_ID} onClick={() => handleNav(BLACK_HOLE_ID)}>
            About
          </NavButton>
          {celestialSections.map((section) => (
            <NavButton
              key={section.id}
              active={currentSection === section.id}
              onClick={() => handleNav(section.id)}
            >
              {section.label}
            </NavButton>
          ))}
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-white hover:bg-white/10 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-void/95 backdrop-blur md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-lg font-bold text-white">Menu</span>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col gap-2 p-4">
            <MobileNavButton onClick={() => handleNav(null)}>Home</MobileNavButton>
            <MobileNavButton onClick={() => handleNav(BLACK_HOLE_ID)}>About</MobileNavButton>
            {celestialSections.map((section) => (
              <MobileNavButton key={section.id} onClick={() => handleNav(section.id)}>
                {section.label}
              </MobileNavButton>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function NavButton({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-lg px-3 py-2 text-sm font-medium transition',
        active ? 'bg-white/10 text-white' : 'text-space-muted hover:text-white hover:bg-white/5'
      )}
    >
      {children}
    </button>
  )
}

function MobileNavButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-lg px-4 py-3 text-left text-lg text-white hover:bg-white/10">
      {children}
    </button>
  )
}

function QualityToggle() {
  const quality = useSettingsStore((state) => state.quality)
  const setQuality = useSettingsStore((state) => state.setQuality)

  const options: { value: QualityLevel; label: string }[] = [
    { value: 'auto', label: 'Auto' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Med' },
    { value: 'high', label: 'High' },
  ]

  return (
    <div className="mt-1 flex flex-wrap items-center gap-1" aria-label="Quality settings">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setQuality(option.value)}
          className={cn(
            'rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider transition',
            quality === option.value
              ? 'bg-accent text-white'
              : 'bg-white/5 text-space-muted hover:bg-white/10 hover:text-white'
          )}
          aria-pressed={quality === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
