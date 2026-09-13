import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState('idle') // idle | loading | sent
  const [error,   setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('loading')
    try {
      await axios.post(`${API}/auth/forgot-password`, { email })
      setStatus('sent')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send email.')
      setStatus('idle')
    }
  }

  return (
    <div className="min-h-screen bg-bgDark flex items-center justify-center px-4 relative">
      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
            <i className="ph ph-envelope-open text-2xl text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Forgot Password</h1>
          <p className="text-primary font-mono text-sm mt-2">&gt; Initiating password recovery_</p>
        </div>

        <div className="glass p-8 rounded-3xl border-primary/20">
          {status === 'sent' ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/30">
                <i className="ph-fill ph-check-circle text-3xl text-primary" />
              </div>
              <h3 className="text-white font-bold text-xl font-mono">&gt; PACKET SENT_</h3>
              <p className="text-gray-400 font-mono text-sm">If that email is registered, a reset link has been dispatched. Check your inbox.</p>
              <Link to="/auth/login" className="inline-block mt-4 text-primary font-mono text-sm hover:text-white transition-colors">
                &lt; Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-950/80 border border-red-500/50 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm font-mono">
                  <i className="ph-fill ph-warning-circle" /> {error}
                </div>
              )}
              <div>
                <label htmlFor="forgot-email" className="block text-primary font-mono text-sm mb-2">Email_Address</label>
                <input id="forgot-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@local.host"
                  className="w-full bg-black/80 border border-primary/30 rounded-xl px-4 py-3 text-white font-mono placeholder:text-gray-700 focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all" />
              </div>
              <button type="submit" disabled={status === 'loading'}
                className="w-full bg-primary hover:bg-white disabled:opacity-60 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                {status === 'loading' ? <><i className="ph ph-circle-notch animate-spin" /> Sending...</> : <><i className="ph-fill ph-paper-plane-tilt" /> Send Reset Link</>}
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
