import { describe, it, expect } from 'vitest'
import { sendContactMessage } from './index'

describe('sendContactMessage', () => {
  it('resolves without error for the console provider', async () => {
    await expect(
      sendContactMessage({
        name: 'Dylan',
        email: 'test@example.com',
        subject: 'Hello',
        message: 'World',
        honeypot: '',
      })
    ).resolves.toBeUndefined()
  })
})
