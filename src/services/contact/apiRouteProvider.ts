import type { ContactFormData } from '@/types/content'
import type { ContactProvider } from './types'

export function createApiRouteProvider(endpoint: string): ContactProvider {
  return {
    send: async (data: ContactFormData) => {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`)
      }
    },
  }
}
