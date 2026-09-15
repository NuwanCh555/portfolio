const crypto     = require('crypto')
const jwt        = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const User       = require('../models/User')

// ── Helper: sign JWT ──────────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

// ── Helper: nodemailer transporter ───────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
})

// ────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// ────────────────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required.' })

    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' })

    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists)
      return res.status(409).json({ success: false, message: 'Email already registered.' })

    const adminEmail = (process.env.ADMIN_EMAIL || 'nchathuranga533@gmail.com').toLowerCase()
    const role = (email.toLowerCase() === adminEmail) ? 'admin' : 'user'

    const user = await User.create({ name, email, password, role })
    const token = signToken(user._id)

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error('[auth/register]', err)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// ────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ────────────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required.' })

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials.' })

    if (!user.isActive)
      return res.status(403).json({ success: false, message: 'Account is deactivated.' })

    const adminEmail = (process.env.ADMIN_EMAIL || 'nchathuranga533@gmail.com').toLowerCase()
    
    // Enforce single super admin rule dynamically on login
    let roleUpdated = false
    if (user.email === adminEmail && user.role !== 'admin') {
      user.role = 'admin'
      roleUpdated = true
    } else if (user.email !== adminEmail && user.role === 'admin') {
      user.role = 'user'
      roleUpdated = true
    }
    
    if (roleUpdated) {
      await user.save()
    }

    const token = signToken(user._id)

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error('[auth/login]', err)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// ────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me  (protected)
// ────────────────────────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  res.json({
    success: true,
    user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role },
  })
}

// ────────────────────────────────────────────────────────────────────────────
// POST /api/auth/forgot-password
// ────────────────────────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email)
      return res.status(400).json({ success: false, message: 'Email is required.' })

    const user = await User.findOne({ email: email.toLowerCase() })
    // Always return 200 to prevent user enumeration
    if (!user)
      return res.json({ success: true, message: 'If that email exists, an OTP has been sent.' })

    // Generate secure 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otpHashed = crypto.createHash('sha256').update(otpCode).digest('hex')

    user.otpCode    = otpHashed
    user.otpExpires = Date.now() + 10 * 60 * 1000 // 10 minutes
    await user.save({ validateBeforeSave: false })

    await transporter.sendMail({
      from:    `"Nuwan MC Portfolio" <${process.env.EMAIL_USER}>`,
      to:       user.email,
      subject: 'Your 6-Digit OTP — Nuwan MC Portfolio',
      html: `
        <div style="font-family:monospace;background:#030305;color:#e2e8f0;padding:40px;border-radius:12px;border:1px solid rgba(0,255,65,0.2)">
          <h2 style="color:#00ff41">&gt; OTP Verification Request_</h2>
          <p>You requested a password reset. Here is your 6-digit verification code. <strong>This code expires in 10 minutes.</strong></p>
          <div style="margin:30px 0;padding:20px;background:#0a0a0f;border:1px solid #00ff41;text-align:center;font-size:32px;letter-spacing:10px;font-weight:bold;color:#00ff41;">
            ${otpCode}
          </div>
          <p style="color:#6b7280;font-size:12px">If you did not request this, ignore this email. Your password is safe.</p>
        </div>
      `,
    })

    res.json({ success: true, message: 'If that email exists, an OTP has been sent.' })
  } catch (err) {
    console.error('[auth/forgot-password]', err)
    res.status(500).json({ success: false, message: err.message || 'Could not send reset email.' })
  }
}

// ────────────────────────────────────────────────────────────────────────────
// POST /api/auth/reset-password
// ────────────────────────────────────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { email, otpCode, newPassword } = req.body
    if (!email || !otpCode || !newPassword)
      return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required.' })
      
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' })

    // Hash the incoming OTP to compare against DB
    const otpHashed = crypto
      .createHash('sha256')
      .update(otpCode)
      .digest('hex')

    const user = await User.findOne({
      email: email.toLowerCase(),
      otpCode: otpHashed,
      otpExpires: { $gt: Date.now() },
    })

    if (!user)
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' })

    user.password   = newPassword
    user.otpCode    = undefined
    user.otpExpires = undefined
    await user.save()

    const token = signToken(user._id)
    res.json({
      success: true,
      token,
      message: 'Password reset successful.',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error('[auth/reset-password]', err)
    res.status(500).json({ success: false, message: err.message || 'Server error.' })
  }
}
