const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['SUV', 'Sedan', 'Hatchback', 'Compact SUV', 'Luxury', 'Electric'],
      default: 'SUV',
    },
    carImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    },
    transmission: {
      type: String,
      enum: ['Automatic', 'Manual'],
      default: 'Automatic',
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'CNG', 'Electric'],
      default: 'Petrol',
    },
    seats: {
      type: Number,
      default: 5,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    completedTrips: {
      type: Number,
      default: 94,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
      default: 1800,
    },
    deposit: {
      type: Number,
      default: 3000,
    },
    availability: {
      type: String,
      enum: ['available', 'booked', 'maintenance'],
      default: 'available',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [77.5946, 12.9716],
      },
      address: {
        type: String,
        default: 'Koramangala 4th Block, Bengaluru',
      },
    },
    distanceKm: {
      type: Number,
      default: 2.1,
    },
    features: [{ type: String }],
    owner: {
      name: { type: String, default: 'DriveNearby Fleet' },
      verified: { type: Boolean, default: true },
      rating: { type: Number, default: 4.9 },
    },
    trustScore: {
      type: Number,
      default: 94,
    },
  },
  { timestamps: true }
);

CarSchema.index({ location: '2dsphere' });

module.exports = mongoose.models.Car || mongoose.model('Car', CarSchema);
