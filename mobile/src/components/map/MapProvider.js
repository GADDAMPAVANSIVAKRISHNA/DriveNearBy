/**
 * ============================================================================
 * MAP PROVIDER - UNIFIED ARCHITECTURE ABSTRACTION
 * ============================================================================
 * Clean architectural bridge allowing seamless switching between:
 * 1. Current: React Native Google Maps (HYBRID / SATELLITE with 3D buildings)
 * 2. Future: Native Google Maps 3D Photorealistic Mesh SDK
 * ============================================================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { MAP_STYLES, DEFAULT_CAMERA, loadMapStyle, saveMapStyle } from '../../services/mapService';

const MapContext = createContext();

export const MAP_ENGINES = {
  EXPO_GOOGLE_MAPS: 'expo_google_maps', // React Native Google Maps (HYBRID/SATELLITE)
  NATIVE_GOOGLE_3D: 'native_google_3d', // Google Photorealistic 3D Maps SDK (future drop-in)
};

export const MapProvider = ({
  children,
  initialEngine = MAP_ENGINES.EXPO_GOOGLE_MAPS,
}) => {
  const [engine, setEngine] = useState(initialEngine);
  const [mapStyle, setMapStyleState] = useState(MAP_STYLES.HYBRID);
  const [activeCamera, setActiveCamera] = useState(DEFAULT_CAMERA);
  const [is3DBuildingsEnabled, setIs3DBuildingsEnabled] = useState(true);

  // Load saved map style (defaults to HYBRID)
  useEffect(() => {
    loadMapStyle().then(setMapStyleState);
  }, []);

  const setMapStyle = (newStyle) => {
    setMapStyleState(newStyle);
    saveMapStyle(newStyle);
  };

  const cycleMapStyle = () => {
    const sequence = [MAP_STYLES.HYBRID, MAP_STYLES.SATELLITE, MAP_STYLES.ROADMAP];
    const currentIndex = sequence.indexOf(mapStyle);
    const nextStyle = sequence[(currentIndex + 1) % sequence.length];
    setMapStyle(nextStyle);
    return nextStyle;
  };

  const switchEngine = (newEngine) => {
    if (newEngine === MAP_ENGINES.NATIVE_GOOGLE_3D && Platform.OS === 'web') {
      console.warn('Google 3D Native Engine requires Android/iOS build target.');
      return;
    }
    setEngine(newEngine);
  };

  return (
    <MapContext.Provider
      value={{
        engine,
        mapStyle,
        setMapStyle,
        cycleMapStyle,
        activeCamera,
        setActiveCamera,
        is3DBuildingsEnabled,
        setIs3DBuildingsEnabled,
        switchEngine,
        isGoogle3DAvailable: false, // Flag ready for future native 3D SDK binding
        supportedStyles: [MAP_STYLES.HYBRID, MAP_STYLES.SATELLITE, MAP_STYLES.ROADMAP],
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapProvider = () => useContext(MapContext);
export default MapProvider;
