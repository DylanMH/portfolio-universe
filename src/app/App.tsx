import { Suspense, lazy } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useEffect } from 'react'
import { useSceneNavigation } from '@/hooks/useSceneNavigation'
import { useSettingsStore } from '@/store/settingsStore'
import { Layout } from '@/components/layout/Layout'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { SectionOverlay } from '@/components/overlays/SectionOverlay'

const SpaceScene = lazy(() => import('@/scene/SpaceScene'))

function AppContent() {
  const { syncRouteToSection } = useSceneNavigation()
  const { reducedMotion } = useSettingsStore()

  useEffect(() => {
    syncRouteToSection()
  }, [syncRouteToSection])

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion)
  }, [reducedMotion])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-void text-text">
      <Layout />
      <Suspense fallback={<LoadingScreen fullScreen message="Loading universe..." />}>
        <SpaceScene />
      </Suspense>
      <SectionOverlay />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
