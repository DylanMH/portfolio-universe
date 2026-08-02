import type { ContactFormData } from '@/types/content'
import { consoleProvider } from './consoleProvider'
import { createEmailJSProvider } from './emailjsProvider'
import { createApiRouteProvider } from './apiRouteProvider'

const provider = ((): typeof consoleProvider => {
  const providerName = import.meta.env.VITE_CONTACT_PROVIDER || 'console'

  if (providerName === 'emailjs') {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    if (serviceId && templateId && publicKey) {
      return createEmailJSProvider({ serviceId, templateId, publicKey })
    }
    console.warn('[Contact] EmailJS config missing, falling back to console provider')
  }

  if (providerName === 'api') {
    const endpoint = import.meta.env.VITE_CONTACT_API_ENDPOINT
    if (endpoint) {
      return createApiRouteProvider(endpoint)
    }
    console.warn('[Contact] API endpoint missing, falling back to console provider')
  }

  return consoleProvider
})()

export { consoleProvider, createEmailJSProvider, createApiRouteProvider }

export function sendContactMessage(data: ContactFormData): Promise<void> {
  return provider.send(data)
}
