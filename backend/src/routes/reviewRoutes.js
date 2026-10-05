const express = require('express');
const router = express.Router();
const { submitReview, getReviewsForEntity } = require('../controllers/reviewController');

router.post('/', submitReview);
router.get('/target/:targetId', getReviewsForEntity);

module.exports = router;
