const express = require('express');
const router = express.Router();
const { getNearbyCars, getCarById, getCombos } = require('../controllers/carController');

// GET /api/cars/nearby?lat={lat}&lng={lng}&radius={radius}
router.get('/nearby', getNearbyCars);
router.get('/combos', getCombos);
router.get('/:id', getCarById);

module.exports = router;
