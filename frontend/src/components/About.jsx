const objectives = [
  {
    title: 'Full-Stack Engineering',
    desc:  'Building responsive, data-driven applications with modern frameworks.',
    icon:  'ph-code',
  },
  {
    title: 'Cyber Security & Infra',
    desc:  'Vulnerability testing & secure zero-trust routing principles.',
    icon:  'ph-shield-check',
  },
  {
    title: 'UI/UX & Branding',
    desc:  'Crafting premium interfaces and cohesive digital identities.',
    icon:  'ph-pen-nib',
  },
]

export default function About({ portfolio }) {
  return (
    <section
      id="about"
      className="py-24 px-6 border-t border-borderLight bg-black/40"
    >
      <div className="max-w-7xl mx-auto reveal">

        {/* ── Section Heading ── */}
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white whitespace-nowrap">
            About Me
          </h2>
          <div className="h-px bg-borderLight flex-1" />
        </div>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* Left: Bio text */}
          <div className="space-y-6">
            {portfolio?.about ? (
              <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap">
                {portfolio.about}
              </p>
            ) : (
              <>
                <p className="text-gray-400 leading-relaxed text-lg">
                  With a strong academic foundation in Information Technology from the{' '}
                  <span className="text-primary font-medium">
                    Advanced Technological Institute (HNDIT)
                  </span>
                  , I bridge the gap between creative design and robust technical
                  engineering.
                </p>
                <p className="text-gray-400 leading-relaxed text-lg">
                  My core philosophy is that excellent software isn't just about
                  writing code — it's about crafting{' '}
                  <span className="text-white font-medium">
                    secure, scalable, and intuitive
                  </span>{' '}
                  systems. From developing React-based web applications to
                  configuring secure server environments and analyzing
                  vulnerabilities, I take a holistic approach to IT.
                </p>
              </>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { val: '2+',  label: 'Years Coding'    },
                { val: '10+', label: 'Projects Built'  },
                { val: '5+',  label: 'CTF Challenges'  },
              ].map(({ val, label }) => (
                <div
                  key={label}
                  className="glass rounded-xl p-4 text-center border-primary/20"
                >
                  <div className="text-2xl font-extrabold text-primary">{val}</div>
                  <div className="text-xs text-gray-500 mt-1 font-mono">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Core Objectives glass card */}
          <div className="glass p-8 rounded-2xl border-primary/20 h-full">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <i className="ph ph-target text-primary" /> Core Objectives
            </h3>
            <ul className="space-y-6 font-mono text-sm">
              {objectives.map(({ title, desc, icon }) => (
                <li key={title} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className={`ph ${icon} text-primary`} />
                  </div>
                  <div>
                    <h4 className="text-primary font-semibold">{title}</h4>
                    <p className="text-gray-400 mt-1 leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}
