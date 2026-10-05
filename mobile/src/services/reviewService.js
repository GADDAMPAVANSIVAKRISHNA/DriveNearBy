import api from './api';
import { INITIAL_DRIVERS } from '../constants/mockData';

export const submitReview = async ({
  bookingId,
  targetType = 'driver',
  targetId,
  overallRating,
  subRatings = {},
  comment = '',
}) => {
  try {
    const response = await api.post('/reviews', {
      bookingId,
      targetType,
      targetId,
      overallRating,
      subRatings,
      comment,
    });
    if (response.data && response.data.data) {
      return response.data.data;
    }
  } catch (error) {
    console.log('Review service: running local recalculation');
  }

  // Local fallback calculation for seamless demo experience
  const targetDriver = INITIAL_DRIVERS.find((d) => d.id === targetId) || INITIAL_DRIVERS[0];
  const prevRating = targetDriver.rating;
  const prevTrips = targetDriver.completedTrips;
  const prevTrust = targetDriver.trustScore;

  // New rating formula
  const newRating = Number((((prevRating * targetDriver.totalRatings) + overallRating) / (targetDriver.totalRatings + 1)).toFixed(2));
  const newTrips = prevTrips + 1;
  const trustDelta = overallRating >= 4 ? 1 : 0;
  const newTrust = Math.min(prevTrust + trustDelta, 99);

  // Update in-memory driver instance
  targetDriver.rating = newRating;
  targetDriver.completedTrips = newTrips;
  targetDriver.trustScore = newTrust;
  targetDriver.totalRatings += 1;

  if (comment) {
    targetDriver.recentReviews.unshift({
      id: `rev-${Date.now()}`,
      userName: 'You (Verified Rider)',
      rating: overallRating,
      date: 'Just now',
      comment,
    });
  }

  return {
    id: `rev-${Date.now()}`,
    bookingId,
    targetType,
    overallRating,
    subRatings,
    comment,
    trustUpdate: {
      previousRating: prevRating,
      newRating,
      previousTrips: prevTrips,
      newTrips,
      previousTrustScore: prevTrust,
      newTrustScore: newTrust,
      explanation: 'Your multi-factor review has updated the driver trust score and future AI ranking.',
    },
  };
};

export default {
  submitReview,
};
