const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
    },
    targetType: {
      type: String,
      enum: ['driver', 'car', 'combo'],
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    targetName: {
      type: String,
      required: true,
    },
    user: {
      id: String,
      name: { type: String, default: 'Dinesh Kumar' },
      avatar: String,
    },
    overallRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    subRatings: {
      driving: { type: Number, default: 5 },
      punctuality: { type: Number, default: 5 },
      behaviour: { type: Number, default: 5 },
      safety: { type: Number, default: 5 },
      vehicleCleanliness: { type: Number, default: 5 },
    },
    comment: {
      type: String,
      trim: true,
    },
    trustScoreDelta: {
      type: Number,
      default: 1,
    },
    verifiedTrip: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
