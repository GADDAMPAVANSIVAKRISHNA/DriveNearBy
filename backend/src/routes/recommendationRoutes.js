const express = require('express');
const router = express.Router();
const { getPersonalizedRecommendations } = require('../controllers/recommendationController');

router.get('/', getPersonalizedRecommendations);

module.exports = router;
