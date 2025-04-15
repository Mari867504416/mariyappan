const express = require('express');
const officerController = require('../controllers/officerController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.post('/activate', officerController.activateOfficer);
router.get('/me', officerController.getOfficerProfile);

module.exports = router;