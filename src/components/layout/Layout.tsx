import { SkipLink } from '@/components/accessibility/SkipLink'
import { Navigation } from '@/components/navigation/Navigation'
import { useSceneStore } from '@/store/sceneStore'

export function Layout() {
  const transitionState = useSceneStore((state) => state.transitionState)

  return (
    <>
      <SkipLink />
      <Navigation />
      {transitionState === 'traveling' && (
        <div className="pointer-events-none fixed left-4 top-20 z-20 rounded bg-space-deep/80 px-3 py-1 text-xs text-space-muted">
          Traveling...
        </div>
      )}
    </>
  )
}
