const express  = require('express')
const router   = express.Router()
const { protect, adminOnly } = require('../middleware/authMiddleware')
const {
  getStats, getContacts, markContactRead, deleteContact,
  getFeedbacks, updateFeedbackStatus, getVisitors, getUsers, updateUserRole,
} = require('../controllers/adminController')

// All admin routes require auth + admin role
router.use(protect, adminOnly)

router.get('/stats',                    getStats)
router.get('/contacts',                 getContacts)
router.patch('/contacts/:id/read',      markContactRead)
router.delete('/contacts/:id',          deleteContact)
router.get('/feedbacks',                getFeedbacks)
router.patch('/feedbacks/:id/status',   updateFeedbackStatus)
router.get('/visitors',                 getVisitors)
router.get('/users',                    getUsers)
router.patch('/users/:id/role',         updateUserRole)

module.exports = router
