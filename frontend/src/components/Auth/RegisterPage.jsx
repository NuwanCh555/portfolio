import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirm: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    if (form.password.length < 6)      return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      const data = await register(form.name, form.email, form.password)
      if (data.success) navigate('/')
      else setError(data.message || 'Registration failed.')
    } catch (err) {
      setError(err.response?.data?.message || 'Connection error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bgDark flex items-center justify-center px-4 relative">
      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-black font-bold text-xl shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.4)]">N</div>
            <span className="text-xl font-bold text-white">Nuwan MC</span>
          </Link>
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
            <i className="ph ph-user-plus text-2xl text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Create Account</h1>
          <p className="text-primary font-mono text-sm mt-2">&gt; Initialize new user profile_</p>
        </div>

        <div className="glass p-8 rounded-3xl border-primary/20">
          <form id="register-form" onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-950/80 border border-red-500/50 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm font-mono">
                <i className="ph-fill ph-warning-circle flex-shrink-0" /> {error}
              </div>
            )}

            {[
              { id: 'reg-name',     name: 'name',     label: 'Display_Name',    type: 'text',     placeholder: 'root' },
              { id: 'reg-email',    name: 'email',    label: 'Email_Address',   type: 'email',    placeholder: 'user@local.host' },
              { id: 'reg-password', name: 'password', label: 'Password',        type: 'password', placeholder: '••••••••' },
              { id: 'reg-confirm',  name: 'confirm',  label: 'Confirm_Password',type: 'password', placeholder: '••••••••' },
            ].map(({ id, name, label, type, placeholder }) => (
              <div key={name}>
                <label htmlFor={id} className="block text-primary font-mono text-sm mb-2">{label}</label>
                <input id={id} name={name} type={type} required value={form[name]}
                  onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-black/80 border border-primary/30 rounded-xl px-4 py-3 text-white font-mono placeholder:text-gray-700 focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.2)] transition-all" />
              </div>
            ))}

            <button id="register-submit" type="submit" disabled={loading}
              className="w-full bg-primary hover:bg-white disabled:opacity-60 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]">
              {loading ? <><i className="ph ph-circle-notch animate-spin" /> Creating...</> : <><i className="ph-fill ph-user-circle-plus" /> Create Account</>}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm font-mono mt-6">
            Have an account? <Link to="/auth/login" className="text-primary hover:text-white transition-colors">Login here</Link>
          </p>
        </div>
        <p className="text-center text-gray-600 text-xs font-mono mt-4">
          <Link to="/" className="hover:text-primary transition-colors">&lt; Back to Portfolio</Link>
        </p>
      </div>
    </div>
  )
}
