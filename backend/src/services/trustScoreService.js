/**
 * Trust Score Calculation Engine
 * 
 * Computes a transparent, multi-dimensional trust score (0 - 100) based on:
 * 1. Average Rating (weighted 35%)
 * 2. Total Verified Completed Trips (weighted 25%)
 * 3. Granular Category Scores (Safety, Punctuality, Behaviour) (weighted 20%)
 * 4. Cancellation & Reliability penalty (weighted 10%)
 * 5. Identity & Police Verification Status (weighted 10%)
 */

function calculateTrustScore({
  rating = 4.5,
  completedTrips = 10,
  cancellationRate = 2.0, // percentage e.g. 2%
  verified = true,
  subRatings = { driving: 4.8, punctuality: 4.7, behaviour: 4.9, safety: 4.9 },
}) {
  // 1. Rating contribution: Normalized 0 - 35
  const ratingNormalized = Math.min(Math.max((rating - 3.0) / 2.0, 0), 1); // 3.0 -> 0, 5.0 -> 1
  const ratingScore = ratingNormalized * 35;

  // 2. Experience & trip volume contribution: Normalized 0 - 25
  // Logarithmic curve so 50+ trips already yields solid confidence
  const tripScore = Math.min(Math.log10(completedTrips + 1) / Math.log10(150), 1) * 25;

  // 3. Granular subratings: Normalized 0 - 20
  const avgSub =
    ((subRatings.driving || 4.5) +
      (subRatings.punctuality || 4.5) +
      (subRatings.behaviour || 4.5) +
      (subRatings.safety || 4.5)) /
    4;
  const subScore = Math.min(Math.max((avgSub - 3.0) / 2.0, 0), 1) * 20;

  // 4. Reliability & low cancellation: 0 - 10
  const reliabilityScore = Math.max(0, 10 - cancellationRate * 2);

  // 5. Verification: 10
  const verificationScore = verified ? 10 : 0;

  const total = Math.round(ratingScore + tripScore + subScore + reliabilityScore + verificationScore);
  const finalScore = Math.min(Math.max(total, 50), 99); // realistic floor & ceiling

  let tier = 'Standard';
  if (finalScore >= 93) tier = 'Elite Pro';
  else if (finalScore >= 85) tier = 'Highly Trusted';
  else if (finalScore >= 75) tier = 'Verified Partner';

  return {
    score: finalScore,
    tier,
    explanation: `Calculated from ${completedTrips} verified trips, ${rating.toFixed(1)}★ rating, ${verified ? 'Government ID Verified' : 'Standard'}, and ${reliabilityScore.toFixed(0)}/10 reliability score.`,
    breakdown: {
      ratingWeight: Math.round(ratingScore),
      tripHistoryWeight: Math.round(tripScore),
      granularMetricsWeight: Math.round(subScore),
      reliabilityWeight: Math.round(reliabilityScore),
      verificationBonus: Math.round(verificationScore),
    },
  };
}

module.exports = {
  calculateTrustScore,
};
