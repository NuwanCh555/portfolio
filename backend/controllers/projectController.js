const Project = require('../models/Project')

// Seed data — auto-populated on first run if DB is empty
const SEED_PROJECTS = [
  { title: 'Smart Expense Tracker', description: 'Full-stack finance application with real-time visual analytics, JWT-protected API routes, and responsive dashboard.', category: 'web', tech: ['React', 'Node.js', 'MongoDB', 'JWT'], icon: 'ph-chart-line-up', order: 1 },
  { title: 'Ride-Sharing Core System', description: 'Vehicle booking and dynamic routing logic with optimized database queries and real-time seat tracking.', category: 'web', tech: ['Python', 'MySQL', 'REST API'], icon: 'ph-car', order: 2 },
  { title: 'Infra & Vulnerability Lab', description: 'Isolated environment for penetration testing, network analysis, and practising secure server configurations.', category: 'security', tech: ['Linux', 'Kali', 'Wireshark', 'Nmap'], icon: 'ph-shield-warning', order: 3 },
  { title: 'Creative Brand Studio', description: 'End-to-end promotional branding with interactive Figma prototypes and motion-graphics assets.', category: 'design', tech: ['Figma', 'Photoshop', 'After Effects'], icon: 'ph-paint-brush', order: 4 },
  { title: 'Auth Middleware API', description: 'Hardened backend API with encrypted JWT sessions, refresh-token rotation, and rate-limited endpoints.', category: 'web', tech: ['Node.js', 'Express', 'JWT', 'Helmet'], icon: 'ph-lock-key', order: 5 },
  { title: 'Secure Portfolio Backend', description: "This portfolio's own API — secured with regex validation, CORS, Helmet, rate-limiting, and MongoDB.", category: 'security', tech: ['Express', 'MongoDB', 'Helmet', 'CORS'], icon: 'ph-terminal-window', order: 6 },
]

// ────────────────────────────────────────────────────────────────────────────
// GET /api/projects  — PUBLIC
// ────────────────────────────────────────────────────────────────────────────
exports.getProjects = async (req, res) => {
  try {
    let projects = await Project.find({ isPublished: true }).sort({ order: 1, createdAt: -1 })

    // Auto-seed on first request if empty
    if (projects.length === 0) {
      projects = await Project.insertMany(SEED_PROJECTS)
    }

    res.json({ success: true, projects })
  } catch (err) {
    console.error('[projects/get]', err)
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// ────────────────────────────────────────────────────────────────────────────
// POST /api/projects  — ADMIN ONLY
// ────────────────────────────────────────────────────────────────────────────
exports.createProject = async (req, res) => {
  try {
    const { title, description, category, tech, icon, featured, order, liveUrl, repoUrl } = req.body
    if (!title || !description || !category)
      return res.status(400).json({ success: false, message: 'title, description, and category are required.' })

    const project = await Project.create({ title, description, category, tech: tech || [], icon, featured, order, liveUrl, repoUrl })
    res.status(201).json({ success: true, project })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// ────────────────────────────────────────────────────────────────────────────
// PUT /api/projects/:id  — ADMIN ONLY
// ────────────────────────────────────────────────────────────────────────────
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' })
    res.json({ success: true, project })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}

// ────────────────────────────────────────────────────────────────────────────
// DELETE /api/projects/:id  — ADMIN ONLY
// ────────────────────────────────────────────────────────────────────────────
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' })
    res.json({ success: true, message: 'Project deleted.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' })
  }
}
