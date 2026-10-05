import React, { createContext, useState, useContext, useEffect } from 'react';
import { INITIAL_BOOKINGS, INITIAL_DRIVERS, INITIAL_CARS, INITIAL_COMBOS } from '../constants/mockData';
import bookingService from '../services/bookingService';
import reviewService from '../services/reviewService';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [drivers, setDrivers] = useState(INITIAL_DRIVERS);
  const [cars, setCars] = useState(INITIAL_CARS);
  const [combos, setCombos] = useState(INITIAL_COMBOS);
  const [activeBooking, setActiveBooking] = useState(INITIAL_BOOKINGS[0]); // initially the active airport trip
  const [latestTrustDelta, setLatestTrustDelta] = useState(null);

  // Create a new booking
  const addBooking = async (bookingData) => {
    const created = await bookingService.createBooking(bookingData);
    setBookings((prev) => [created, ...prev]);
    setActiveBooking(created);
    return created;
  };

  // Step through trip states: 'confirmed' -> 'driver_arriving' -> 'driver_arrived' -> 'trip_started' -> 'trip_completed'
  const advanceTripStatus = async (bookingId, nextStatus) => {
    const updated = await bookingService.updateBookingStatus(bookingId, nextStatus);
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId || b.bookingId === bookingId ? { ...b, status: nextStatus } : b))
    );
    if (activeBooking && (activeBooking.id === bookingId || activeBooking.bookingId === bookingId)) {
      setActiveBooking((prev) => ({ ...prev, status: nextStatus }));
    }
    return updated;
  };

  // Submit rating and update driver metrics & trust scores dynamically
  const submitTripReview = async ({ bookingId, targetType, targetId, overallRating, subRatings, comment }) => {
    const reviewResult = await reviewService.submitReview({
      bookingId,
      targetType,
      targetId,
      overallRating,
      subRatings,
      comment,
    });

    // Update booking state
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId || b.bookingId === bookingId) {
          return { ...b, reviewSubmitted: true, userRating: overallRating };
        }
        return b;
      })
    );

    if (activeBooking && (activeBooking.id === bookingId || activeBooking.bookingId === bookingId)) {
      setActiveBooking((prev) => ({ ...prev, reviewSubmitted: true, userRating: overallRating }));
    }

    // Update driver in state
    if (targetType === 'driver' || targetType === 'combo') {
      const driverId = targetId || activeBooking?.driver?.id;
      setDrivers((prevDrivers) =>
        prevDrivers.map((d) => {
          if (d.id === driverId) {
            const newTrips = d.completedTrips + 1;
            const newRating = Number((((d.rating * d.totalRatings) + overallRating) / (d.totalRatings + 1)).toFixed(2));
            const newTrust = Math.min(d.trustScore + (overallRating >= 4 ? 1 : 0), 99);
            return {
              ...d,
              rating: newRating,
              completedTrips: newTrips,
              totalRatings: d.totalRatings + 1,
              trustScore: newTrust,
              aiMatchScore: Math.min((d.aiMatchScore || 85) + 2, 98),
            };
          }
          return d;
        })
      );
    }

    // Store trust delta for animated celebration modal
    if (reviewResult && reviewResult.trustUpdate) {
      setLatestTrustDelta(reviewResult.trustUpdate);
    }

    return reviewResult;
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        drivers,
        setDrivers,
        cars,
        setCars,
        combos,
        activeBooking,
        setActiveBooking,
        addBooking,
        advanceTripStatus,
        submitTripReview,
        latestTrustDelta,
        setLatestTrustDelta,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => useContext(BookingContext);
