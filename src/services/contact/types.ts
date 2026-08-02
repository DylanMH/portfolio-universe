import type { ContactFormData } from '@/types/content'

export interface ContactProvider {
  send: (data: ContactFormData) => Promise<void>
}

export interface ContactProviderConfig {
  provider: 'console' | 'emailjs' | 'api'
}
