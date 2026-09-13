const ContactMessage  = require('../models/ContactMessage')
const FeedbackMessage = require('../models/FeedbackMessage')
const VisitorLog      = require('../models/VisitorLog')
const User            = require('../models/User')

// ── Dashboard stats ───────────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [totalContacts, unreadContacts, totalFeedbacks, openFeedbacks,
           totalVisitors, uniqueVisitors, totalUsers] = await Promise.all([
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ isRead: false }),
      FeedbackMessage.countDocuments(),
      FeedbackMessage.countDocuments({ status: 'open' }),
      VisitorLog.countDocuments(),
      VisitorLog.countDocuments({ isUnique: true }),
      User.countDocuments(),
    ])

    // Visitors in the last 7 days by day
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const visitorsByDay = await VisitorLog.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, isUnique: true } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])

    res.json({
      success: true,
      stats: { totalContacts, unreadContacts, totalFeedbacks, openFeedbacks, totalVisitors, uniqueVisitors, totalUsers, visitorsByDay },
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// ── Contact messages ──────────────────────────────────────────────────────────
exports.getContacts = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 })
    res.json({ success: true, messages })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

exports.markContactRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true })
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found.' })
    res.json({ success: true, message: msg })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

exports.deleteContact = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Deleted.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// ── Feedback messages ─────────────────────────────────────────────────────────
exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await FeedbackMessage.find().populate('user', 'name email').sort({ createdAt: -1 })
    res.json({ success: true, feedbacks })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body
    const fb = await FeedbackMessage.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(adminNotes !== undefined && { adminNotes }) },
      { new: true }
    ).populate('user', 'name email')
    if (!fb) return res.status(404).json({ success: false, message: 'Feedback not found.' })
    res.json({ success: true, feedback: fb })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// ── Visitor logs ──────────────────────────────────────────────────────────────
exports.getVisitors = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1
    const limit = parseInt(req.query.limit) || 50
    const visitors = await VisitorLog.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
    const total = await VisitorLog.countDocuments()
    res.json({ success: true, visitors, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// ── Users ─────────────────────────────────────────────────────────────────────
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json({ success: true, users })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body
    if (!['user', 'admin'].includes(role))
      return res.status(400).json({ success: false, message: 'Invalid role.' })
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ success: false, message: 'Cannot change your own role.' })
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' })
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}
