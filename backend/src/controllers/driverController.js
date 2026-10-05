const Driver = require('../models/Driver');
const { mockDrivers } = require('../utils/seedData');
const { calculateDriverMatchScore } = require('../services/aiRecommendationService');
const { success, error } = require('../utils/responseHelper');

// In-memory store initialized with realistic demo data
let driversMemoryStore = JSON.parse(JSON.stringify(mockDrivers));

const getNearbyDrivers = async (req, res) => {
  try {
    const { lat, lng, radius = 10, sortBy = 'ai_recommended', minRating, maxPrice } = req.query;

    let drivers = [...driversMemoryStore];

    // Compute AI match score for each driver based on distance, rating, trips, price
    drivers = drivers.map((driver) => {
      const matchData = calculateDriverMatchScore(driver, {
        maxDistance: Number(radius),
        priority: sortBy,
      });
      return {
        ...driver,
        aiMatchScore: matchData.matchScore,
        aiRecommendationReason: matchData.reasoning,
        aiBadge: matchData.badge,
      };
    });

    // Filtering
    if (minRating) {
      drivers = drivers.filter((d) => d.rating >= Number(minRating));
    }
    if (maxPrice) {
      drivers = drivers.filter((d) => d.pricing.perDay <= Number(maxPrice));
    }

    // Sorting
    if (sortBy === 'ai_recommended') {
      drivers.sort((a, b) => b.aiMatchScore - a.aiMatchScore);
    } else if (sortBy === 'distance') {
      drivers.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortBy === 'rating') {
      drivers.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price_asc') {
      drivers.sort((a, b) => a.pricing.perDay - b.pricing.perDay);
    } else if (sortBy === 'price_desc') {
      drivers.sort((a, b) => b.pricing.perDay - a.pricing.perDay);
    }

    return success(res, {
      total: drivers.length,
      currentCoordinates: { lat: Number(lat) || 12.9716, lng: Number(lng) || 77.5946 },
      drivers,
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getDriverById = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = driversMemoryStore.find((d) => d.id === id || d._id === id);
    if (!driver) {
      return error(res, 'Driver not found', 404);
    }

    const matchData = calculateDriverMatchScore(driver);

    return success(res, {
      ...driver,
      aiMatchScore: matchData.matchScore,
      aiRecommendationReason: matchData.reasoning,
      aiBadge: matchData.badge,
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = {
  getNearbyDrivers,
  getDriverById,
  driversMemoryStore,
};
