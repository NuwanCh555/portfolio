const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: 'xea6s9si',
  api_key: '976926576387694',
  api_secret: 'nlbQLZsV0XQ7kfaxkODEK7hfC7k',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio',
    // Allow standard image formats and pdfs for CV
    allowed_formats: ['jpg', 'png', 'pdf', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
