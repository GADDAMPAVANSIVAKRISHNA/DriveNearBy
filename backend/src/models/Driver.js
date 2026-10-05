const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    phone: {
      type: String,
      required: true,
    },
    experienceYears: {
      type: Number,
      default: 5,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 128,
    },
    completedTrips: {
      type: Number,
      default: 142,
    },
    cancellationRate: {
      type: Number,
      default: 1.2, // percentage
    },
    trustScore: {
      type: Number,
      default: 92, // 0 - 100
      min: 0,
      max: 100,
    },
    trustBreakdown: {
      identityVerified: { type: Number, default: 98 },
      safetyRecord: { type: Number, default: 95 },
      punctuality: { type: Number, default: 94 },
      customerSatisfaction: { type: Number, default: 92 },
    },
    pricing: {
      perHour: { type: Number, default: 150 },
      perDay: { type: Number, default: 800 },
    },
    availability: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'available',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [77.5946, 12.9716],
      },
      address: {
        type: String,
        default: 'Indiranagar, Bengaluru',
      },
    },
    distanceKm: {
      type: Number,
      default: 1.6,
    },
    languages: [{ type: String }],
    vehicleSkills: [{ type: String }],
    badge: {
      type: String,
      default: 'Top Rated Pro',
    },
  },
  { timestamps: true }
);

DriverSchema.index({ location: '2dsphere' });

module.exports = mongoose.models.Driver || mongoose.model('Driver', DriverSchema);
