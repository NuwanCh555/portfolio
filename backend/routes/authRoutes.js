const express    = require('express')
const rateLimit  = require('express-rate-limit')
const router     = express.Router()
const { register, login, getMe, forgotPassword, resetPassword } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { success: false, message: 'Too many auth attempts. Try again in 15 minutes.' } })

router.post('/register',        authLimiter, register)
router.post('/login',           authLimiter, login)
router.get( '/me',              protect,     getMe)
router.post('/forgot-password', authLimiter, forgotPassword)
router.post('/reset-password/:token', authLimiter, resetPassword)

module.exports = router
