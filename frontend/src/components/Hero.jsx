import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'
const TITLES = [
  'Full-Stack Developer',
  'Cyber Security Engineer',
  'UI/UX Enthusiast',
  'CTF Competitor',
]

export default function Hero({ toggleHackerMode, hackerMode }) {
  const [portfolio, setPortfolio] = useState(null)
  const [titleIdx,  setTitleIdx]  = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting,  setDeleting]  = useState(false)
  const [clicks, setClicks] = useState(0)
  const [holdTimer, setHoldTimer] = useState(null)
  const [isTouched, setIsTouched] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    axios.get(`${API}/portfolio`)
      .then(({ data }) => setPortfolio(data.data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (clicks === 3) {
      if (toggleHackerMode) toggleHackerMode(true) // entering
      setClicks(0)
    } else if (clicks > 0) {
      const timer = setTimeout(() => setClicks(0), 500)
      return () => clearTimeout(timer)
    }
  }, [clicks, toggleHackerMode])

  const handlePointerDown = () => {
    const timer = setTimeout(() => {
      if (toggleHackerMode) toggleHackerMode(false) // exiting
    }, 3000)
    setHoldTimer(timer)
  }

  const handlePointerUp = () => {
    if (holdTimer) {
      clearTimeout(holdTimer)
      setHoldTimer(null)
    }
  }

  // ── Typewriter effect ────────────────────────────────────────────────────
  useEffect(() => {
    const full = TITLES[titleIdx]
    let timeout

    if (!deleting && displayed.length < full.length) {
      timeout = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 70)
    } else if (!deleting && displayed.length === full.length) {
      timeout = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setTitleIdx((i) => (i + 1) % TITLES.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, titleIdx])

  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-20 pb-10 px-6"
    >
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12 w-full reveal active">

        {/* ── Left: Text Content ── */}
        <div className="md:w-3/5 space-y-6">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/50 bg-primary/10 text-primary text-xs font-medium font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            System Online | Secure Port 443
          </div>

          {/* Headline */}
          <h1 
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] select-none"
            onContextMenu={(e) => e.preventDefault()}
            style={{ WebkitTouchCallout: 'none' }}
          >
            Architecting <br />
            <span className="text-gradient">Secure Digital</span> <br />
            Systems.
          </h1>

          {/* Typewriter subtitle */}
          <p 
            className="text-primary font-mono text-lg select-none"
            onContextMenu={(e) => e.preventDefault()}
            style={{ WebkitTouchCallout: 'none' }}
          >
            &gt; {displayed}<span className="cursor">_</span>
          </p>

          {/* Bio */}
          <p 
            className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed select-none"
            onContextMenu={(e) => e.preventDefault()}
            style={{ WebkitTouchCallout: 'none' }}
          >
            I am <span className="text-primary font-medium">Nuwan MC</span>, a
            Full-Stack Developer &amp; Cyber Security Enthusiast specializing in
            robust software architectures and zero-trust IT infrastructure.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="#projects"
              id="hero-explore-btn"
              className="flex items-center gap-2 px-7 py-3.5 bg-primary text-black hover:bg-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)]"
            >
              Explore Projects <i className="ph ph-arrow-right text-lg" />
            </a>
            <a
              href={portfolio?.cvUrl || "/cv.pdf"}
              download
              id="hero-cv-btn"
              className="flex items-center gap-2 px-7 py-3.5 border border-primary/50 hover:border-primary text-primary font-medium rounded-xl transition-all bg-primary/5 hover:bg-primary/10"
            >
              Download CV <i className="ph ph-download-simple" />
            </a>
          </div>

          {/* Social links row */}
          <div className="flex items-center gap-4 pt-2">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <i className="ph ph-github-logo text-2xl" />
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <i className="ph ph-linkedin-logo text-2xl" />
            </a>
            <a
              href="#contact"
              className="text-gray-500 hover:text-primary transition-colors"
              aria-label="Email"
            >
              <i className="ph ph-envelope-simple text-2xl" />
            </a>
          </div>
        </div>

        {/* ── Right: Profile Image ── */}
        <div className="md:w-2/5 flex justify-center relative">
          <div className="relative w-72 h-72 md:w-[26rem] md:h-[26rem]">
            {/* Ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-[60px] opacity-30 animate-pulse" />
            {/* Glass ring */}
            <div 
              className="absolute inset-2 rounded-full border border-primary/30 p-2 glass bg-gray-900/50 cursor-pointer"
              onClick={() => setClicks(c => c + 1)}
              onMouseDown={handlePointerDown}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchEnd={handlePointerUp}
            >
              {(hackerMode && portfolio?.hackerProfileImage) || portfolio?.profilePhotoUrl ? (
                <img
                  src={hackerMode && portfolio?.hackerProfileImage ? portfolio.hackerProfileImage : portfolio?.profilePhotoUrl}
                  alt="Nuwan MC — Cyber Security Developer"
                  loading="eager"
                  fetchPriority="high"
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full h-full object-cover rounded-full mix-blend-screen select-none filter contrast-125 transition-all duration-700 grayscale ${isTouched ? 'grayscale-0' : 'md:hover:grayscale-0'} ${imageLoaded ? 'opacity-90' : 'opacity-0'}`}
                  onTouchStart={() => {
                    setIsTouched(true);
                    setTimeout(() => setIsTouched(false), 2000);
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                  style={{ WebkitTouchCallout: 'none' }}
                />
              ) : (
                <img
                  src={hackerMode ? "/hacker-mask.jpeg" : "/profile.jpeg"}
                  alt="Nuwan MC — Cyber Security Developer"
                  loading="eager"
                  fetchPriority="high"
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full h-full object-cover rounded-full mix-blend-screen select-none filter contrast-125 transition-all duration-700 grayscale ${isTouched ? 'grayscale-0' : 'md:hover:grayscale-0'} ${imageLoaded ? 'opacity-90' : 'opacity-0'}`}
                  onTouchStart={() => {
                    setIsTouched(true);
                    setTimeout(() => setIsTouched(false), 2000);
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                  style={{ WebkitTouchCallout: 'none' }}
                />
              )}
            </div>
            {/* Orbiting decoration dots */}
            <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.8)] animate-pulse" />
            <div className="absolute bottom-8 left-2 w-2 h-2 bg-secondary rounded-full shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse-slow" />
          </div>
        </div>

      </div>
    </section>
  )
}
