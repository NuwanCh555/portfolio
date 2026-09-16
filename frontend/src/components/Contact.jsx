import { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'
const URL_REGEX = /(https?:\/\/|www\.|\.com|\.net|\.lk|\.org|\.io|\.co\b)/i
const INITIAL_FORM = { name: '', email: '', message: '' }

// ── Contact Info Data ─────────────────────────────────────────────────────────
const CONTACT_DETAILS = [
  { icon: 'ph-user',          label: 'Name',     value: 'Nuwan MC'                    },
  { icon: 'ph-map-pin',       label: 'Location', value: 'Balangoda, Sri Lanka'         },
  { icon: 'ph-phone',         label: 'Phone',    value: '076 621 4785 / 074 221 4785'  },
  { icon: 'ph-envelope',      label: 'Email',    value: 'nchathuranga533@gmail.com', link: 'mailto:nchathuranga533@gmail.com' },
]

export default function Contact() {
  const [form,    setForm]    = useState(INITIAL_FORM)
  const [errors,  setErrors]  = useState({})
  const [status,  setStatus]  = useState('idle')
  const [apiMsg,  setApiMsg]  = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim())    errs.name    = 'Name is required.'
    else if (URL_REGEX.test(form.name)) errs.name = 'FIREWALL: URLs are blocked.'
    if (!form.email.trim())   errs.email   = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.'
    if (!form.message.trim()) errs.message = 'Message cannot be empty.'
    else if (URL_REGEX.test(form.message)) errs.message = 'FIREWALL ALERT: URLs & external links are blocked.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('loading'); setApiMsg('')
    try {
      const { data } = await axios.post(`${API}/contact`, form)
      if (data.success) { setStatus('success'); setForm(INITIAL_FORM) }
      else { setStatus('error'); setApiMsg(data.message || 'Transmission failed.') }
    } catch (err) {
      setStatus('error')
      setApiMsg(err.response?.data?.message || 'Network error.')
    }
  }

  return (
    <section id="contact" className="py-24 px-6 border-t border-borderLight bg-black/40">
      <div className="max-w-7xl mx-auto">

        {/* ── Section Heading ── */}
        <div className="flex items-center gap-4 mb-14 reveal">
          <h2 className="text-3xl md:text-4xl font-bold text-white whitespace-nowrap">Get In Touch</h2>
          <div className="h-px bg-borderLight flex-1" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 reveal">

          {/* ── Left: Contact Info ── */}
          <div className="space-y-6">
            <div className="mb-8">
              <p className="text-gray-400 text-lg leading-relaxed">
                I'm available for freelance projects, collaborations, and full-time opportunities.
                Feel free to reach out through any of the channels below.
              </p>
            </div>

            {/* Contact detail cards */}
            <div className="space-y-4">
              {CONTACT_DETAILS.map(({ icon, label, value, link }) => (
                <div key={label} className="glass p-4 rounded-2xl border-primary/20 flex items-center gap-4 hover:border-primary/40 transition-all group">
                  <div className="w-11 h-11 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.2)] transition-all">
                    <i className={`ph ${icon} text-xl text-primary`} />
                  </div>
                  <div>
                    <div className="text-gray-500 font-mono text-xs uppercase tracking-wide">{label}</div>
                    {link
                      ? <a href={link} className="text-white hover:text-primary transition-colors font-medium">{value}</a>
                      : <div className="text-white font-medium">{value}</div>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4 pt-4">
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 glass border-primary/20 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all">
                <i className="ph ph-github-logo text-xl" />
              </a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 glass border-primary/20 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/50 transition-all">
                <i className="ph ph-linkedin-logo text-xl" />
              </a>
            </div>
          </div>

          {/* ── Right: Contact Form ── */}
          <div>
            {status === 'success' ? (
              <div className="glass p-10 rounded-3xl border-primary/30 text-center h-full flex items-center justify-center">
                <div>
                  <i className="ph-fill ph-check-circle text-5xl text-primary mb-4 block" />
                  <h3 className="text-xl font-bold text-white font-mono mb-2">&gt; MESSAGE TRANSMITTED_</h3>
                  <p className="text-gray-400 font-mono text-sm mb-6">I'll respond within 24 hours.</p>
                  <button onClick={() => setStatus('idle')} className="text-primary font-mono text-sm border border-primary/30 px-4 py-2 rounded-xl hover:bg-primary/10 transition-all">
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass p-6 md:p-8 rounded-3xl border-primary/20">
                <div className="flex items-center gap-3 mb-6">
                  <i className="ph ph-shield-check text-primary text-xl" />
                  <h3 className="text-white font-bold">Secure Message Form</h3>
                  <span className="ml-auto text-xs font-mono text-gray-600 bg-black/40 px-2 py-1 rounded-full border border-primary/10">URL-Blocked</span>
                </div>

                <form id="contact-form" onSubmit={handleSubmit} noValidate className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="contact-name" className="block text-primary font-mono text-sm mb-2">User_Name</label>
                    <input id="contact-name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="root"
                      className={`w-full bg-black/80 border rounded-xl px-4 py-3 text-white font-mono placeholder:text-gray-700 focus:outline-none transition-all ${errors.name ? 'border-red-500/60' : 'border-primary/30 focus:border-primary focus:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.2)]'}`} />
                    {errors.name && <p className="mt-1 text-xs font-mono text-red-400 flex items-center gap-1"><i className="ph-fill ph-warning-circle" />{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className="block text-primary font-mono text-sm mb-2">Email_Address</label>
                    <input id="contact-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="admin@local.host"
                      className={`w-full bg-black/80 border rounded-xl px-4 py-3 text-white font-mono placeholder:text-gray-700 focus:outline-none transition-all ${errors.email ? 'border-red-500/60' : 'border-primary/30 focus:border-primary focus:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.2)]'}`} />
                    {errors.email && <p className="mt-1 text-xs font-mono text-red-400 flex items-center gap-1"><i className="ph-fill ph-warning-circle" />{errors.email}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="block text-primary font-mono text-sm mb-2">Payload_Data</label>
                    <textarea id="contact-message" name="message" rows={5} value={form.message} onChange={handleChange} placeholder="Type your secure message here..."
                      className={`w-full bg-black/80 border rounded-xl px-4 py-3 text-white font-mono text-sm placeholder:text-gray-700 focus:outline-none transition-all resize-none ${errors.message ? 'border-red-500/60' : 'border-primary/30 focus:border-primary focus:shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.2)]'}`} />
                    {errors.message && (
                      <div id="error-box" className="mt-2 bg-red-950/80 border border-red-500/50 text-red-400 p-3 rounded-xl flex items-center gap-3">
                        <i className="ph-fill ph-warning-circle text-lg flex-shrink-0" />
                        <span className="text-xs font-mono">{errors.message}</span>
                      </div>
                    )}
                  </div>

                  {status === 'error' && (
                    <div className="bg-red-950/80 border border-red-500/50 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm font-mono">
                      <i className="ph-fill ph-x-circle" /> {apiMsg}
                    </div>
                  )}

                  <button id="contact-submit-btn" type="submit" disabled={status === 'loading'}
                    className="w-full bg-primary hover:bg-white disabled:opacity-60 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]">
                    {status === 'loading'
                      ? <><i className="ph ph-circle-notch animate-spin" /> Transmitting...</>
                      : <><i className="ph-fill ph-lock-key" /> Transmit Data</>}
                  </button>
                </form>
              </div>
            )}

            {/* Security badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {['Rate Limited','URL Blocked','Helmet.js','CORS Strict','MongoDB'].map((b) => (
                <span key={b} className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary/70 flex items-center gap-1">
                  <i className="ph ph-shield-check text-xs" /> {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
