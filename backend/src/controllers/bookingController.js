const { mockBookings, mockDrivers, mockCars } = require('../utils/seedData');
const { success, error } = require('../utils/responseHelper');

let bookingsMemoryStore = JSON.parse(JSON.stringify(mockBookings));

const createBooking = async (req, res) => {
  try {
    const {
      serviceType,
      driverId,
      carId,
      pickupLocation,
      destination,
      bookingDate = 'Today',
      startTime = 'Now',
      duration = 'Full Day',
      estimatedPrice,
    } = req.body;

    if (!serviceType || !pickupLocation || !destination) {
      return error(res, 'serviceType, pickupLocation and destination are required', 400);
    }

    const driver = driverId ? mockDrivers.find((d) => d.id === driverId) : null;
    const car = carId ? mockCars.find((c) => c.id === carId) : null;

    const newBooking = {
      id: `DN-${Math.floor(100000 + Math.random() * 900000)}`,
      bookingId: `DN-${Math.floor(100000 + Math.random() * 900000)}`,
      serviceType,
      driver: driver || { name: 'Assigned Driver', rating: 4.8 },
      car: car || (serviceType !== 'driver' ? { name: 'Assigned Car', rating: 4.8 } : null),
      pickupLocation: typeof pickupLocation === 'string' ? { address: pickupLocation } : pickupLocation,
      destination: typeof destination === 'string' ? { address: destination } : destination,
      bookingDate,
      startTime,
      duration,
      estimatedPrice: estimatedPrice || (serviceType === 'driver' ? 800 : serviceType === 'car' ? 1800 : 2400),
      status: 'confirmed',
      reviewSubmitted: false,
      createdAt: new Date().toISOString(),
      tripMetrics: {
        distanceKm: 14.8,
        durationMinutes: 38,
      },
    };

    bookingsMemoryStore.unshift(newBooking);

    return success(res, newBooking, 'Booking confirmed successfully', 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getBookings = async (req, res) => {
  try {
    const { status, type } = req.query;
    let bookings = [...bookingsMemoryStore];

    if (status) {
      if (status === 'active') {
        bookings = bookings.filter((b) =>
          ['confirmed', 'driver_arriving', 'driver_arrived', 'trip_started', 'in_progress'].includes(b.status)
        );
      } else if (status === 'completed') {
        bookings = bookings.filter((b) => b.status === 'trip_completed');
      } else {
        bookings = bookings.filter((b) => b.status === status);
      }
    }

    if (type) {
      bookings = bookings.filter((b) => b.serviceType === type);
    }

    return success(res, {
      total: bookings.length,
      bookings,
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = bookingsMemoryStore.find((b) => b.id === id || b.bookingId === id);
    if (!booking) {
      return error(res, 'Booking not found', 404);
    }
    return success(res, booking);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const booking = bookingsMemoryStore.find((b) => b.id === id || b.bookingId === id);
    if (!booking) {
      return error(res, 'Booking not found', 404);
    }

    const validStates = [
      'confirmed',
      'driver_arriving',
      'driver_arrived',
      'trip_started',
      'in_progress',
      'trip_completed',
      'cancelled',
    ];

    if (!validStates.includes(status)) {
      return error(res, `Invalid status. Must be one of: ${validStates.join(', ')}`, 400);
    }

    booking.status = status;
    booking.updatedAt = new Date().toISOString();

    return success(res, booking, `Trip status updated to ${status}`);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  bookingsMemoryStore,
};
