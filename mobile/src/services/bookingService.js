import api from './api';
import { INITIAL_BOOKINGS } from '../constants/mockData';

// Local storage cache for offline demo consistency
let localBookings = [...INITIAL_BOOKINGS];

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    if (response.data && response.data.data) {
      localBookings.unshift(response.data.data);
      return response.data.data;
    }
  } catch (error) {
    console.log('Booking service: creating in local state');
  }

  // Fallback local booking creation
  const newBooking = {
    id: `DN-${Math.floor(100000 + Math.random() * 900000)}`,
    bookingId: `DN-${Math.floor(100000 + Math.random() * 900000)}`,
    serviceType: bookingData.serviceType,
    driver: bookingData.driver || null,
    car: bookingData.car || null,
    pickupLocation: typeof bookingData.pickupLocation === 'string'
      ? { address: bookingData.pickupLocation }
      : bookingData.pickupLocation,
    destination: typeof bookingData.destination === 'string'
      ? { address: bookingData.destination }
      : bookingData.destination,
    bookingDate: bookingData.bookingDate || 'Today',
    startTime: bookingData.startTime || 'Now',
    duration: bookingData.duration || 'Full Day (8 hrs)',
    estimatedPrice: bookingData.estimatedPrice || 800,
    status: 'confirmed',
    reviewSubmitted: false,
    createdAt: new Date().toISOString(),
    tripMetrics: {
      distanceKm: 18.5,
      durationMinutes: 42,
    },
  };

  localBookings.unshift(newBooking);
  return newBooking;
};

export const getBookings = async (filter = {}) => {
  try {
    const response = await api.get('/bookings', { params: filter });
    if (response.data && response.data.data && response.data.data.bookings) {
      return response.data.data.bookings;
    }
  } catch (error) {
    console.log('Booking service: reading from local memory');
  }

  let result = [...localBookings];
  if (filter.status === 'active') {
    result = result.filter((b) =>
      ['confirmed', 'driver_arriving', 'driver_arrived', 'trip_started', 'in_progress'].includes(b.status)
    );
  } else if (filter.status === 'completed') {
    result = result.filter((b) => b.status === 'trip_completed');
  }

  return result;
};

export const getBookingById = async (id) => {
  try {
    const response = await api.get(`/bookings/${id}`);
    if (response.data && response.data.data) {
      return response.data.data;
    }
  } catch (error) {
    console.log('Booking service: find by id locally');
  }

  return localBookings.find((b) => b.id === id || b.bookingId === id) || localBookings[0];
};

export const updateBookingStatus = async (id, status) => {
  try {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    if (response.data && response.data.data) {
      return response.data.data;
    }
  } catch (error) {
    console.log('Booking service: updating status locally');
  }

  const booking = localBookings.find((b) => b.id === id || b.bookingId === id);
  if (booking) {
    booking.status = status;
    return booking;
  }
  return null;
};

export default {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
};
