const express  = require('express')
const router   = express.Router()
const { submitFeedback, getMyFeedback } = require('../controllers/feedbackController')
const { protect } = require('../middleware/authMiddleware')

// All feedback routes require authentication
router.use(protect)
router.post('/',   submitFeedback)
router.get('/my',  getMyFeedback)

module.exports = router
