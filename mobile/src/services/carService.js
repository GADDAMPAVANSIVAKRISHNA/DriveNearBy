import api from './api';
import { INITIAL_CARS, INITIAL_COMBOS } from '../constants/mockData';

export const getNearbyCars = async ({
  lat = 12.9716,
  lng = 77.5946,
  radius = 15,
  category,
  transmission,
  sortBy = 'ai_recommended',
} = {}) => {
  try {
    const response = await api.get('/cars/nearby', {
      params: { lat, lng, radius, category, transmission, sortBy },
    });
    if (response.data && response.data.data && response.data.data.cars) {
      return response.data.data.cars;
    }
  } catch (error) {
    console.log('Car service: using local mock cars fallback');
  }

  let cars = [...INITIAL_CARS];

  if (category && category !== 'All') {
    cars = cars.filter((c) => c.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (transmission && transmission !== 'All') {
    cars = cars.filter((c) => c.transmission.toLowerCase() === transmission.toLowerCase());
  }

  if (sortBy === 'ai_recommended') {
    cars.sort((a, b) => (b.aiMatchScore || 85) - (a.aiMatchScore || 85));
  } else if (sortBy === 'distance') {
    cars.sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (sortBy === 'rating') {
    cars.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'price_asc') {
    cars.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (sortBy === 'price_desc') {
    cars.sort((a, b) => b.pricePerDay - a.pricePerDay);
  }

  return cars;
};

export const getCarById = async (id) => {
  try {
    const response = await api.get(`/cars/${id}`);
    if (response.data && response.data.data) {
      return response.data.data;
    }
  } catch (error) {
    console.log('Car service: fetching from local fallback');
  }

  const car = INITIAL_CARS.find((c) => c.id === id);
  return car || INITIAL_CARS[0];
};

export const getCombos = async () => {
  try {
    const response = await api.get('/cars/combos');
    if (response.data && response.data.data && response.data.data.combos) {
      return response.data.data.combos;
    }
  } catch (error) {
    console.log('Car service: using local mock combos fallback');
  }

  return INITIAL_COMBOS;
};

export default {
  getNearbyCars,
  getCarById,
  getCombos,
};
