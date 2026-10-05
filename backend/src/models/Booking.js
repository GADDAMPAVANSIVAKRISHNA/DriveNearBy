const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
      default: () => `DN-${Math.floor(100000 + Math.random() * 900000)}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // optional for mock/guest flows
    },
    userName: { type: String, default: 'Dinesh Kumar' },
    userPhone: { type: String, default: '+91 98765 43210' },
    serviceType: {
      type: String,
      enum: ['driver', 'car', 'combo'],
      required: true,
    },
    driver: {
      id: String,
      name: String,
      phone: String,
      rating: Number,
      profileImage: String,
      licensePlate: String,
    },
    car: {
      id: String,
      name: String,
      category: String,
      carImage: String,
      registrationNumber: String,
    },
    pickupLocation: {
      address: { type: String, required: true },
      latitude: Number,
      longitude: Number,
    },
    destination: {
      address: { type: String, required: true },
      latitude: Number,
      longitude: Number,
    },
    bookingDate: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      default: 'Full Day (8 hrs)',
    },
    estimatedPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'confirmed',
        'driver_arriving',
        'driver_arrived',
        'trip_started',
        'in_progress',
        'trip_completed',
        'cancelled',
      ],
      default: 'confirmed',
    },
    tripMetrics: {
      distanceKm: { type: Number, default: 18.4 },
      durationMinutes: { type: Number, default: 45 },
    },
    reviewSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
