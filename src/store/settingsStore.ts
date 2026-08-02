import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { QualityLevel } from '../types/scene'

export interface SettingsStore {
  quality: QualityLevel
  reducedMotion: boolean
  soundEnabled: boolean
  setQuality: (quality: QualityLevel) => void
  setReducedMotion: (reducedMotion: boolean) => void
  setSoundEnabled: (soundEnabled: boolean) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      quality: 'auto',
      reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false,
      soundEnabled: false,
      setQuality: (quality) => set({ quality }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
    }),
    {
      name: 'portfolio-universe-settings',
    }
  )
)
