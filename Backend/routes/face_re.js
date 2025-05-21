// Backend/routes/faceRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Store uploaded images temporarily in /uploads
const upload = multer({ dest: path.join(__dirname, '../uploads/') });

// Route to train face
router.post('/train-face', upload.single('image'), async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !req.file) {
      return res.status(400).json({ message: 'Email and image are required.' });
    }

    const filePath = req.file.path;
    const formData = new FormData();
    formData.append('email', email);
    formData.append('image', fs.createReadStream(filePath));

    const response = await axios.post('http://localhost:5000/train', formData, {
      headers: formData.getHeaders(),
    });

    // Delete image after upload
    fs.unlinkSync(filePath);

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Face training failed.' });
  }
});

// Route to recognize face
router.post('/recognize-face', upload.single('image'), async (req, res) => {
  try {
    const filePath = req.file.path;

    const formData = new FormData();
    formData.append('image', fs.createReadStream(filePath));

    const response = await axios.post('http://localhost:5000/recognize', formData, {
      headers: formData.getHeaders(),
    });

    fs.unlinkSync(filePath);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Face recognition failed.' });
  }
});

module.exports = router;
