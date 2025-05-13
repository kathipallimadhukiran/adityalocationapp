const express = require('express');
const router = express.Router();
const staffController = require('../controllers/Location/Getlocation');

// Get current location of a staff member
router.get('/:id/location', staffController.getLocation);

// Post or update location of a staff member
router.post('/:id/location', staffController.updateLocation);
router.get('/staff/ids', staffController.getAllStaffIds); // ✅ New route

module.exports = router;
