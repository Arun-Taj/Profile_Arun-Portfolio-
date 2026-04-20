const express = require('express');
const { protect } = require('../middleware/auth');
const { uploadSingle, uploadMultiple, uploadBufferToCloudinary } = require('../middleware/upload');

const router = express.Router();

router.post('/single', protect, uploadSingle, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const uploaded = await uploadBufferToCloudinary(req.file);

    return res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        format: uploaded.format,
        resourceType: uploaded.resource_type,
        bytes: uploaded.bytes,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

router.post('/multiple', protect, uploadMultiple, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = await Promise.all(req.files.map((file) => uploadBufferToCloudinary(file)));

    const files = uploadedFiles.map((file) => ({
      url: file.secure_url,
      publicId: file.public_id,
      format: file.format,
      resourceType: file.resource_type,
      bytes: file.bytes,
    }));

    return res.status(201).json({
      message: 'Files uploaded successfully',
      files,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

module.exports = router;
