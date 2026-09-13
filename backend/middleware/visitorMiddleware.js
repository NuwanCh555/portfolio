const geoip     = require('geoip-lite')
const VisitorLog = require('../models/VisitorLog')

// Initialise Telegram bot lazily — compatible with node-telegram-bot-api v0.x and v2.x
let bot = null
const initBot = () => {
  if (bot || !process.env.TELEGRAM_BOT_TOKEN) return
  try {
    const TelegramBot = require('node-telegram-bot-api')
    // Both v0.x and v2.x accept (token, options) constructor
    bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false })
  } catch (err) {
    console.error('[Telegram] Failed to initialise bot:', err.message)
  }
}

// ── Send Telegram alert ───────────────────────────────────────────────────────
const sendTelegramAlert = async (visitor) => {
  initBot() // lazy initialise on first use
  if (!bot || !process.env.TELEGRAM_CHAT_ID) return
  try {
    const msg = [
      `🛡️ *NEW VISITOR — Portfolio*`,
      ``,
      `🌍 *Location:* ${visitor.city}, ${visitor.country}`,
      `🖥️ *IP:* \`${visitor.ip}\``,
      `📄 *Path:* \`${visitor.path}\``,
      `🔗 *Referer:* ${visitor.referer || 'Direct'}`,
      `📱 *UA:* ${visitor.userAgent.slice(0, 80)}...`,
      `🕐 *Time:* ${new Date().toUTCString()}`,
    ].join('\n')

    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, msg, {
      parse_mode: 'Markdown',
    })
  } catch (err) {
    console.error('[Telegram] Alert failed:', err.message)
  }
}

// ── Visitor tracking middleware ───────────────────────────────────────────────
const visitorMiddleware = async (req, res, next) => {
  // Skip API routes and static assets from tracking
  if (req.path.startsWith('/api/') || req.path.includes('.')) return next()

  try {
    // Get real IP (handles proxies / Vercel)
    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      'unknown'

    // GeoIP lookup
    const geo     = geoip.lookup(ip) || {}
    const country = geo.country || 'Unknown'
    const city    = (geo.city    || 'Unknown')
    const region  = (geo.region  || '')

    // Check if this IP has visited in the last 24h (unique visitor logic)
    const oneDayAgo    = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const existingVisit = await VisitorLog.findOne({ ip, createdAt: { $gte: oneDayAgo } })
    const isUnique     = !existingVisit

    // Save to DB
    const logEntry = await VisitorLog.create({
      ip,
      userAgent:         req.headers['user-agent'] || '',
      country,
      city,
      region,
      path:    req.path,
      referer: req.headers['referer'] || '',
      isUnique,
      telegramAlertSent: false,
    })

    // Send Telegram alert for unique visitors only
    initBot() // ensure bot is initialized before checking
    if (isUnique && bot) {
      await sendTelegramAlert({ ip, city, country, path: req.path, referer: req.headers['referer'] || '', userAgent: req.headers['user-agent'] || '' })
      await VisitorLog.findByIdAndUpdate(logEntry._id, { telegramAlertSent: true })
    }
  } catch (err) {
    // Never crash the server due to tracking errors
    console.error('[Visitor] Middleware error:', err.message)
  }

  next()
}

module.exports = visitorMiddleware
