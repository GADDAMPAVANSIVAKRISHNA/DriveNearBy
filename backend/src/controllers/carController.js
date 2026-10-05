const { mockCars, mockCombos } = require('../utils/seedData');
const { calculateCarMatchScore } = require('../services/aiRecommendationService');
const { success, error } = require('../utils/responseHelper');

let carsMemoryStore = JSON.parse(JSON.stringify(mockCars));
let combosMemoryStore = JSON.parse(JSON.stringify(mockCombos));

const getNearbyCars = async (req, res) => {
  try {
    const { lat, lng, radius = 15, category, transmission, sortBy = 'ai_recommended' } = req.query;

    let cars = carsMemoryStore.map((car) => {
      const match = calculateCarMatchScore(car, { maxDistance: Number(radius) });
      return {
        ...car,
        aiMatchScore: match.matchScore,
        aiBadge: match.badge,
        aiRecommendationReason: match.reasoning,
      };
    });

    if (category) {
      cars = cars.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }
    if (transmission) {
      cars = cars.filter((c) => c.transmission.toLowerCase() === transmission.toLowerCase());
    }

    if (sortBy === 'ai_recommended') {
      cars.sort((a, b) => b.aiMatchScore - a.aiMatchScore);
    } else if (sortBy === 'distance') {
      cars.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortBy === 'rating') {
      cars.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price_asc') {
      cars.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === 'price_desc') {
      cars.sort((a, b) => b.pricePerDay - a.pricePerDay);
    }

    return success(res, {
      total: cars.length,
      currentCoordinates: { lat: Number(lat) || 12.9716, lng: Number(lng) || 77.5946 },
      cars,
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = carsMemoryStore.find((c) => c.id === id || c._id === id);
    if (!car) {
      return error(res, 'Car not found', 404);
    }

    const match = calculateCarMatchScore(car);
    return success(res, {
      ...car,
      aiMatchScore: match.matchScore,
      aiBadge: match.badge,
      aiRecommendationReason: match.reasoning,
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getCombos = async (req, res) => {
  try {
    return success(res, {
      total: combosMemoryStore.length,
      combos: combosMemoryStore,
    }, 'Available Car + Driver combinations');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = {
  getNearbyCars,
  getCarById,
  getCombos,
  carsMemoryStore,
  combosMemoryStore,
};
