import type { ContactFormData } from '@/types/content'
import type { ContactProvider } from './types'

export const consoleProvider: ContactProvider = {
  send: async (data: ContactFormData) => {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 600))
    console.log('[Contact] Console provider received message:', data)
  },
}
