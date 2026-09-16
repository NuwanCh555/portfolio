import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

export default function LoginPage() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const [form,     setForm]     = useState({ email: '', password: '' })
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(form.email, form.password)
      if (data.success) {
        navigate(data.user.role === 'admin' ? '/dashboard' : '/')
      } else {
        setError(data.message || 'Login failed.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Connection error. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bgDark flex items-center justify-center px-4 relative">
      {/* Background effects */}
      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-black font-bold text-xl shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.4)] group-hover:shadow-[0_0_25px_rgba(var(--color-primary-rgb),0.7)] transition-all">N</div>
            <span className="text-xl font-bold text-white">Nuwan MC</span>
          </Link>
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]">
            <i className="ph ph-lock-key text-2xl text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Access Gateway</h1>
          <p className="text-primary font-mono text-sm mt-2">&gt; Authenticate to proceed_</p>
        </div>

        {/* Form card */}
        <div className="glass p-8 rounded-3xl border-primary/20 shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.06)]">
          <form id="login-form" onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="bg-red-950/80 border border-red-500/50 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm font-mono">
                <i className="ph-fill ph-warning-circle flex-shrink-0" /> {error}
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="block text-primary font-mono text-sm mb-2">Email_Address</label>
              <input id="login-email" name="email" type="email" required value={form.email} onChange={handleChange}
                placeholder="admin@local.host"
                className="w-full bg-black/80 border border-primary/30 rounded-xl px-4 py-3 text-white font-mono placeholder:text-gray-700 focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.2)] transition-all" />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-primary font-mono text-sm mb-2">Password</label>
              <div className="relative">
                <input id="login-password" name="password" type={showPass ? 'text' : 'password'} required value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-black/80 border border-primary/30 rounded-xl px-4 py-3 pr-12 text-white font-mono placeholder:text-gray-700 focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.2)] transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors">
                  <i className={`ph ${showPass ? 'ph-eye-slash' : 'ph-eye'} text-lg`} />
                </button>
              </div>
              <div className="text-right mt-2">
                <Link to="/auth/forgot-password" className="text-xs font-mono text-gray-500 hover:text-primary transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button id="login-submit" type="submit" disabled={loading}
              className="w-full bg-primary hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]">
              {loading ? <><i className="ph ph-circle-notch animate-spin" /> Authenticating...</> : <><i className="ph-fill ph-sign-in" /> Login</>}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm font-mono mt-6">
            No account?{' '}
            <Link to="/auth/register" className="text-primary hover:text-white transition-colors">Register here</Link>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs font-mono mt-4">
          <Link to="/" className="hover:text-primary transition-colors">&lt; Back to Portfolio</Link>
        </p>
      </div>
    </div>
  )
}
