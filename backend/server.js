
require('dotenv').config()

const express        = require('express')
const helmet         = require('helmet')
const cors           = require('cors')
const connectDB      = require('./config/db')
const visitorMW      = require('./middleware/visitorMiddleware')

const authRoutes     = require('./routes/authRoutes')
const contactRoutes  = require('./routes/contactRoutes')
const feedbackRoutes = require('./routes/feedbackRoutes')
const projectRoutes  = require('./routes/projectRoutes')
const adminRoutes    = require('./routes/adminRoutes')

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB()

const app = express()

// ── Security Headers ──────────────────────────────────────────────────────────
app.use(helmet())

// ── Strict CORS ───────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
      cb(new Error(`CORS: ${origin} is not allowed`))
    },
    methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
)

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: false }))

// ── Visitor tracking (non-API routes only, handled inside middleware) ──────────
app.use(visitorMW)

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/contact',   contactRoutes)
app.use('/api/feedback',  feedbackRoutes)
app.use('/api/projects',  projectRoutes)
app.use('/api/admin',     adminRoutes)

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))
// — Root Route
app.get('/', (req, res) => {
    res.json({ success: true, message: "Portfolio Backend is running successfully!" });
});
// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.path} not found.` }))

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[Global Error]', err.message)
  const status = err.status || 500
  res.status(status).json({ success: false, message: err.message || 'Internal server error.' })
})

// Export for root server.js (local dev) and Vercel serverless
 module.exports = app
