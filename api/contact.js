// ─────────────────────────────────────────────────────────────────────────────
//  api/contact.js  —  Vercel Serverless Function
//  POST /api/contact
//  Security: helmet · cors (strict) · express-rate-limit · URL regex validation
//  Transport: nodemailer → Gmail SMTP (App Password)
// ─────────────────────────────────────────────────────────────────────────────

const express    = require('express')
const nodemailer = require('nodemailer')
const helmet     = require('helmet')
const cors       = require('cors')
const rateLimit  = require('express-rate-limit')

const app = express()

// ── 1. HTTP Security Headers (Helmet) ────────────────────────────────────────
app.use(helmet())

// ── 2. Strict CORS ───────────────────────────────────────────────────────────
//    Only allow requests from the production domain and local dev
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  // After deploying to Vercel, add your live URL here AND set it as FRONTEND_URL env var:
  // 'https://your-project-name.vercel.app',
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server (no origin) and listed origins
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS policy violation: origin ${origin} blocked.`))
      }
    },
    methods:     ['POST', 'OPTIONS'],
    credentials: false,
  })
)

// ── 3. Body Parser ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })) // Cap payload size

// ── 4. Rate Limiter (anti-spam / DoS protection) ─────────────────────────────
const contactLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,  // 15 minutes
  max:              5,                // max 5 requests per window per IP
  standardHeaders:  true,
  legacyHeaders:    false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again in 15 minutes.',
  },
})

// ── 5. URL Regex (server-side — defence-in-depth) ────────────────────────────
//    Blocks: http://, https://, www., .com, .net, .lk, .org, .io, .co
const URL_REGEX = /(https?:\/\/|www\.|\.com|\.net|\.lk|\.org|\.io|\.co\b)/i

function containsURL(str) {
  return URL_REGEX.test(str)
}

// ── 6. Nodemailer Transporter (Gmail + App Password) ─────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // set in Vercel env vars
    pass: process.env.EMAIL_PASS, // Gmail App Password (not login password)
  },
})

// ── 7. POST /api/contact ──────────────────────────────────────────────────────
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body

    // ── Presence validation ──────────────────────────────────────────────────
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      })
    }

    // ── Type validation ──────────────────────────────────────────────────────
    if (
      typeof name    !== 'string' ||
      typeof email   !== 'string' ||
      typeof message !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid field types.',
      })
    }

    // ── Length limits ────────────────────────────────────────────────────────
    if (name.length > 100 || email.length > 254 || message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Field length exceeded.',
      })
    }

    // ── Email format validation ──────────────────────────────────────────────
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address format.',
      })
    }

    // ── URL / Link injection check (all fields) ──────────────────────────────
    if (containsURL(name) || containsURL(message)) {
      return res.status(400).json({
        success: false,
        message: 'FIREWALL: URLs and external links are blocked in this form.',
      })
    }

    // ── Sanitise for HTML email (prevent XSS in email body) ─────────────────
    const safe = (str) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')

    const safeName    = safe(name.trim())
    const safeEmail   = safe(email.trim())
    const safeMessage = safe(message.trim())

    // ── Compose and send email ───────────────────────────────────────────────
    await transporter.sendMail({
      from:    `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to:       process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo:  safeEmail,
      subject: `[Portfolio] New message from ${safeName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Courier New', monospace; background: #030305; color: #e2e8f0; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #0a0a0f; border: 1px solid rgba(0,255,65,0.2); border-radius: 16px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #0a1f0a, #030305); padding: 32px; border-bottom: 1px solid rgba(0,255,65,0.2); }
            .header h1 { color: #00ff41; margin: 0; font-size: 22px; letter-spacing: 2px; }
            .header p { color: #6b7280; margin: 8px 0 0; font-size: 12px; }
            .body { padding: 32px; }
            .field { margin-bottom: 20px; }
            .label { color: #00ff41; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
            .value { color: #e2e8f0; background: rgba(0,255,65,0.05); border: 1px solid rgba(0,255,65,0.15); border-radius: 8px; padding: 12px 16px; font-size: 14px; }
            .footer { padding: 20px 32px; border-top: 1px solid rgba(0,255,65,0.1); color: #4b5563; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚡ SECURE TRANSMISSION</h1>
              <p>&gt; New contact form submission received</p>
            </div>
            <div class="body">
              <div class="field">
                <div class="label">// User_Name</div>
                <div class="value">${safeName}</div>
              </div>
              <div class="field">
                <div class="label">// Email_Address</div>
                <div class="value">${safeEmail}</div>
              </div>
              <div class="field">
                <div class="label">// Payload_Data</div>
                <div class="value" style="white-space:pre-wrap;">${safeMessage}</div>
              </div>
            </div>
            <div class="footer">
              Transmitted from nuwan-mc.vercel.app · Secured by Helmet.js + CORS + Rate-Limit
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return res.status(200).json({
      success: true,
      message: 'Message transmitted successfully.',
    })

  } catch (err) {
    console.error('[contact] Error:', err)
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    })
  }
})

// ── 8. Handle preflight OPTIONS ───────────────────────────────────────────────
app.options('/api/contact', cors())

// ── 9. Export for Vercel Serverless ──────────────────────────────────────────
module.exports = app
