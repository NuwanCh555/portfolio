const express  = require('express')
const router   = express.Router()
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/',      getProjects)                             // Public
router.post('/',     protect, adminOnly, createProject)       // Admin
router.put('/:id',   protect, adminOnly, updateProject)       // Admin
router.delete('/:id',protect, adminOnly, deleteProject)       // Admin

module.exports = router
