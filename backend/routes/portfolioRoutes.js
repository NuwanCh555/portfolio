const express = require('express')
const router = express.Router()
const { getPortfolio, updatePortfolio } = require('../controllers/portfolioController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/', getPortfolio)
router.put('/', protect, adminOnly, updatePortfolio)

module.exports = router
