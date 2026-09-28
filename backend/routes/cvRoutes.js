const express = require('express')
const https   = require('https')
const http    = require('http')
const router  = express.Router()
const Portfolio = require('../models/Portfolio')

/**
 * GET /api/cv/download
 *
 * Fetches the stored Cloudinary PDF URL from the database, then pipes it back
 * to the client with:
 *   Content-Type: application/pdf
 *   Content-Disposition: inline; filename="Nuwan_MC_CV.pdf"
 *
 * This forces the browser to open the PDF inline in a new tab while ensuring
 * the browser's "Save As" dialog pre-fills the correct filename.
 */
router.get('/download', async (req, res) => {
  try {
    // Pull the current CV URL from DB
    const portfolio = await Portfolio.findOne().lean()
    const cvUrl = portfolio?.cvUrl

    if (!cvUrl) {
      return res.status(404).json({ success: false, message: 'No CV uploaded yet.' })
    }

    // Choose http or https based on the URL
    const transport = cvUrl.startsWith('https') ? https : http

    const proxyReq = transport.get(cvUrl, (upstream) => {
      const status = upstream.statusCode || 200

      if (status < 200 || status >= 400) {
        upstream.resume() // drain
        return res.status(502).json({ success: false, message: 'Failed to fetch CV from storage.' })
      }

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', 'inline; filename="Nuwan_MC_CV.pdf"')

      // Forward Content-Length if present so the browser shows download progress
      if (upstream.headers['content-length']) {
        res.setHeader('Content-Length', upstream.headers['content-length'])
      }

      res.status(200)
      upstream.pipe(res)
    })

    proxyReq.on('error', (err) => {
      console.error('[CV Proxy] Upstream request error:', err.message)
      if (!res.headersSent) {
        res.status(502).json({ success: false, message: 'Error streaming CV.' })
      }
    })

  } catch (err) {
    console.error('[CV Route] Error:', err.message)
    res.status(500).json({ success: false, message: 'Internal server error.' })
  }
})

module.exports = router
