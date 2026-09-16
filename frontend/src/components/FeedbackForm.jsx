import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/useAuth'

const API = import.meta.env.VITE_API_URL || '/api'

const SEVERITY_COLORS = {
  low:      'text-green-400  border-green-500/40  bg-green-950/40',
  medium:   'text-yellow-400 border-yellow-500/40 bg-yellow-950/40',
  high:     'text-orange-400 border-orange-500/40 bg-orange-950/40',
  critical: 'text-red-400    border-red-500/40    bg-red-950/40',
}

const TYPES = [
  { value: 'bug',           label: 'Bug Report',          icon: 'ph-bug' },
  { value: 'vulnerability', label: 'Vulnerability Report', icon: 'ph-shield-warning' },
  { value: 'feedback',      label: 'General Feedback',     icon: 'ph-chat-text' },
  { value: 'suggestion',    label: 'Suggestion',           icon: 'ph-lightbulb' },
]

const INITIAL = { type: 'feedback', title: '', description: '', severity: 'low' }

export default function FeedbackForm() {
  const { user } = useAuth()
  const [form,   setForm]   = useState(INITIAL)
  const [status, setStatus] = useState('idle')
  const [error,  setError]  = useState('')

  // Not shown if not logged in
  if (!user) return null

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.description.trim()) {
      return setError('Title and description are required.')
    }
    setStatus('loading')
    try {
      const { data } = await axios.post(`${API}/feedback`, form)
      if (data.success) {
        setStatus('success')
        setForm(INITIAL)
      } else {
        setError(data.message)
        setStatus('idle')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.')
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <section id="feedback" className="py-16 px-6 border-t border-borderLight">
        <div className="max-w-xl mx-auto text-center glass p-10 rounded-3xl border-primary/20">
          <i className="ph-fill ph-check-circle text-5xl text-primary mb-4 block" />
          <h3 className="text-xl font-bold text-white font-mono mb-2">&gt; REPORT SUBMITTED_</h3>
          <p className="text-gray-400 font-mono text-sm">Your report has been received. Thank you for helping improve the portfolio.</p>
          <button onClick={() => setStatus('idle')} className="mt-6 text-primary font-mono text-sm border border-primary/30 px-4 py-2 rounded-xl hover:bg-primary/10 transition-all">
            Submit another report
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="feedback" className="py-16 px-6 border-t border-primary/20 bg-primary/5">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-mono mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Authenticated User: {user.name}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Vulnerability &amp; Feedback Report</h2>
          <p className="text-gray-400 font-mono text-sm">&gt; Secure channel for authenticated users only.</p>
        </div>

        <div className="glass p-6 md:p-8 rounded-3xl border-primary/25">
          <form id="feedback-form" onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-950/80 border border-red-500/50 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm font-mono">
                <i className="ph-fill ph-warning-circle" /> {error}
              </div>
            )}

            {/* Type selector */}
            <div>
              <label className="block text-primary font-mono text-sm mb-3">Report_Type</label>
              <div className="grid grid-cols-2 gap-2">
                {TYPES.map(({ value, label, icon }) => (
                  <button key={value} type="button"
                    onClick={() => setForm({ ...form, type: value })}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-mono text-sm transition-all ${
                      form.type === value
                        ? 'bg-primary/20 border-primary text-primary'
                        : 'bg-black/60 border-primary/20 text-gray-400 hover:border-primary/40'
                    }`}>
                    <i className={`ph ${icon}`} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-primary font-mono text-sm mb-3">Severity_Level</label>
              <div className="flex gap-2 flex-wrap">
                {['low','medium','high','critical'].map((sev) => (
                  <button key={sev} type="button"
                    onClick={() => setForm({ ...form, severity: sev })}
                    className={`px-4 py-2 rounded-lg border font-mono text-xs capitalize transition-all ${
                      form.severity === sev ? SEVERITY_COLORS[sev] : 'bg-black/60 border-primary/20 text-gray-500 hover:border-primary/30'
                    }`}>
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="fb-title" className="block text-primary font-mono text-sm mb-2">Report_Title</label>
              <input id="fb-title" name="title" type="text" required value={form.title} onChange={handleChange}
                placeholder="Brief summary of the issue..."
                className="w-full bg-black/80 border border-primary/30 rounded-xl px-4 py-3 text-white font-mono placeholder:text-gray-700 focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.2)] transition-all" />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="fb-desc" className="block text-primary font-mono text-sm mb-2">Detailed_Description</label>
              <textarea id="fb-desc" name="description" rows={5} required value={form.description} onChange={handleChange}
                placeholder="Provide detailed steps to reproduce, expected vs actual behavior, or your suggestion..."
                className="w-full bg-black/80 border border-primary/30 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder:text-gray-700 focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.2)] transition-all resize-none" />
            </div>

            <button id="feedback-submit" type="submit" disabled={status === 'loading'}
              className="w-full bg-primary hover:bg-white disabled:opacity-60 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]">
              {status === 'loading'
                ? <><i className="ph ph-circle-notch animate-spin" /> Submitting Report...</>
                : <><i className="ph-fill ph-paper-plane-tilt" /> Submit Report</>}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
