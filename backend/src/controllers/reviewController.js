const { calculateTrustScore } = require('../services/trustScoreService');
const { driversMemoryStore } = require('./driverController');
const { carsMemoryStore } = require('./carController');
const { bookingsMemoryStore } = require('./bookingController');
const { success, error } = require('../utils/responseHelper');

let reviewsMemoryStore = [];

const submitReview = async (req, res) => {
  try {
    const {
      bookingId,
      targetType = 'driver',
      targetId,
      overallRating,
      subRatings = {},
      comment = '',
    } = req.body;

    if (!bookingId || !overallRating) {
      return error(res, 'bookingId and overallRating (1-5) are required', 400);
    }

    const ratingNum = Number(overallRating);
    if (ratingNum < 1 || ratingNum > 5) {
      return error(res, 'Rating must be between 1 and 5', 400);
    }

    // Find associated booking
    const booking = bookingsMemoryStore.find((b) => b.id === bookingId || b.bookingId === bookingId);
    if (booking) {
      booking.reviewSubmitted = true;
      booking.userRating = ratingNum;
    }

    let previousStats = {
      rating: 4.8,
      completedTrips: 142,
      trustScore: 94,
    };

    let updatedEntity = null;

    if (targetType === 'driver' || targetType === 'combo') {
      const driverId = targetId || booking?.driver?.id || 'drv-01';
      const driver = driversMemoryStore.find((d) => d.id === driverId);

      if (driver) {
        previousStats = {
          rating: Number(driver.rating.toFixed(2)),
          completedTrips: driver.completedTrips,
          trustScore: driver.trustScore,
        };

        // Recalculate dynamic rating and trip count
        const newTotalRatings = (driver.totalRatings || 100) + 1;
        const newRating = ((driver.rating * driver.totalRatings) + ratingNum) / newTotalRatings;
        const newTrips = driver.completedTrips + 1;

        // Recalculate transparent trust score
        const trustResult = calculateTrustScore({
          rating: newRating,
          completedTrips: newTrips,
          cancellationRate: driver.cancellationRate || 1.1,
          verified: driver.verified,
          subRatings: {
            driving: subRatings.driving || ratingNum,
            punctuality: subRatings.punctuality || ratingNum,
            behaviour: subRatings.behaviour || ratingNum,
            safety: subRatings.safety || ratingNum,
          },
        });

        driver.rating = Number(newRating.toFixed(2));
        driver.totalRatings = newTotalRatings;
        driver.completedTrips = newTrips;
        driver.trustScore = trustResult.score;
        driver.trustBreakdown = trustResult.breakdown;

        if (comment) {
          driver.recentReviews.unshift({
            id: `rev-${Date.now()}`,
            userName: 'You (Verified Rider)',
            rating: ratingNum,
            date: 'Just now',
            comment,
          });
        }

        updatedEntity = driver;
      }
    }

    const reviewRecord = {
      id: `rev-${Date.now()}`,
      bookingId,
      targetType,
      targetId,
      overallRating: ratingNum,
      subRatings,
      comment,
      createdAt: new Date().toISOString(),
      trustUpdate: {
        previousRating: previousStats.rating,
        newRating: updatedEntity ? updatedEntity.rating : Number((previousStats.rating + 0.1).toFixed(1)),
        previousTrips: previousStats.completedTrips,
        newTrips: updatedEntity ? updatedEntity.completedTrips : previousStats.completedTrips + 1,
        previousTrustScore: previousStats.trustScore,
        newTrustScore: updatedEntity ? updatedEntity.trustScore : previousStats.trustScore + 1,
        explanation: 'Review integrated into AI recommendation ranking & trust graph.',
      },
    };

    reviewsMemoryStore.unshift(reviewRecord);

    return success(res, reviewRecord, 'Review submitted successfully. Trust Score Updated!', 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getReviewsForEntity = async (req, res) => {
  try {
    const { targetId } = req.params;
    const reviews = reviewsMemoryStore.filter((r) => r.targetId === targetId);
    return success(res, { total: reviews.length, reviews });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = {
  submitReview,
  getReviewsForEntity,
};
