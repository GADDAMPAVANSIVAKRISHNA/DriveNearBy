import api from './api';
import { INITIAL_DRIVERS } from '../constants/mockData';

export const getNearbyDrivers = async ({
  lat = 12.9716,
  lng = 77.5946,
  radius = 10,
  sortBy = 'ai_recommended',
  minRating,
  maxPrice,
} = {}) => {
  try {
    const response = await api.get('/drivers/nearby', {
      params: { lat, lng, radius, sortBy, minRating, maxPrice },
    });
    if (response.data && response.data.data && response.data.data.drivers) {
      return response.data.data.drivers;
    }
  } catch (error) {
    // Graceful offline / fallback to rich mock data
    console.log('Driver service: using local mock drivers fallback (Backend offline or unreachable)');
  }

  // Fallback local calculations
  let drivers = [...INITIAL_DRIVERS];

  if (minRating) {
    drivers = drivers.filter((d) => d.rating >= Number(minRating));
  }
  if (maxPrice) {
    drivers = drivers.filter((d) => d.pricing.perDay <= Number(maxPrice));
  }

  if (sortBy === 'ai_recommended') {
    drivers.sort((a, b) => (b.aiMatchScore || 85) - (a.aiMatchScore || 85));
  } else if (sortBy === 'distance') {
    drivers.sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (sortBy === 'rating') {
    drivers.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'price_asc') {
    drivers.sort((a, b) => a.pricing.perDay - b.pricing.perDay);
  } else if (sortBy === 'price_desc') {
    drivers.sort((a, b) => b.pricing.perDay - a.pricing.perDay);
  }

  return drivers;
};

export const getDriverById = async (id) => {
  try {
    const response = await api.get(`/drivers/${id}`);
    if (response.data && response.data.data) {
      return response.data.data;
    }
  } catch (error) {
    console.log('Driver service: fetching from local fallback');
  }

  const driver = INITIAL_DRIVERS.find((d) => d.id === id);
  return driver || INITIAL_DRIVERS[0];
};

export default {
  getNearbyDrivers,
  getDriverById,
};
