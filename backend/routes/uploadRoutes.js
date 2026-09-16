const express    = require('express');
const router     = express.Router();
const { upload, cloudinary } = require('../config/cloudinary');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Portfolio  = require('../models/Portfolio');

// ── POST /api/upload ──────────────────────────────────────────────────────────
// Wraps multer in a Promise so we can catch and surface the EXACT Cloudinary
// error instead of silently swallowing it.
router.post('/', protect, adminOnly, async (req, res) => {
  // Run multer manually so errors don't disappear
  const runUpload = () =>
    new Promise((resolve, reject) => {
      upload.single('file')(req, res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

  try {
    await runUpload();

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file was received by the server.' });
    }

    return res.status(200).json({
      success:   true,
      url:       req.file.path,
      public_id: req.file.filename,
    });
  } catch (err) {
    // Log the full Cloudinary / multer error server-side
    console.error('[POST /api/upload] Cloudinary/multer error:', err);

    // Return the exact error message to the frontend
    const message = err?.message || err?.error?.message || JSON.stringify(err);
    return res.status(500).json({
      success: false,
      message: `Upload failed: ${message}`,
    });
  }
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

// ── DELETE /api/upload/hacker-profile-photo ──────────────────────────────────
// Clear hacker profile photo from DB (and optionally destroy from Cloudinary)
router.delete('/hacker-profile-photo', protect, adminOnly, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne();
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio not found.' });

    if (portfolio.hackerProfileImage) {
      try {
        const match = portfolio.hackerProfileImage.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
        if (match) await cloudinary.uploader.destroy(match[1], { resource_type: 'image' });
      } catch (cdnErr) {
        console.warn('[upload/hacker-profile-photo delete] Cloudinary destroy failed:', cdnErr.message);
      }
    }

    portfolio.hackerProfileImage = '';
    await portfolio.save();
    res.json({ success: true, message: 'Hacker mode profile photo removed.' });
  } catch (err) {
    console.error('[upload/hacker-profile-photo delete]', err);
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
