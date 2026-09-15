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

export default function Skills({ portfolio }) {
  const hasTech = portfolio?.technicalArsenal?.length > 0;
  const hasSkills = portfolio?.skills?.length > 0;

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

        {hasTech || hasSkills ? (
          <div>
            {hasTech && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-12">
                {portfolio.technicalArsenal.map((t, i) => (
                  <div key={i} className="glass p-6 rounded-2xl flex flex-col items-center justify-center gap-4 hover:-translate-y-1 transition-transform border-primary/20 hover:border-primary/50 text-center">
                    {t.icon?.startsWith('http') ? (
                      <img src={t.icon} alt={t.name} className="w-12 h-12 object-contain filter drop-shadow-[0_0_8px_rgba(0,255,65,0.5)]" />
                    ) : (
                      <i className={`ph ${t.icon || 'ph-code'} text-4xl text-primary drop-shadow-[0_0_8px_rgba(0,255,65,0.5)]`} />
                    )}
                    <span className="text-white font-bold">{t.name}</span>
                  </div>
                ))}
              </div>
            )}
            
            {hasSkills && (
              <div className="glass p-8 rounded-2xl border-primary/20">
                <h3 className="text-xl font-bold text-white mb-6">Core Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {portfolio.skills.map((s) => (
                    <span key={s} className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary rounded-xl font-mono text-sm">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── Fallback Hardcoded Skill Cards ── */
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
                
                <div className="space-y-3 mb-6">
                  {skills.map((s) => (
                    <SkillBar key={s.name} {...s} />
                  ))}
                </div>

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
        )}
      </div>
    </section>
  )
}
