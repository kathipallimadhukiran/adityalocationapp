const express = require('express');
const router = express.Router();
const { recognizeFace } = require('../controllers/Location/Face_recog');  // Import the recognizeFace function

// Route for face recognition
router.post('/', recognizeFace);

module.exports = router;
