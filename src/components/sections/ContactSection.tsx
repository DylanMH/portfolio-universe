import { socialLinks } from '@/content/profile'
import { socialLinks as allSocialLinks } from '@/content/socialLinks'
import { Linkedin, Mail } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Linkedin,
  Mail,
}

export function ContactSection() {
  const links = (allSocialLinks.length ? allSocialLinks : socialLinks).filter(
    (link) => link.id === 'linkedin' || link.id === 'email'
  )

  return (
    <section className="space-y-6 text-text">
      <div>
        <h2 className="text-3xl font-bold text-white">Contact</h2>
        <p className="mt-2 text-space-muted">
          Have a project or idea? Reach out on LinkedIn or send me an email.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {links.map((link) => {
          const Icon = iconMap[link.icon] || Mail
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </a>
          )
        })}
      </div>
    </section>
  )
}
