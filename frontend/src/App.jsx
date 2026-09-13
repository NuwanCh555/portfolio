import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect }    from 'react'
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
import ResetPassword  from './components/Auth/ResetPassword'

// Admin
import AdminDashboard from './components/Dashboard/AdminDashboard'

// ── Portfolio page (all sections) ────────────────────────────────────────────
function PortfolioPage() {
  useEffect(() => {
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
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
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
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-bgDark flex items-center justify-center text-primary font-mono animate-pulse">&gt; Verifying credentials...</div>
  if (!user || user.role !== 'admin') return <Navigate to="/auth/login" replace />
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
          <Route path="/auth/reset-password/:token" element={<ResetPassword />} />

          {/* Admin dashboard — admin role only */}
          <Route path="/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
