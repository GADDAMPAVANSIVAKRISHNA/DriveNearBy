const express = require('express');
const router = express.Router();
const { getNearbyDrivers, getDriverById } = require('../controllers/driverController');

// GET /api/drivers/nearby?lat={lat}&lng={lng}&radius={radius}&sortBy={sortBy}
router.get('/nearby', getNearbyDrivers);
router.get('/:id', getDriverById);

module.exports = router;
