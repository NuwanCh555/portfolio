import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Navbar() {
  const { user, logout }   = useAuth()
  const navigate           = useNavigate()
  const [scrolled,      setScrolled]      = useState(false)
  const [mobileOpen,    setMobileOpen]    = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const sections = ['home','about','skills','experience','projects','contact','feedback']
      const current = sections.find((id) => {
        const el = document.getElementById(id)
        if (!el) return false
        const { top, bottom } = el.getBoundingClientRect()
        return top <= 100 && bottom >= 100
      })
      if (current) setActiveSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '#about',      label: 'About'      },
    { href: '#skills',     label: 'Skills'     },
    { href: '#experience', label: 'Experience' },
    { href: '#projects',   label: 'Projects'   },
    { href: '#contact',    label: 'Contact'    },
  ]

  const handleLogout = () => { logout(); navigate('/') }

  const linkClass = (id) =>
    `transition-colors font-medium ${activeSection === id ? 'text-primary' : 'text-gray-400 hover:text-primary'}`

  return (
    <nav className={`fixed w-full top-0 z-50 glass border-b border-borderLight px-6 py-4 transition-all duration-300 ${scrolled ? 'shadow-[0_4px_30px_rgba(var(--color-primary-rgb),0.07)]' : ''}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center relative z-10">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-black font-bold text-xl shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.4)] group-hover:shadow-[0_0_25px_rgba(var(--color-primary-rgb),0.7)] transition-all">N</div>
          <span className="text-xl font-bold tracking-wider text-white">Nuwan MC</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400 bg-black/40 px-6 py-2.5 rounded-full border border-primary/20">
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} className={linkClass(href.slice(1))}>{label}</a>
          ))}
          {user && (
            <a href="#feedback" className={linkClass('feedback')}>
              <span className="text-primary">⚡</span> Feedback
            </a>
          )}
        </div>

        {/* Right CTA — auth-aware */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-black bg-primary px-4 py-2 rounded-xl hover:bg-white transition-all shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.3)]">
                  <i className="ph ph-squares-four" /> Admin Panel
                </Link>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-400 glass px-4 py-2 rounded-xl border-primary/20">
                <i className="ph ph-user-circle text-primary" />
                <span className="max-w-[100px] truncate">{user.name}</span>
              </div>
              <button onClick={handleLogout}
                className="text-sm font-mono text-gray-500 hover:text-red-400 px-3 py-2 rounded-xl hover:bg-red-950/40 transition-all border border-transparent hover:border-red-500/30">
                <i className="ph ph-sign-out" />
              </button>
            </>
          ) : (
            <Link to="/auth/login"
              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-black transition-all border border-primary/50 px-5 py-2.5 rounded-xl hover:bg-primary hover:border-primary">
              Get In Touch <i className="ph ph-terminal-window" />
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button id="mobile-menu-btn" className="md:hidden text-primary p-2 rounded-lg border border-primary/30 hover:bg-primary/10 transition-all"
          onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <i className={`ph ${mobileOpen ? 'ph-x' : 'ph-list'} text-2xl`} />
        </button>
      </div>

      {/* Mobile Overlay Backdrop */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" 
          onClick={() => setMobileOpen(false)} 
        />
      )}
      
      {/* Mobile Drawer */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-64 glass border-l border-primary/20 p-6 space-y-6 z-50 transition-transform duration-300 transform ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-end">
          <button onClick={() => setMobileOpen(false)} className="text-primary p-2 rounded-lg border border-primary/30 hover:bg-primary/10 transition-all">
            <i className="ph ph-x text-2xl" />
          </button>
        </div>
        <div className="flex flex-col space-y-4">
          {navLinks.map(({ href, label }) => (
            <a key={href} href={href} className="block text-gray-400 hover:text-primary font-medium font-mono transition-colors"
              onClick={() => setMobileOpen(false)}>&gt; {label}</a>
          ))}
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block text-primary font-mono">&gt; Admin Panel</Link>
              )}
              <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="block text-red-400 font-mono text-sm text-left">&gt; Logout</button>
            </>
          ) : (
            <Link to="/auth/login" onClick={() => setMobileOpen(false)} className="block mt-4 text-center text-sm font-bold text-black bg-primary hover:bg-white transition-colors rounded-xl py-3">
              Get In Touch
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
