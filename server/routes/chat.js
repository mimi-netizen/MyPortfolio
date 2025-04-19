const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadToLocal } = require('../config/s3'); // Changed from uploadToS3
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');
const wsManager = require('../utils/wsManager');
const chatService = require('../services/chatService');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Send message with file attachment
router.post('/send', protect, upload.single('file'), async (req, res) => {
  try {
    const attachments = req.file ? [{
      filename: req.file.filename,
      path: req.file.path,
      mimetype: req.file.mimetype
    }] : [];

    const message = await chatService.saveMessage(
      req.user._id,
      req.body.message,
      attachments
    );

    wsManager.broadcast({
      type: 'message',
      message
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload file to local storage
router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = await uploadToLocal(req.file); // Changed from uploadToS3
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get chat history
router.get('/history', protect, async (req, res) => {
  try {
    const messages = await chatService.getRecentMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
