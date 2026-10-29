const express = require('express');
const router = express.Router();
const googleController = require('../controllers/googleController');

router.get('/init', googleController.initiateGoogleAuth);
router.get('/continue', googleController.googleCallback);

module.exports = router;
