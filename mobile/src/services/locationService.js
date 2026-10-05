import * as Location from 'expo-location';
import { DEMO_LOCATION } from '../config/demoLocation';

export const DEFAULT_LOCATION = DEMO_LOCATION;

export const requestLocationPermissionAndGet = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Location permission was denied. Using default Bengaluru coordinates.');
      return {
        permissionGranted: false,
        coords: DEFAULT_LOCATION,
        formattedAddress: DEFAULT_LOCATION.address,
      };
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    // Reverse geocode to get human-readable address
    let formattedAddress = `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
    try {
      const reverse = await Location.reverseGeocodeAsync(coords);
      if (reverse && reverse.length > 0) {
        const item = reverse[0];
        const parts = [item.name, item.district || item.subregion, item.city].filter(Boolean);
        formattedAddress = parts.join(', ') || DEFAULT_LOCATION.address;
      }
    } catch (geoErr) {
      console.warn('Reverse geocoding error:', geoErr);
      formattedAddress = DEFAULT_LOCATION.address;
    }

    return {
      permissionGranted: true,
      coords,
      formattedAddress,
    };
  } catch (error) {
    console.warn('Error fetching location:', error.message);
    return {
      permissionGranted: false,
      coords: DEFAULT_LOCATION,
      formattedAddress: DEFAULT_LOCATION.address,
    };
  }
};

export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 2.0;
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
};

export default {
  requestLocationPermissionAndGet,
  calculateDistanceKm,
  DEFAULT_LOCATION,
};
