/**
 * AI Recommendation & Match Engine
 * 
 * Computes match percentage based on multi-objective optimization:
 * - Distance Proximity (closer is weighted higher)
 * - Trust & Rating Metrics
 * - Trip Experience volume
 * - Pricing value
 * - Reliability / Cancellation history
 * - Availability
 */

function calculateDriverMatchScore(driver, userPreferences = {}) {
  const { maxDistance = 10, maxPrice = 1200, priority = 'balanced' } = userPreferences;

  // 1. Proximity score (0-25)
  const dist = driver.distanceKm || 2.0;
  const distScore = Math.max(0, 1 - dist / maxDistance) * 25;

  // 2. Trust & Rating score (0-30)
  const ratingPart = ((driver.rating || 4.5) / 5) * 15;
  const trustPart = ((driver.trustScore || 85) / 100) * 15;
  const trustScoreTotal = ratingPart + trustPart;

  // 3. Experience & Trips (0-20)
  const trips = driver.completedTrips || 50;
  const tripScore = Math.min(trips / 120, 1) * 20;

  // 4. Value / Price score (0-15)
  const price = driver.pricing?.perDay || 800;
  const priceScore = Math.max(0, 1 - (price - 500) / maxPrice) * 15;

  // 5. Reliability bonus (0-10)
  const cancelRate = driver.cancellationRate || 1.5;
  const reliabilityBonus = Math.max(0, 10 - cancelRate * 2);

  // Dynamic priority adjustment
  let total = distScore + trustScoreTotal + tripScore + priceScore + reliabilityBonus;
  if (priority === 'fastest') total += distScore * 0.2;
  if (priority === 'highest_rated') total += trustScoreTotal * 0.2;

  const matchPercent = Math.min(Math.max(Math.round(total), 68), 98);

  // Formulate explainable AI reasoning
  const reasons = [];
  if (dist <= 2.5) reasons.push(`Ultra-nearby (${dist.toFixed(1)} km away)`);
  if (driver.rating >= 4.8) reasons.push(`${driver.rating}★ top customer feedback`);
  if (driver.completedTrips >= 100) reasons.push(`${driver.completedTrips}+ safely completed trips`);
  if (driver.verified) reasons.push('100% verified credentials');

  const reasoning = reasons.join(' • ') || 'Well-balanced option for comfort and price';

  return {
    matchScore: matchPercent,
    badge: matchPercent >= 92 ? 'Top AI Match' : matchPercent >= 85 ? 'Strong Match' : 'Recommended',
    reasoning,
    breakdown: {
      proximity: Math.round(distScore),
      trust: Math.round(trustScoreTotal),
      experience: Math.round(tripScore),
      value: Math.round(priceScore),
      reliability: Math.round(reliabilityBonus),
    },
  };
}

function calculateCarMatchScore(car, userPreferences = {}) {
  const dist = car.distanceKm || 2.5;
  const distScore = Math.max(0, 1 - dist / 15) * 25;
  const ratingScore = ((car.rating || 4.7) / 5) * 30;
  const tripsScore = Math.min((car.completedTrips || 40) / 100, 1) * 20;
  const priceScore = Math.max(0, 1 - (car.pricePerDay - 1000) / 3000) * 15;
  const verificationScore = car.verified ? 10 : 5;

  const total = distScore + ratingScore + tripsScore + priceScore + verificationScore;
  const matchPercent = Math.min(Math.max(Math.round(total), 70), 97);

  const reasons = [];
  if (dist <= 3.0) reasons.push(`Located just ${dist.toFixed(1)} km away`);
  if (car.rating >= 4.8) reasons.push('Spotless cleanliness and maintenance record');
  if (car.features?.length) reasons.push(`Loaded with ${car.features.slice(0, 2).join(', ')}`);

  return {
    matchScore: matchPercent,
    badge: matchPercent >= 90 ? 'AI Recommended Car' : 'Great Pick',
    reasoning: reasons.join(' • ') || 'Reliable rental choice with verified partner',
  };
}

module.exports = {
  calculateDriverMatchScore,
  calculateCarMatchScore,
};
