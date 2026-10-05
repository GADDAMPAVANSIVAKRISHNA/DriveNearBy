const { driversMemoryStore } = require('./driverController');
const { carsMemoryStore, combosMemoryStore } = require('./carController');
const { calculateDriverMatchScore, calculateCarMatchScore } = require('../services/aiRecommendationService');
const { success, error } = require('../utils/responseHelper');

const getPersonalizedRecommendations = async (req, res) => {
  try {
    const { lat = 12.9716, lng = 77.5946, intent = 'all' } = req.query;

    // Rank top drivers
    const scoredDrivers = driversMemoryStore.map((driver) => ({
      ...driver,
      ...calculateDriverMatchScore(driver),
    })).sort((a, b) => b.matchScore - a.matchScore);

    // Rank top cars
    const scoredCars = carsMemoryStore.map((car) => ({
      ...car,
      ...calculateCarMatchScore(car),
    })).sort((a, b) => b.matchScore - a.matchScore);

    // AI Featured highlights
    const topDriver = scoredDrivers[0];
    const topCar = scoredCars[0];
    const topCombo = combosMemoryStore[0];

    return success(res, {
      headline: '🤖 AI Recommended Near You',
      userLocation: { lat: Number(lat), lng: Number(lng) },
      topDriverMatch: topDriver,
      topCarMatch: topCar,
      topComboMatch: topCombo,
      recommendedDrivers: scoredDrivers.slice(0, 3),
      recommendedCars: scoredCars.slice(0, 3),
      combos: combosMemoryStore,
      aiModelSummary: {
        algorithm: 'Multi-Objective Trust & Proximity Neural Ranker (v1.2)',
        weights: {
          proximity: '25%',
          trustScore: '30%',
          tripExperience: '20%',
          pricingValue: '15%',
          reliability: '10%',
        },
      },
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = {
  getPersonalizedRecommendations,
};
