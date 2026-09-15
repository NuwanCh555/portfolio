const timeline = [
  {
    date:     '[ 2024 – 2026 Expected ]',
    active:   true,
    title:    'HNDIT Candidate',
    org:      'Advanced Technological Institute (SLIATE) – Ratnapura',
    desc:     '>> Focusing on Object-Oriented Programming (OOP), Database Management Systems (DBMS), Systems Analysis, and IT Infrastructure. Maintaining strong academic performance while building real-world projects.',
    tags:     ['OOP', 'DBMS', 'Systems Analysis', 'IT Infra'],
  },
  {
    date:     '[ 2023 – Present ]',
    active:   false,
    title:    'Freelance Full-Stack & Security',
    org:      'Independent Contractor',
    desc:     '>> Developing secure web applications, configuring backend API routes, and engaging in CTF (Capture The Flag) challenges to hone offensive and defensive security skills.',
    tags:     ['React', 'Node.js', 'Penetration Testing', 'CTF'],
  },
  {
    date:     '[ 2022 – 2023 ]',
    active:   false,
    title:    'Self-Directed Learning',
    org:      'Online Platforms & Community',
    desc:     '>> Completed intensive courses in web development, Linux fundamentals, and network security. Built a portfolio of 10+ projects from scratch across various technology stacks.',
    tags:     ['HTML/CSS', 'JavaScript', 'Linux', 'Networking'],
  },
]

export default function Experience({ portfolio }) {
  const experiences = portfolio?.experience?.length > 0 ? portfolio.experience : timeline;
  const isDynamic = portfolio?.experience?.length > 0;

  return (
    <section
      id="experience"
      className="py-24 px-6 border-t border-borderLight bg-black/40"
    >
      <div className="max-w-4xl mx-auto reveal">

        {/* ── Section Heading ── */}
        <div className="flex items-center gap-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white whitespace-nowrap">
            Experience &amp; Education
          </h2>
          <div className="h-px bg-borderLight flex-1" />
        </div>

        {/* ── Vertical Timeline ── */}
        <div className="relative border-l border-primary/30 ml-3 md:ml-6 space-y-12">
          {experiences.map((exp, idx) => {
            // For dynamic data we don't have "active", so we'll just make the first one active
            const active = isDynamic ? idx === 0 : exp.active;
            const date = isDynamic ? exp.duration : exp.date;
            const org = isDynamic ? exp.company : exp.org;
            const tags = isDynamic ? [] : exp.tags;

            return (
              <div key={idx} className="relative pl-8 md:pl-12">
                {/* Dot */}
                <div
                  className={`absolute w-6 h-6 bg-surface border-2 rounded-full -left-[13px] top-1 flex items-center justify-center ${
                    active
                      ? 'border-primary shadow-[0_0_10px_rgba(0,255,65,0.5)]'
                      : 'border-primary/40'
                  }`}
                >
                  {active && (
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </div>

                {/* Content */}
                <div
                  className={`font-mono text-sm font-semibold mb-2 ${
                    active ? 'text-primary' : 'text-gray-500'
                  }`}
                >
                  {date}
                </div>
                <h3 className="text-2xl font-bold text-white">{exp.title}</h3>
                <h4 className="text-lg text-gray-400 mb-3">{org}</h4>
                <p className="text-gray-400 leading-relaxed font-mono text-sm mb-4 whitespace-pre-wrap">
                  {exp.description || exp.desc}
                </p>

                {/* Tag chips */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono px-2.5 py-1 rounded-lg bg-primary/5 border border-primary/20 text-primary/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
