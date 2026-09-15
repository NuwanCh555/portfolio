const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// ── Validate that credentials are present at startup ─────────────────────────
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn('[cloudinary] WARNING: One or more Cloudinary env vars are missing. Uploads will fail.');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key:    CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// ── Storage — resource_type:'auto' handles both images AND PDFs ───────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:        'portfolio',
    resource_type: 'auto',   // CRITICAL: allows PDF uploads alongside images
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
  },
});

// 10 MB file size limit
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

module.exports = { cloudinary, upload };
