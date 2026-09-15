const express    = require('express');
const router     = express.Router();
const { upload, cloudinary } = require('../config/cloudinary');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Portfolio  = require('../models/Portfolio');

// ── POST /api/upload ─────────────────────────────────────────────────────────
// Upload a file to Cloudinary; returns the secure URL
router.post('/', protect, adminOnly, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }
  res.status(200).json({
    success:   true,
    url:       req.file.path,
    public_id: req.file.filename,
  });
});

// ── DELETE /api/upload/profile-photo ─────────────────────────────────────────
// Clear profile photo from DB (and optionally destroy from Cloudinary)
router.delete('/profile-photo', protect, adminOnly, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne();
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found.' });

    // Optionally destroy from Cloudinary if public_id is derivable
    if (portfolio.profilePhotoUrl) {
      try {
        // Extract public_id from the Cloudinary URL (everything after /upload/ and before file extension)
        const match = portfolio.profilePhotoUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
        if (match) await cloudinary.uploader.destroy(match[1], { resource_type: 'image' });
      } catch (cdnErr) {
        console.warn('[upload/profile-photo delete] Cloudinary destroy failed:', cdnErr.message);
        // Non-fatal — we still clear the DB
      }
    }

    portfolio.profilePhotoUrl = '';
    await portfolio.save();
    res.json({ success: true, message: 'Profile photo removed.' });
  } catch (err) {
    console.error('[upload/profile-photo delete]', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ── DELETE /api/upload/cv ─────────────────────────────────────────────────────
// Clear CV from DB (and optionally destroy from Cloudinary)
router.delete('/cv', protect, adminOnly, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne();
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found.' });

    if (portfolio.cvUrl) {
      try {
        const match = portfolio.cvUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
        if (match) await cloudinary.uploader.destroy(match[1], { resource_type: 'raw' });
      } catch (cdnErr) {
        console.warn('[upload/cv delete] Cloudinary destroy failed:', cdnErr.message);
      }
    }

    portfolio.cvUrl = '';
    await portfolio.save();
    res.json({ success: true, message: 'CV removed.' });
  } catch (err) {
    console.error('[upload/cv delete]', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
