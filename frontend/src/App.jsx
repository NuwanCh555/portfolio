import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState }    from 'react'
import axios from 'axios'
import { AuthProvider } from './context/AuthContext'
import { useAuth }      from './context/useAuth'

// Public sections
import Navbar     from './components/Navbar'
import Hero       from './components/Hero'
import About      from './components/About'
import Skills     from './components/Skills'
import Experience from './components/Experience'
import Projects   from './components/Projects'
import Contact    from './components/Contact'
import FeedbackForm from './components/FeedbackForm'
import Footer     from './components/Footer'

// Auth pages
import LoginPage      from './components/Auth/LoginPage'
import RegisterPage   from './components/Auth/RegisterPage'
import ForgotPassword from './components/Auth/ForgotPassword'

// Admin
import AdminDashboard from './components/Dashboard/AdminDashboard'

// ── Portfolio page (all sections) ────────────────────────────────────────────
function PortfolioPage() {
  const [portfolio, setPortfolio] = useState(null)
  const [hackerMode, setHackerMode] = useState(false)
  const [initializing, setInitializing] = useState(false)

  const toggleHackerMode = () => {
    if (hackerMode) {
      setHackerMode(false);
      document.documentElement.classList.remove('hacker-mode');
    } else {
      setInitializing(true);
      setTimeout(() => {
        setInitializing(false);
        setHackerMode(true);
        document.documentElement.classList.add('hacker-mode');
      }, 2000);
    }
  }

  useEffect(() => {
    // Fetch portfolio data
    axios.get(`${import.meta.env.VITE_API_URL || '/api'}/portfolio`)
      .then(({ data }) => setPortfolio(data.data))
      .catch(console.error)

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('active') }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    const els = document.querySelectorAll('.reveal')
    els.forEach((el) => observer.observe(el))
    return () => els.forEach((el) => observer.unobserve(el))
  }, [])

  return (
    <div className="antialiased relative">
      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />
      
      {hackerMode && (
        <div className="fixed inset-0 pointer-events-none z-[1] flex items-center justify-center opacity-10">
          <div className="text-[15vw] font-bold text-primary tracking-widest uppercase">ROOT</div>
        </div>
      )}

      {initializing && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl px-6">
            <p className="text-red-500 font-mono text-xl mb-4 animate-pulse">&gt; INITIALIZING_ROOT_ACCESS...</p>
            <p className="text-red-500 font-mono text-xl mb-8">&gt; BYPASSING_FIREWALL...</p>
            <div className="w-full h-1 bg-red-900 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-full origin-left animate-[scale-x_2s_ease-out]" style={{ animationName: 'scaleX', animationDuration: '2s', animationTimingFunction: 'linear' }} />
            </div>
            <style>{`@keyframes scaleX { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }`}</style>
          </div>
        </div>
      )}

      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <Navbar />
      <main className="relative z-10">
        <Hero portfolio={portfolio} toggleHackerMode={toggleHackerMode} />
        <About portfolio={portfolio} />
        <Skills portfolio={portfolio} />
        <Experience portfolio={portfolio} />
        <Projects />
        <Contact />
        <FeedbackForm />   {/* Only visible when logged in */}
      </main>
      <Footer />
    </div>
  )
}

// ── Admin route guard ─────────────────────────────────────────────────────────
function AdminRoute({ children }) {
  const { user, loading, logout } = useAuth()
  
  if (loading) return <div className="min-h-screen bg-bgDark flex items-center justify-center text-primary font-mono animate-pulse">&gt; Verifying credentials...</div>
  
  if (!user) return <Navigate to="/auth/login" replace />
  
  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-bgDark flex flex-col items-center justify-center px-4 text-center">
        <i className="ph-fill ph-shield-warning text-6xl text-red-500 mb-4 animate-pulse" />
        <h1 className="text-3xl text-white font-bold mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-8 max-w-md font-mono text-sm">
          You are currently authenticated as a standard user ({user.email}). Administrator privileges are required to access this sector.
        </p>
        <div className="flex gap-4">
          <a href="/" className="px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 rounded-xl transition-colors font-mono">
            &lt; Go Back
          </a>
          <button 
            onClick={() => { logout(); window.location.href = '/auth/login' }} 
            className="px-6 py-3 bg-primary text-black hover:bg-white font-bold rounded-xl shadow-[0_0_15px_rgba(0,255,65,0.3)] transition-all flex items-center gap-2"
          >
            <i className="ph ph-sign-out" /> Logout & Switch Account
          </button>
        </div>
      </div>
    )
  }
  
  return children
}

// ── Auth route guard (redirect if already logged in) ─────────────────────────
function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={user.role === 'admin' ? '/dashboard' : '/'} replace />
  return children
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public portfolio */}
          <Route path="/" element={<PortfolioPage />} />

          {/* Auth pages — only accessible when logged OUT */}
          <Route path="/auth/login"          element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/auth/register"        element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/auth/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

          {/* Admin dashboard — admin role only */}
          <Route path="/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
