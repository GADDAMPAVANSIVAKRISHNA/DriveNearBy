/**
 * ============================================================================
 * DEMO LOCATION CONFIGURATION - TIRUPATI / MOHAN BABU UNIVERSITY
 * ============================================================================
 * Configurable demo coordinates for hackathon presentation and fallback mode.
 * Geographically matches the Tirupati satellite/hybrid terrain reference.
 * ============================================================================
 */

export const DEMO_LOCATION = {
  latitude: 13.6288,
  longitude: 79.2982,
  latitudeDelta: 0.032,
  longitudeDelta: 0.032,
  name: 'Mohan Babu University',
  address: 'Mohan Babu University, Sree Sainath Nagar, Tirupati, AP',
  city: 'Tirupati',
  state: 'Andhra Pradesh',
  country: 'India',
  postalCode: '517102',
  camera: {
    pitch: 45, // 3D perspective tilt
    heading: 25, // Camera bearing
    zoom: 15.5,
    altitude: 1200,
  },
};

export default DEMO_LOCATION;
