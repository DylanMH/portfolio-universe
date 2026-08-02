import emailjs from '@emailjs/browser'
import type { ContactFormData } from '@/types/content'
import type { ContactProvider } from './types'

interface EmailJSConfig {
  serviceId: string
  templateId: string
  publicKey: string
}

export function createEmailJSProvider(config: EmailJSConfig): ContactProvider {
  return {
    send: async (data: ContactFormData) => {
      await emailjs.send(
        config.serviceId,
        config.templateId,
        {
          from_name: data.name,
          reply_to: data.email,
          subject: data.subject,
          message: data.message,
        },
        config.publicKey
      )
    },
  }
}
