const nodemailer     = require('nodemailer')
const ContactMessage = require('../models/ContactMessage')

const URL_REGEX = /(https?:\/\/|www\.|\.com|\.net|\.lk|\.org|\.io|\.co\b)/i

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
})

const safe = (str) =>
  str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')

// ────────────────────────────────────────────────────────────────────────────
// POST /api/contact  — PUBLIC
// ────────────────────────────────────────────────────────────────────────────
exports.submitContact = async (req, res) => {
  try {
    const { name, message } = req.body
    const email = req.user.email

    // Presence
    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: 'All fields are required.' })

    // Types & lengths
    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string')
      return res.status(400).json({ success: false, message: 'Invalid field types.' })

    if (name.length > 100 || email.length > 254 || message.length > 2000)
      return res.status(400).json({ success: false, message: 'Field length exceeded.' })

    // Email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ success: false, message: 'Invalid email address.' })

    // URL / link injection check
    if (URL_REGEX.test(name) || URL_REGEX.test(message))
      return res.status(400).json({ success: false, message: 'FIREWALL: URLs and external links are blocked.' })

    const ip        = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || ''
    const userAgent = req.headers['user-agent'] || ''

    // Save to DB
    await ContactMessage.create({ name: name.trim(), email: email.trim().toLowerCase(), message: message.trim(), ip, userAgent })

    // Send email notification
    await transporter.sendMail({
      from:    `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to:       process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo:  email,
      subject: `[Portfolio] New message from ${safe(name)}`,
      html: `
        <div style="font-family:monospace;background:#030305;color:#e2e8f0;padding:40px;border-radius:12px;border:1px solid rgba(0,255,65,0.2)">
          <h2 style="color:#00ff41">⚡ SECURE TRANSMISSION</h2>
          <p style="color:#6b7280">&gt; New public contact form submission</p>
          <div style="margin:20px 0;padding:16px;background:rgba(0,255,65,0.05);border:1px solid rgba(0,255,65,0.15);border-radius:8px">
            <p><strong style="color:#00ff41">Name:</strong> ${safe(name)}</p>
            <p><strong style="color:#00ff41">Email:</strong> ${safe(email)}</p>
            <p><strong style="color:#00ff41">Message:</strong><br/><span style="white-space:pre-wrap">${safe(message)}</span></p>
          </div>
          <p style="color:#4b5563;font-size:11px">IP: ${ip} | UA: ${safe(userAgent.slice(0,80))}</p>
        </div>
      `,
    })

    res.status(200).json({ success: true, message: 'Message transmitted successfully.' })
  } catch (err) {
    console.error('[contact/submit]', err)
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
}
