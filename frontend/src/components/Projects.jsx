import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'
const URL_REGEX = /(https?:\/\/|www\.|\.com|\.net|\.lk|\.org|\.io|\.co\b)/i
const TABS = [
  { key: 'all',      label: 'All Works'       },
  { key: 'web',      label: 'Web & App'        },
  { key: 'security', label: 'Security & Infra' },
  { key: 'design',   label: 'Design & Media'   },
]
const ACCENT_COLORS = ['from-primary/20 to-secondary/20','from-secondary/20 to-primary/10','from-primary/10 to-primary/20']

const fallbackProjects = [
  {
    _id: '1',
    title: 'Zero-Trust Secure Network',
    description: 'A mock enterprise network architecture demonstrating zero-trust principles, micro-segmentation, and strict access controls.',
    category: 'security',
    tech: ['Linux', 'Docker', 'WireGuard', 'pfSense'],
    icon: 'ph-shield-check',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'E-Commerce Dashboard UI',
    description: 'A modern, premium admin dashboard for e-commerce platforms featuring real-time analytics and dynamic theming.',
    category: 'web',
    tech: ['React', 'Tailwind', 'Chart.js', 'Framer Motion'],
    icon: 'ph-browsers',
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    title: 'Brand Identity Concept',
    description: 'A complete branding package including logo design, color typography, and UI guidelines for a fintech startup.',
    category: 'design',
    tech: ['Figma', 'Illustrator', 'Photoshop'],
    icon: 'ph-bezier-curve',
    createdAt: new Date().toISOString()
  }
]

function ProjectCard({ project, idx }) {
  const gradient = ACCENT_COLORS[idx % ACCENT_COLORS.length]
  return (
    <div className="glass overflow-hidden rounded-2xl group hover:border-primary/60 transition-all duration-300 hover:-translate-y-2 shadow-[0_0_0_rgba(var(--color-primary-rgb),0)] hover:shadow-[0_8px_30px_rgba(var(--color-primary-rgb),0.12)] flex flex-col">
      <div className={`h-44 overflow-hidden relative border-b border-primary/20 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        {project.image ? (
          <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <i className={`ph ${project.icon || 'ph-terminal-window'} text-7xl text-primary/30 group-hover:text-primary/60 transition-colors duration-500 group-hover:scale-110 transform`} />
        )}
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded-full border border-primary/30 bg-black/60 text-primary uppercase tracking-widest">{project.category}</span>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
        <p className="text-sm text-gray-400 mb-5 font-mono leading-relaxed flex-1">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tech?.map((t) => (
            <span key={t} className="text-xs font-mono bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg text-primary">{t}</span>
          ))}
        </div>
        {(project.liveUrl || project.repoUrl) && (
          <div className="flex gap-3 mt-4 pt-4 border-t border-primary/10">
            {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-primary hover:text-white flex items-center gap-1 transition-colors"><i className="ph ph-arrow-square-out" /> Live</a>}
            {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-gray-400 hover:text-primary flex items-center gap-1 transition-colors"><i className="ph ph-github-logo" /> Code</a>}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Projects() {
  const [allProjects, setAllProjects] = useState([])
  const [active,      setActive]      = useState('all')
  const [fading,      setFading]      = useState(false)
  const [visible,     setVisible]     = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')

  useEffect(() => {
    axios.get(`${API}/projects`)
      .then(({ data }) => {
        const apiProjects = data.projects || [];
        const displayProjects = apiProjects.length > 0 ? apiProjects : fallbackProjects;
        const sorted = [...displayProjects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllProjects(sorted);
        setVisible(sorted);
      })
      .catch(() => setError('Could not load projects from server.'))
      .finally(() => setLoading(false))
  }, [])

  const handleFilter = useCallback((cat) => {
    if (cat === active) return
    setFading(true)
    setTimeout(() => {
      setVisible(cat === 'all' ? allProjects : allProjects.filter((p) => p.category === cat))
      setActive(cat); setFading(false)
    }, 220)
  }, [active, allProjects])

  return (
    <section id="projects" className="py-24 px-6 border-t border-borderLight">
      <div className="max-w-7xl mx-auto reveal">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Projects</h2>
        <p className="text-primary font-mono text-sm mb-10">&gt; Querying database records...</p>

        <div id="project-tabs" className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-borderLight">
          {TABS.map(({ key, label }) => (
            <button key={key} id={`tab-${key}`} onClick={() => handleFilter(key)} className={`tab-btn ${active === key ? 'active' : ''}`}>{label}</button>
          ))}
        </div>

        {loading && <div className="text-center py-16 text-primary font-mono animate-pulse">&gt; Fetching projects from database...</div>}
        {error   && <div className="text-center py-16 text-red-400 font-mono text-sm">{error}</div>}

        <div id="projects-grid" className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${fading ? 'opacity-0' : 'opacity-100'}`}>
          {visible.map((project, idx) => <ProjectCard key={project._id} project={project} idx={idx} />)}
        </div>

        {!loading && visible.length === 0 && (
          <div className="text-center py-20 text-gray-600 font-mono">&gt; No records found in this category_</div>
        )}
      </div>
    </section>
  )
}
