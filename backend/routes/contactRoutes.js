const express   = require('express')
const rateLimit = require('express-rate-limit')
const router    = express.Router()
const { submitContact } = require('../controllers/contactController')
const { protect } = require('../middleware/authMiddleware')

const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: { success: false, message: 'Too many messages. Try again in 15 minutes.' } })

router.post('/', protect, contactLimiter, submitContact)

module.exports = router
