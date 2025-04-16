const express = require('express');
const officerController = require('../controllers/officerController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.post('/activate', officerController.activateOfficer);
router.get('/me', officerController.getOfficerProfile);

module.exports = router;
router.get('/debug', (req, res) => {
  res.json({
    controllerPath: path.resolve(__dirname, '../controllers/officerController.js'),
    exists: require('fs').existsSync(path.resolve(__dirname, '../controllers/officerController.js'))
  });
});
