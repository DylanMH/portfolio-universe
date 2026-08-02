import { skillCategories } from '@/content/skills'

export function SkillsSection() {
  return (
    <section className="space-y-6 text-text">
      <div>
        <h2 className="text-3xl font-bold text-white">Skills</h2>
        <p className="mt-2 text-space-muted">Tools and technologies I use to build products.</p>
      </div>

      <div className="space-y-8">
        {skillCategories.map((category) => (
          <div key={category.id}>
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
              {category.label}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <li
                  key={skill.id}
                  className="rounded-full bg-white/5 px-3 py-1 text-sm text-text"
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
