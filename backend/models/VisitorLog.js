const mongoose = require('mongoose')

const visitorLogSchema = new mongoose.Schema(
  {
    ip:                 { type: String, required: true },
    userAgent:          { type: String, default: '' },
    country:            { type: String, default: 'Unknown' },
    city:               { type: String, default: 'Unknown' },
    region:             { type: String, default: '' },
    path:               { type: String, default: '/' },
    referer:            { type: String, default: '' },
    isUnique:           { type: Boolean, default: false },
    telegramAlertSent:  { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Index for quick unique-IP lookups
visitorLogSchema.index({ ip: 1, createdAt: -1 })

module.exports = mongoose.model('VisitorLog', visitorLogSchema)
