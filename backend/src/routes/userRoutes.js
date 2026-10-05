const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getMe);

module.exports = router;
