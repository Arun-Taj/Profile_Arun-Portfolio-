const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

// File filter to accept only images and videos
const fileFilter = (req, file, cb) => {
  const allowedImageMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedVideoMimes = ['video/mp4', 'video/webm', 'video/quicktime'];
  const allowedMimes = [...allowedImageMimes, ...allowedVideoMimes];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpg, png, gif, webp) and videos (mp4, webm, mov) are allowed'), false);
  }
};

// Create multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

const uploadBufferToCloudinary = (file, folder = 'portfolio') => {
  return new Promise((resolve, reject) => {
    const isVideo = file.mimetype.startsWith('video/');
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isVideo ? 'video' : 'image',
        public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '-').toLowerCase()}`,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });
};

// Middleware for single file upload
const uploadSingle = upload.single('file');

// Middleware for multiple files upload
const uploadMultiple = upload.array('files', 10); // Max 10 files

// Middleware for mixed uploads (e.g., thumbnail + gallery images)
const uploadMixed = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'video', maxCount: 1 },
]);

// Error handling wrapper for upload middleware
const handleUploadError = (middleware) => {
  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size too large (max 50MB)' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ error: 'Too many files' });
        }
      }
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  };
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return;
  
  try {
    const uploadMarker = '/upload/';
    const markerIndex = imageUrl.indexOf(uploadMarker);
    if (markerIndex === -1) return;

    let publicPath = imageUrl.slice(markerIndex + uploadMarker.length);
    publicPath = publicPath.replace(/^v\d+\//, '');
    publicPath = publicPath.split('.')[0];

    const isVideo = /\/video\/upload\//.test(imageUrl);
    await cloudinary.uploader.destroy(publicPath, {
      resource_type: isVideo ? 'video' : 'image',
    });
  } catch (err) {
    console.error('Error deleting from Cloudinary:', err);
  }
};

// Delete multiple files from Cloudinary
const deleteMultipleFromCloudinary = async (imageUrls) => {
  if (!imageUrls || !Array.isArray(imageUrls)) return;
  
  try {
    const deletePromises = imageUrls.map(url => deleteFromCloudinary(url));
    await Promise.all(deletePromises);
  } catch (err) {
    console.error('Error deleting multiple files from Cloudinary:', err);
  }
};

module.exports = {
  upload,
  uploadSingle: handleUploadError(uploadSingle),
  uploadMultiple: handleUploadError(uploadMultiple),
  uploadMixed: handleUploadError(uploadMixed),
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  cloudinary,
};
