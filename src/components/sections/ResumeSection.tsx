import { Download } from 'lucide-react'
import { workExperience, education, certifications, achievements } from '@/content/experience'
import { profile } from '@/content/profile'

export function ResumeSection() {
  const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Present')

  return (
    <section className="space-y-8 text-text">
      <div>
          <h2 className="text-3xl font-bold text-white">Resume & Experience</h2>
          <p className="mt-2 text-space-muted">{profile.currentRole} · {profile.location}</p>
          <a
            href="/resume/latest-resume-dylan.pdf"
            download
            className="btn-primary mt-4 text-sm px-3 py-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </a>
        </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Experience</h3>
        <div className="space-y-4">
          {workExperience.map((job) => (
            <div key={job.id} className="rounded-2xl border border-space-panel-border/50 bg-space-panel/50 p-5">
              <div className="flex flex-col justify-between gap-1 sm:flex-row">
                <h4 className="font-semibold text-white">{job.role}</h4>
                <span className="text-sm text-space-muted">
                  {formatDate(job.startDate)} — {job.current ? 'Present' : formatDate(job.endDate)}
                </span>
              </div>
              <p className="text-sm text-accent-cyan">{job.company} · {job.location}</p>
              <p className="mt-2 text-sm">{job.summary}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-space-muted">
                {job.responsibilities.map((resp) => (
                  <li key={resp}>{resp}</li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.technologies.map((tech) => (
                  <span key={tech} className="rounded bg-white/5 px-2 py-0.5 text-xs text-space-muted">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Education</h3>
        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id} className="rounded-2xl border border-space-panel-border/50 bg-space-panel/50 p-5">
              <h4 className="font-semibold text-white">{edu.degree} in {edu.field}</h4>
              <p className="text-sm text-accent-cyan">{edu.institution}</p>
              <p className="text-sm text-space-muted">
                {formatDate(edu.startDate)} — {edu.current ? 'Present' : formatDate(edu.endDate)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Certifications</h3>
        <div className="flex flex-wrap gap-3">
          {certifications.map((cert) =>
            cert.url ? (
              <a
                key={cert.id}
                href={cert.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-space-panel/50 px-4 py-3 text-sm transition hover:border-accent/50"
              >
                <p className="font-medium text-white">{cert.name}</p>
                <p className="text-space-muted">
                  {cert.issuer}
                  {cert.date ? ` · ${cert.date}` : ''}
                </p>
              </a>
            ) : (
              <div
                key={cert.id}
                className="rounded-xl bg-space-panel/50 px-4 py-3 text-sm transition hover:border-accent/50"
              >
                <p className="font-medium text-white">{cert.name}</p>
                <p className="text-space-muted">
                  {cert.issuer}
                  {cert.date ? ` · ${cert.date}` : ''}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">Highlights</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-space-muted">
          {achievements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
