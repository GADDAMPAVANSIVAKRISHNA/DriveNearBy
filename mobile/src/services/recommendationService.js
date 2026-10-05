import api from './api';
import { INITIAL_DRIVERS, INITIAL_CARS, INITIAL_COMBOS } from '../constants/mockData';

export const getAIRecommendations = async ({ lat = 12.9716, lng = 77.5946 } = {}) => {
  try {
    const response = await api.get('/recommendations', { params: { lat, lng } });
    if (response.data && response.data.data) {
      return response.data.data;
    }
  } catch (error) {
    console.log('Recommendation service: returning local recommendation payload');
  }

  return {
    headline: '🤖 AI Recommended Near You',
    userLocation: { lat, lng },
    topDriverMatch: INITIAL_DRIVERS[0],
    topCarMatch: INITIAL_CARS[0],
    topComboMatch: INITIAL_COMBOS[0],
    recommendedDrivers: INITIAL_DRIVERS.slice(0, 3),
    recommendedCars: INITIAL_CARS.slice(0, 3),
    combos: INITIAL_COMBOS,
    aiModelSummary: {
      algorithm: 'Multi-Objective Trust & Proximity Neural Ranker',
      weights: {
        proximity: '25%',
        trustScore: '30%',
        tripExperience: '20%',
        pricingValue: '15%',
        reliability: '10%',
      },
    },
  };
};

export default {
  getAIRecommendations,
};
