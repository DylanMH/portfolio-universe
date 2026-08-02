import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useSceneNavigation } from '@/hooks/useSceneNavigation'
import { useSceneStore } from '@/store/sceneStore'
import { cn } from '@/utils/cn'

interface SectionShellProps {
  children: React.ReactNode
  className?: string
}

export function SectionShell({ children, className }: SectionShellProps) {
  const { goHome } = useSceneNavigation()
  const transitionState = useSceneStore((state) => state.transitionState)

  return (
    <motion.div
      id="section-content"
      tabIndex={-1}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 60 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn(
        'fixed inset-x-0 bottom-0 top-auto z-30 h-[56vh] w-full overflow-y-auto overflow-x-hidden rounded-t-3xl p-4 pt-6 sm:p-6 sm:pt-8',
        'md:inset-y-0 md:inset-x-auto md:right-0 md:h-auto md:w-[42rem] md:rounded-none md:p-8 md:pt-28 lg:w-[48rem]',
        'bg-space-deep/85 backdrop-blur-xl border-t border-space-panel-border/50 md:border-t-0 md:border-l shadow-2xl',
        'focus:outline-none',
        className
      )}
      aria-busy={transitionState === 'traveling'}
    >
      <button
        onClick={goHome}
        className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-3 text-white shadow-lg shadow-black/20 transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-accent-cyan md:fixed md:right-8 md:top-24"
        aria-label="Close section and return to orbit"
      >
        <X className="h-6 w-6" />
      </button>
      <div className="pt-10 md:pt-0">{children}</div>
    </motion.div>
  )
}
