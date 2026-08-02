import { profile, socialLinks } from '@/content/profile'
import { socialLinks as allSocialLinks } from '@/content/socialLinks'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Github,
  Linkedin,
  Twitter,
  Mail,
}

export function AboutSection() {
  const links = allSocialLinks.length ? allSocialLinks : socialLinks

  return (
    <section className="space-y-6 text-text">
      <div className="flex flex-col items-start gap-6 md:flex-row">
        <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-accent/50 bg-space-panel">
          {profile.avatar ? (
            <img src={profile.avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-accent">
              {profile.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white md:text-4xl">{profile.name}</h1>
          <p className="text-lg text-accent-cyan">{profile.title}</p>
          <p className="text-sm text-space-muted">{profile.location}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-space-muted">Mission</h2>
        <p className="text-lg leading-relaxed">{profile.mission}</p>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-space-muted">About</h2>
        <p className="leading-relaxed">{profile.bio}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-space-panel/50 p-4">
          <p className="text-sm text-space-muted">Focus</p>
          <p className="font-medium">{profile.focus}</p>
        </div>
        <div className="rounded-xl bg-space-panel/50 p-4">
          <p className="text-sm text-space-muted">Experience</p>
          <p className="font-medium">{profile.yearsOfExperience} years</p>
        </div>
        <div className="rounded-xl bg-space-panel/50 p-4">
          <p className="text-sm text-space-muted">Current Role</p>
          <p className="font-medium">{profile.currentRole}</p>
        </div>
        <div className="rounded-xl bg-space-panel/50 p-4">
          <p className="text-sm text-space-muted">Availability</p>
          <p className="font-medium">{profile.availability}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-space-muted">Connect</h2>
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
      </div>
    </section>
  )
}
