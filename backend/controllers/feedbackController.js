const FeedbackMessage = require('../models/FeedbackMessage')

// ────────────────────────────────────────────────────────────────────────────
// POST /api/feedback  — AUTH REQUIRED
// ────────────────────────────────────────────────────────────────────────────
exports.submitFeedback = async (req, res) => {
  try {
    const { type, title, description, severity } = req.body

    if (!type || !title || !description)
      return res.status(400).json({ success: false, message: 'type, title, and description are required.' })

    if (!['bug', 'feedback', 'vulnerability', 'suggestion'].includes(type))
      return res.status(400).json({ success: false, message: 'Invalid report type.' })

    if (title.length > 150 || description.length > 3000)
      return res.status(400).json({ success: false, message: 'Field length exceeded.' })

    const feedback = await FeedbackMessage.create({
      user:        req.user._id,
      type,
      title:       title.trim(),
      description: description.trim(),
      severity:    severity || 'low',
    })

    res.status(201).json({ success: true, message: 'Report submitted successfully.', feedback })
  } catch (err) {
    console.error('[feedback/submit]', err)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// ────────────────────────────────────────────────────────────────────────────
// GET /api/feedback/my  — AUTH REQUIRED (own reports)
// ────────────────────────────────────────────────────────────────────────────
exports.getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await FeedbackMessage
      .find({ user: req.user._id })
      .sort({ createdAt: -1 })
    res.json({ success: true, feedbacks })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}
