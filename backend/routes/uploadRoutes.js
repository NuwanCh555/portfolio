const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// POST /api/upload
router.post('/', protect, adminOnly, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  
  res.status(200).json({
    success: true,
    url: req.file.path,
    public_id: req.file.filename
  });
});

module.exports = router;
