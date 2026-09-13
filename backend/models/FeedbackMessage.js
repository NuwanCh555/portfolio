const mongoose = require('mongoose')

const feedbackMessageSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    type: {
      type:     String,
      enum:     ['bug', 'feedback', 'vulnerability', 'suggestion'],
      required: true,
    },
    title:       { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, maxlength: 3000 },
    severity: {
      type:    String,
      enum:    ['low', 'medium', 'high', 'critical'],
      default: 'low',
    },
    status: {
      type:    String,
      enum:    ['open', 'in-review', 'resolved', 'closed'],
      default: 'open',
    },
    adminNotes: { type: String, default: '', maxlength: 1000 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('FeedbackMessage', feedbackMessageSchema)
