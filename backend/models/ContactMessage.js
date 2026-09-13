const mongoose = require('mongoose')

const contactMessageSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true, maxlength: 100 },
    email:     { type: String, required: true, trim: true, maxlength: 254 },
    message:   { type: String, required: true, maxlength: 2000 },
    ip:        { type: String, default: '' },
    userAgent: { type: String, default: '' },
    isRead:    { type: Boolean, default: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model('ContactMessage', contactMessageSchema)
