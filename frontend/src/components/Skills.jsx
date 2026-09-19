import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '/api';

const defaultDummyData = [
  {
    icon:   'ph-terminal-window',
    title:  'Frontend & Design',
    glow:   false,
    skills: [
      { name: 'React JS',      percentage: 88 },
      { name: 'Tailwind CSS',  percentage: 92 },
      { name: 'JavaScript',    percentage: 85 },
      { name: 'Figma',         percentage: 78 },
    ],
    tags: ['React JS', 'Tailwind CSS', 'JavaScript', 'Figma', 'HTML5', 'CSS3'],
  },
  {
    icon:   'ph-database',
    title:  'Backend & Systems',
    glow:   false,
    skills: [
      { name: 'Node JS',  percentage: 82 },
      { name: 'Python',   percentage: 75 },
      { name: 'MongoDB',  percentage: 70 },
      { name: 'MySQL',    percentage: 72 },
    ],
    tags: ['Node JS', 'Express', 'Python', 'MongoDB', 'MySQL', 'REST APIs'],
  },
  {
    icon:   'ph-shield-check',
    title:  'Security & Infra',
    glow:   true,
    skills: [
      { name: 'Linux/Kali',   percentage: 80 },
      { name: 'Networking',   percentage: 77 },
      { name: 'Pen-Testing',  percentage: 73 },
      { name: 'JWT Auth',     percentage: 85 },
    ],
    tags: ['Linux / Kali', 'Networking', 'Pen-Testing', 'JWT Auth', 'Wireshark', 'OWASP'],
  },
]

function SkillBar({ name, percentage, hackerMode, isVisible }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-mono mb-1.5">
        <span className="text-gray-300">{name}</span>
        <span className={`font-bold ${hackerMode ? 'text-red-400' : 'text-green-400'}`}>{percentage}%</span>
      </div>
      <div className={`h-1.5 bg-black/60 rounded-full overflow-hidden border ${hackerMode ? 'border-red-500/20' : 'border-green-500/20'}`}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${hackerMode ? 'bg-red-500' : 'bg-green-500'}`}
          style={{ width: isVisible ? `${percentage}%` : '0%' }}
        />
      </div>
    </div>
  )
}

export default function Skills({ hackerMode }) {
  const [portfolio,  setPortfolio]  = useState(null);
  const [isVisible,  setIsVisible]  = useState(false);
  const sectionRef = useRef(null);

  // Fetch portfolio data
  useEffect(() => {
    axios.get(`${API}/portfolio`)
      .then(({ data }) => setPortfolio(data.data))
      .catch(console.error);
  }, []);

  // Trigger bar animation once when the section scrolls into view
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // fire only once
        }
      },
      { threshold: 0.2 } // trigger when 20% of the section is visible
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const apiCategories = portfolio?.skillCategories || [];
  const displayCategories = apiCategories.length > 0 ? apiCategories : defaultDummyData;
  // Reverse API data to show newest first, but keep fallback order as is
  const sortedCategories = apiCategories.length > 0 ? [...apiCategories].reverse() : displayCategories;

  return (
    <section
      id="skills"
      ref={sectionRef}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedCategories.map(({ icon, title, glow, skills, tags }) => (
            <div
              key={title}
              className={`glass p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                glow
                  ? 'border-primary/40 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.1)] hover:shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.15)]'
                  : 'hover:border-primary/50'
              }`}
            >
              <i className={`ph ${icon || 'ph-code'} text-3xl text-primary mb-4 block`} />
              <h3 className="text-xl font-bold text-white mb-5">{title}</h3>
              
              <div className="space-y-3 mb-6">
                {skills.map((s, idx) => (
                  <SkillBar key={idx} name={s.name} percentage={s.percentage || s.level} hackerMode={hackerMode} isVisible={isVisible} />
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/10">
                {(tags || []).map((b, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-lg text-xs font-mono bg-black/40 border ${hackerMode ? 'border-red-500 text-red-400' : 'border-green-500 text-green-400'}`}
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
