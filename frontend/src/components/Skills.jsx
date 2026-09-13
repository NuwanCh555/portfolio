const skillGroups = [
  {
    icon:   'ph-terminal-window',
    title:  'Frontend & Design',
    glow:   false,
    skills: [
      { name: 'React JS',      level: 88 },
      { name: 'Tailwind CSS',  level: 92 },
      { name: 'JavaScript',    level: 85 },
      { name: 'Figma',         level: 78 },
    ],
    badges: ['React JS', 'Tailwind CSS', 'JavaScript', 'Figma', 'HTML5', 'CSS3'],
  },
  {
    icon:   'ph-database',
    title:  'Backend & Systems',
    glow:   false,
    skills: [
      { name: 'Node JS',  level: 82 },
      { name: 'Python',   level: 75 },
      { name: 'MongoDB',  level: 70 },
      { name: 'MySQL',    level: 72 },
    ],
    badges: ['Node JS', 'Express', 'Python', 'MongoDB', 'MySQL', 'REST APIs'],
  },
  {
    icon:   'ph-shield-check',
    title:  'Security & Infra',
    glow:   true,
    skills: [
      { name: 'Linux/Kali',   level: 80 },
      { name: 'Networking',   level: 77 },
      { name: 'Pen-Testing',  level: 73 },
      { name: 'JWT Auth',     level: 85 },
    ],
    badges: ['Linux / Kali', 'Networking', 'Pen-Testing', 'JWT Auth', 'Wireshark', 'OWASP'],
  },
]

function SkillBar({ name, level }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-mono mb-1.5">
        <span className="text-gray-300">{name}</span>
        <span className="text-primary">{level}%</span>
      </div>
      <div className="h-1.5 bg-black/60 rounded-full overflow-hidden border border-primary/10">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="py-24 px-6 border-t border-borderLight"
    >
      <div className="max-w-7xl mx-auto reveal">

        {/* ── Section Heading ── */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px bg-borderLight flex-1" />
          <h2 className="text-3xl md:text-4xl font-bold text-white whitespace-nowrap">
            Technical Arsenal
          </h2>
        </div>

        {/* ── Skill Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillGroups.map(({ icon, title, glow, skills, badges }) => (
            <div
              key={title}
              className={`glass p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                glow
                  ? 'border-primary/40 shadow-[0_0_20px_rgba(0,255,65,0.1)] hover:shadow-[0_0_30px_rgba(0,255,65,0.15)]'
                  : 'hover:border-primary/50'
              }`}
            >
              <i className={`ph ${icon} text-3xl text-primary mb-4 block`} />
              <h3 className="text-xl font-bold text-white mb-5">{title}</h3>

              {/* Skill bars */}
              <div className="space-y-3 mb-6">
                {skills.map((s) => (
                  <SkillBar key={s.name} {...s} />
                ))}
              </div>

              {/* Badge chips */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/10">
                {badges.map((b) => (
                  <span
                    key={b}
                    className={`px-3 py-1 rounded-lg text-xs font-mono ${
                      glow
                        ? 'bg-primary/20 border border-primary/50 text-white'
                        : 'bg-primary/10 border border-primary/30 text-primary'
                    }`}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
