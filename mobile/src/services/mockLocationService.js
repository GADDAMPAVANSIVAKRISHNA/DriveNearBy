/**
 * ============================================================================
 * DEMO DRIVER & FLEET LOCATION SIMULATION SERVICE
 * ============================================================================
 * NOTE: This is a standalone simulation layer for demonstration and hackathon
 * purposes. It generates realistic, drifting GPS waypoints for nearby drivers
 * and rental vehicles around the authenticated user's real GPS position.
 * 
 * SEPARATION GUARANTEE:
 * - Real User Location: Sourced exclusively from Expo Location via `locationService.js`
 * - Driver/Car Locations: Generated and moved realistically by this simulation layer.
 * 
 * To disconnect when production live telematics API is connected:
 * Simply replace `useNearbyMobility.js` subscription with your WebSocket/MQTT stream.
 * ============================================================================
 */

import { calculateDistanceKm } from './locationService';

// Base demo driver pool with realistic telemetry attributes
const BASE_DEMO_DRIVERS = [
  {
    id: 'drv-01',
    name: 'Ravi Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    rating: 4.8,
    trips: 128,
    trustScore: 94,
    status: 'AVAILABLE', // 'AVAILABLE' | 'BUSY' | 'OFFLINE'
    isAIMatch: true,
    matchScore: 96,
    hourlyRate: 150,
    dailyPrice: 800,
    vehicleModel: 'Hyundai Creta 2024',
    offset: { lat: 0.0055, lng: 0.0050 },
    bearing: 45,
    speedKmH: 28,
  },
  {
    id: 'drv-02',
    name: 'Suresh Reddy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    rating: 4.9,
    trips: 210,
    trustScore: 97,
    status: 'AVAILABLE',
    isAIMatch: false,
    matchScore: 91,
    hourlyRate: 160,
    dailyPrice: 950,
    vehicleModel: 'Honda City Hybrid',
    offset: { lat: -0.0052, lng: 0.0075 },
    bearing: 130,
    speedKmH: 34,
  },
  {
    id: 'drv-03',
    name: 'Arun Kumar',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    rating: 4.7,
    trips: 88,
    trustScore: 91,
    status: 'BUSY',
    isAIMatch: false,
    matchScore: 84,
    hourlyRate: 140,
    dailyPrice: 750,
    vehicleModel: 'Maruti Grand Vitara',
    offset: { lat: 0.0082, lng: -0.0068 },
    bearing: 260,
    speedKmH: 22,
  },
  {
    id: 'drv-04',
    name: 'Kiran Rao',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    rating: 4.8,
    trips: 124,
    trustScore: 92,
    status: 'AVAILABLE',
    isAIMatch: false,
    matchScore: 82,
    hourlyRate: 160,
    dailyPrice: 850,
    vehicleModel: 'Toyota Innova Crysta',
    offset: { lat: -0.0078, lng: -0.0072 },
    bearing: 315,
    speedKmH: 31,
  },
];

// Base rental car fleet
const BASE_DEMO_CARS = [
  {
    id: 'car-01',
    name: 'Hyundai Creta SX(O)',
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80',
    fuelType: 'Petrol Automatic',
    seating: 5,
    rating: 4.8,
    trustScore: 95,
    dailyPrice: 2400,
    status: 'AVAILABLE',
    isAIMatch: false,
    offset: { lat: 0.0048, lng: -0.0052 },
    bearing: 90,
  },
  {
    id: 'car-02',
    name: 'Tata Nexon EV Max',
    type: 'Electric SUV',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=500&q=80',
    fuelType: 'Pure EV (437 km range)',
    seating: 5,
    rating: 4.9,
    trustScore: 98,
    dailyPrice: 2800,
    status: 'AVAILABLE',
    isAIMatch: true,
    matchScore: 97,
    offset: { lat: -0.0041, lng: 0.0073 },
    bearing: 210,
  },
  {
    id: 'car-03',
    name: 'Mahindra Thar 4x4',
    type: 'Off-Road 4x4',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=500&q=80',
    fuelType: 'Diesel Manual',
    seating: 4,
    rating: 4.7,
    trustScore: 93,
    dailyPrice: 3200,
    status: 'AVAILABLE',
    isAIMatch: false,
    offset: { lat: 0.0088, lng: 0.0031 },
    bearing: 15,
  },
];

class MockLocationService {
  constructor() {
    this.activeSimulations = new Map();
  }

  /**
   * Generates initial nearby units relative to a user location.
   */
  getInitialNearbyUnits(userCoords) {
    if (!userCoords) return { drivers: [], cars: [] };

    const drivers = BASE_DEMO_DRIVERS.map((d) => {
      const lat = userCoords.latitude + d.offset.lat;
      const lng = userCoords.longitude + d.offset.lng;
      const distanceKm = calculateDistanceKm(userCoords.latitude, userCoords.longitude, lat, lng);
      return {
        ...d,
        type: 'driver',
        latitude: lat,
        longitude: lng,
        distanceKm,
      };
    });

    const cars = BASE_DEMO_CARS.map((c) => {
      const lat = userCoords.latitude + c.offset.lat;
      const lng = userCoords.longitude + c.offset.lng;
      const distanceKm = calculateDistanceKm(userCoords.latitude, userCoords.longitude, lat, lng);
      return {
        ...c,
        type: 'car',
        latitude: lat,
        longitude: lng,
        distanceKm,
      };
    });

    return { drivers, cars };
  }

  /**
   * Simulates gentle, realistic micro-movements along streets for active units.
   */
  stepSimulation(currentUnits, userCoords) {
    if (!userCoords || !currentUnits) return currentUnits;

    const updatedDrivers = (currentUnits.drivers || []).map((driver) => {
      if (driver.status === 'OFFLINE') return driver;

      // Drift slightly in current bearing direction (approx 10-30 meters per tick)
      const rad = (driver.bearing * Math.PI) / 180;
      const deltaLat = Math.cos(rad) * 0.00018;
      const deltaLng = Math.sin(rad) * 0.00018;

      let newLat = driver.latitude + deltaLat;
      let newLng = driver.longitude + deltaLng;
      let newBearing = driver.bearing;

      // If drifted too far (> 5km), turn back towards user
      const dist = calculateDistanceKm(userCoords.latitude, userCoords.longitude, newLat, newLng);
      if (dist > 4.5) {
        newBearing = (driver.bearing + 180 + (Math.random() * 40 - 20)) % 360;
      } else if (Math.random() > 0.8) {
        // Subtle natural road turn
        newBearing = (driver.bearing + (Math.random() * 30 - 15)) % 360;
      }

      return {
        ...driver,
        latitude: newLat,
        longitude: newLng,
        bearing: Math.round(newBearing),
        distanceKm: dist,
      };
    });

    // Cars are usually parked at hubs, so move less frequently or remain stationary
    const updatedCars = (currentUnits.cars || []).map((car) => {
      const dist = calculateDistanceKm(userCoords.latitude, userCoords.longitude, car.latitude, car.longitude);
      return {
        ...car,
        distanceKm: dist,
      };
    });

    return { drivers: updatedDrivers, cars: updatedCars };
  }

  /**
   * Starts a periodic live movement simulation loop for demo mode.
   */
  startLiveTrackingSimulation(userCoords, onUpdate, intervalMs = 2500) {
    let units = this.getInitialNearbyUnits(userCoords);
    onUpdate(units);

    const timerId = setInterval(() => {
      units = this.stepSimulation(units, userCoords);
      onUpdate(units);
    }, intervalMs);

    return () => clearInterval(timerId);
  }
}

export const mockLocationService = new MockLocationService();
export default mockLocationService;
