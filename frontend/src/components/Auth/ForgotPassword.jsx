import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || '/api')

export default function ForgotPassword() {
  const [step, setStep] = useState(1) // 1: Request OTP, 2: Verify & Reset
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRequestOTP = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('loading')
    try {
      await axios.post(`${API}/auth/forgot-password`, { email })
      setStatus('idle')
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.')
      setStatus('idle')
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setError('')
    setStatus('loading')
    try {
      await axios.post(`${API}/auth/reset-password`, { email, otpCode, newPassword })
      setStatus('success')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP or failed to reset.')
      setStatus('idle')
    }
  }

  return (
    <div className="min-h-screen bg-bgDark flex items-center justify-center px-4 relative">
      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
            <i className={`ph ${step === 1 ? 'ph-envelope-open' : 'ph-shield-check'} text-2xl text-primary`} />
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            {step === 1 ? 'Password Recovery' : 'Verify & Reset'}
          </h1>
          <p className="text-primary font-mono text-sm mt-2">
            &gt; {step === 1 ? 'Initiating secure OTP dispatch_' : 'Awaiting verification code_'}
          </p>
        </div>

        <div className="glass p-8 rounded-3xl border-primary/20">
          {status === 'success' ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/30">
                <i className="ph-fill ph-check-circle text-3xl text-primary" />
              </div>
              <h3 className="text-white font-bold text-xl font-mono">&gt; RESET_SUCCESSFUL_</h3>
              <p className="text-gray-400 font-mono text-sm">Your password has been securely updated. You can now access the system.</p>
              <button onClick={() => navigate('/auth/login')} className="w-full mt-4 bg-primary hover:bg-white text-black font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]">
                Proceed to Login
              </button>
            </div>
          ) : step === 1 ? (
            <form onSubmit={handleRequestOTP} className="space-y-5">
              {error && (
                <div className="bg-red-950/80 border border-red-500/50 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm font-mono">
                  <i className="ph-fill ph-warning-circle" /> {error}
                </div>
              )}
              <div>
                <label htmlFor="forgot-email" className="block text-primary font-mono text-sm mb-2">Email_Address</label>
                <input id="forgot-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@local.host"
                  className="w-full bg-black/80 border border-primary/30 rounded-xl px-4 py-3 text-white font-mono placeholder:text-gray-700 focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.2)] transition-all" />
              </div>
              <button type="submit" disabled={status === 'loading'}
                className="w-full bg-primary hover:bg-white disabled:opacity-60 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]">
                {status === 'loading' ? <><i className="ph ph-circle-notch animate-spin" /> Dispatching...</> : <><i className="ph-fill ph-paper-plane-tilt" /> Request OTP</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="bg-primary/10 border border-primary/30 text-primary p-3 rounded-xl flex items-center gap-2 text-sm font-mono mb-6">
                <i className="ph-fill ph-check-circle" /> &gt; OTP_DISPATCHED_TO_INBOX_
              </div>
              {error && (
                <div className="bg-red-950/80 border border-red-500/50 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm font-mono">
                  <i className="ph-fill ph-warning-circle" /> {error}
                </div>
              )}
              <div>
                <label className="block text-primary font-mono text-sm mb-2">6-Digit_OTP_Code</label>
                <input type="text" required maxLength="6" value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full bg-black/80 border border-primary/30 rounded-xl px-4 py-3 text-white font-mono tracking-[0.5em] text-center text-lg placeholder:text-gray-700 focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.2)] transition-all" />
              </div>
              <div>
                <label className="block text-primary font-mono text-sm mb-2">New_Password</label>
                <input type="password" required minLength="6" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/80 border border-primary/30 rounded-xl px-4 py-3 text-white font-mono placeholder:text-gray-700 focus:outline-none focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-primary font-mono text-sm mb-2">Confirm_Password</label>
                <input type="password" required minLength="6" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/80 border border-primary/30 rounded-xl px-4 py-3 text-white font-mono placeholder:text-gray-700 focus:outline-none focus:border-primary transition-all" />
              </div>
              <button type="submit" disabled={status === 'loading'}
                className="w-full bg-primary hover:bg-white disabled:opacity-60 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]">
                {status === 'loading' ? <><i className="ph ph-circle-notch animate-spin" /> Verifying...</> : <><i className="ph-fill ph-lock-key" /> Reset Password</>}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-center text-gray-500 hover:text-primary transition-colors font-mono text-xs mt-2">
                &lt; Did not receive OTP? Resend
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
