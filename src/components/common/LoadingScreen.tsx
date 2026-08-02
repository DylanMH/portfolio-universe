import { motion } from 'framer-motion'

interface LoadingScreenProps {
  fullScreen?: boolean
  message?: string
}

export function LoadingScreen({ fullScreen = true, message = 'Loading universe...' }: LoadingScreenProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-void ${
        fullScreen ? 'fixed inset-0 z-50' : 'h-48 w-full'
      }`}
    >
      <motion.div
        className="h-12 w-12 rounded-full border-2 border-accent/30 border-t-accent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="mt-4 text-sm text-space-muted">{message}</p>
    </div>
  )
}
