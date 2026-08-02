import { useSettingsStore } from '@/store/settingsStore'
import { useDeviceQuality } from './useDeviceQuality'
import type { QualityLevel } from '../types/scene'

export function useResolvedQuality(): QualityLevel {
  const userQuality = useSettingsStore((state) => state.quality)
  return useDeviceQuality(userQuality)
}
