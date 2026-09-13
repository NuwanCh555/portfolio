require('dotenv').config()
const app  = require('./backend/server')
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`\n  🛡️  Nuwan MC — MERN Portfolio API`)
  console.log(`  ➜  Local:     http://localhost:${PORT}`)
  console.log(`  ➜  Health:    http://localhost:${PORT}/api/health`)
  console.log(`  ➜  Auth:      POST /api/auth/login`)
  console.log(`  ➜  Contact:   POST /api/contact`)
  console.log(`  ➜  Feedback:  POST /api/feedback  [Auth Required]`)
  console.log(`  ➜  Projects:  GET  /api/projects`)
  console.log(`  ➜  Admin:     GET  /api/admin/stats [Admin Only]\n`)
})
