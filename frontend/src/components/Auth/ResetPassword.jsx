import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/useAuth'

const API = import.meta.env.VITE_API_URL || '/api'

export default function ResetPassword() {
  const { token }  = useParams()
  const navigate   = useNavigate()
  const { login }  = useAuth()
  const [form,    setForm]    = useState({ password: '', confirm: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    if (form.password.length < 6)      return setError('Minimum 6 characters required.')
    setLoading(true)
    try {
      const { data } = await axios.post(`${API}/auth/reset-password/${token}`, { password: form.password })
      if (data.success) {
        setDone(true)
        setTimeout(() => navigate('/auth/login'), 2500)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset link.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bgDark flex items-center justify-center px-4 relative">
      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
            <i className="ph ph-lock-open text-2xl text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Reset Password</h1>
          <p className="text-primary font-mono text-sm mt-2">&gt; Set your new credentials_</p>
        </div>

        <div className="glass p-8 rounded-3xl border-primary/20">
          {done ? (
            <div className="text-center space-y-4">
              <i className="ph-fill ph-check-circle text-5xl text-primary" />
              <p className="text-white font-bold font-mono">&gt; PASSWORD UPDATED. Redirecting...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="bg-red-950/80 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm font-mono flex items-center gap-2"><i className="ph-fill ph-warning-circle" />{error}</div>}
              {['password', 'confirm'].map((field) => (
                <div key={field}>
                  <label htmlFor={`reset-${field}`} className="block text-primary font-mono text-sm mb-2">
                    {field === 'password' ? 'New_Password' : 'Confirm_Password'}
                  </label>
                  <input id={`reset-${field}`} name={field} type="password" required value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-black/80 border border-primary/30 rounded-xl px-4 py-3 text-white font-mono placeholder:text-gray-700 focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all" />
                </div>
              ))}
              <button type="submit" disabled={loading}
                className="w-full bg-primary hover:bg-white disabled:opacity-60 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                {loading ? <><i className="ph ph-circle-notch animate-spin" />Updating...</> : <><i className="ph-fill ph-lock-key" />Update Password</>}
              </button>
            </form>
          )}
        </div>
        <p className="text-center text-gray-600 text-xs font-mono mt-4">
          <Link to="/auth/login" className="hover:text-primary transition-colors">&lt; Back to Login</Link>
        </p>
      </div>
    </div>
  )
}
