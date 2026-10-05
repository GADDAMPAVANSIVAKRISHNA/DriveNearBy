import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { MAP_STYLES, loadMapStyle, saveMapStyle, fetchRealRoadRoute } from '../../services/mapService';
import RealMapView from './RealMapView';
import MapControls from './MapControls';
import MapBottomSheet from './MapBottomSheet';
import { triggerHaptic } from '../../utils/haptics';

export const LiveMobilityMap = ({
  userLocation,
  markers = [],
  selectedMarkerId: externalSelectedId = null,
  onSelectMarker,
  onBookUnit,
  onViewDetails,
  height = null, // null means flex: 1 (occupies full container)
  interactive = true,
  tripStatus = null,
  isScanning = false,
  showControls = true,
  showBottomSheet = true,
  autoSelectAIMatch = false,
  style,
}) => {
  const mapRef = useRef(null);

  const [mapStyle, setMapStyle] = useState(MAP_STYLES.HYBRID);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [bearing, setBearing] = useState(25);
  const [is3D, setIs3D] = useState(true);
  const [scanPulseRadius, setScanPulseRadius] = useState(150);
  const [searchPhase, setSearchPhase] = useState('ready'); // 'scanning' | 'calculating' | 'ready'

  // Load persisted map style (default is HYBRID)
  useEffect(() => {
    loadMapStyle().then(setMapStyle);
  }, []);

  // Sync external selected id
  useEffect(() => {
    if (externalSelectedId) {
      const match = markers.find((m) => m.id === externalSelectedId);
      if (match) {
        handleSelectUnit(match, false);
      }
    }
  }, [externalSelectedId, markers]);

  // Find AI Recommended Driver
  const aiRecommendedDriver = useMemo(() => {
    return (
      markers.find((m) => m.isAIMatch && m.type === 'driver') ||
      markers.find((m) => m.type === 'driver') ||
      null
    );
  }, [markers]);

  // Subtle search pulse animation (Requirement 9)
  useEffect(() => {
    let intervalId;
    if (isScanning) {
      setSearchPhase('scanning');
      let radius = 100;
      intervalId = setInterval(() => {
        radius = radius >= 500 ? 100 : radius + 60;
        setScanPulseRadius(radius);
      }, 180);
    } else {
      setSearchPhase('ready');
      setScanPulseRadius(0);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isScanning]);

  // Smooth Camera Fly-To (Requirement 10)
  const flyToLocation = useCallback((lat, lng, zoom = 16, pitch = 45, heading = 25) => {
    if (mapRef.current) {
      mapRef.current.animateCamera(
        {
          center: { latitude: lat, longitude: lng },
          zoom,
          pitch,
          heading,
        },
        1200
      );
    }
  }, []);

  // Center on user
  const handleCenterOnUser = () => {
    triggerHaptic('impactLight');
    if (userLocation) {
      flyToLocation(userLocation.latitude, userLocation.longitude, 16, 45, 25);
    }
  };

  // Reset compass bearing
  const handleResetBearing = () => {
    triggerHaptic('impactLight');
    setBearing(0);
    if (userLocation) {
      flyToLocation(
        selectedUnit ? (selectedUnit.latitude || selectedUnit.lat) : userLocation.latitude,
        selectedUnit ? (selectedUnit.longitude || selectedUnit.lng) : userLocation.longitude,
        15.8,
        is3D ? 45 : 0,
        0
      );
    }
  };

  // Toggle Map Style: HYBRID -> SATELLITE -> ROADMAP -> HYBRID
  const handleToggleMapStyle = () => {
    triggerHaptic('selection');
    const order = [MAP_STYLES.HYBRID, MAP_STYLES.SATELLITE, MAP_STYLES.ROADMAP];
    const nextIdx = (order.indexOf(mapStyle) + 1) % order.length;
    const nextStyle = order[nextIdx];
    setMapStyle(nextStyle);
    saveMapStyle(nextStyle);
  };

  // Zoom in / Zoom out
  const handleZoomIn = () => {
    triggerHaptic('impactLight');
    const target = selectedUnit || userLocation || { latitude: 13.6288, longitude: 79.2982 };
    flyToLocation(target.latitude || target.lat, target.longitude || target.lng, 17, is3D ? 45 : 0, bearing);
  };

  const handleZoomOut = () => {
    triggerHaptic('impactLight');
    const target = selectedUnit || userLocation || { latitude: 13.6288, longitude: 79.2982 };
    flyToLocation(target.latitude || target.lat, target.longitude || target.lng, 14, is3D ? 45 : 0, bearing);
  };

  // Unit Selection Handler with Fly-To and Real Road Route calculation
  const handleSelectUnit = async (unit, shouldFly = true) => {
    triggerHaptic('impactLight');
    setSelectedUnit(unit);
    if (onSelectMarker) onSelectMarker(unit);

    const unitLat = unit.latitude || unit.lat;
    const unitLng = unit.longitude || unit.lng;

    if (shouldFly && unitLat && unitLng) {
      flyToLocation(unitLat, unitLng, 16.2, 45, 25);
    }

    // Calculate real road route from user to unit
    if (userLocation && unitLat && unitLng) {
      const roadWaypoints = await fetchRealRoadRoute(userLocation, {
        latitude: unitLat,
        longitude: unitLng,
      });
      setRouteCoordinates(roadWaypoints);
    }
  };

  // Auto-connect route to AI Recommended driver if autoSelectAIMatch is true
  useEffect(() => {
    if (autoSelectAIMatch && aiRecommendedDriver && !selectedUnit && userLocation) {
      fetchRealRoadRoute(userLocation, {
        latitude: aiRecommendedDriver.latitude || aiRecommendedDriver.lat,
        longitude: aiRecommendedDriver.longitude || aiRecommendedDriver.lng,
      }).then((route) => {
        setRouteCoordinates(route);
      });
    }
  }, [autoSelectAIMatch, aiRecommendedDriver, selectedUnit, userLocation]);

  // Active Trip Route Calculation
  useEffect(() => {
    if (tripStatus && markers.length >= 2 && userLocation) {
      const pickup = markers.find((m) => m.id === 'pickup') || markers[0];
      const destination = markers.find((m) => m.id === 'destination') || markers[1];

      if (pickup && destination) {
        fetchRealRoadRoute(
          { latitude: pickup.latitude || pickup.lat, longitude: pickup.longitude || pickup.lng },
          { latitude: destination.latitude || destination.lat, longitude: destination.longitude || destination.lng }
        ).then((pts) => {
          setRouteCoordinates(pts);
          if (mapRef.current && pts.length > 0) {
            mapRef.current.fitToCoordinates(pts);
          }
        });
      }
    }
  }, [tripStatus, markers, userLocation]);

  const containerStyle = [
    styles.container,
    height ? { height } : styles.fullFlex,
    style,
  ];

  return (
    <View style={containerStyle}>
      {/* Real Geographic Map (Google Hybrid/Satellite Native or Web) */}
      <RealMapView
        ref={mapRef}
        userLocation={userLocation}
        markers={markers}
        selectedMarkerId={selectedUnit?.id}
        routeCoordinates={routeCoordinates}
        mapStyle={mapStyle}
        isScanning={isScanning}
        scanRadius={scanPulseRadius}
        onSelectMarker={handleSelectUnit}
        onMapPress={() => {
          // Deselect on empty map tap if desired
        }}
      />

      {/* Floating HUD Map Style Pill (Top Left) */}
      <View style={styles.hudPill}>
        <View style={styles.hudLiveDot} />
        <Text style={styles.hudText}>
          {mapStyle} • 3D TERRAIN
        </Text>
      </View>

      {/* Subtle Discovery Search Banner (Requirement 9) */}
      {isScanning && (
        <View style={styles.searchBanner}>
          <ActivityIndicator size="small" color={COLORS.cyan} style={{ marginRight: 6 }} />
          <Text style={styles.searchBannerText}>Finding nearby drivers & vehicles...</Text>
        </View>
      )}

      {/* Floating Glass Map Controls (Top Right - Requirement 14) */}
      {showControls && (
        <MapControls
          currentStyle={mapStyle}
          is3D={is3D}
          bearing={bearing}
          onCenterOnUser={handleCenterOnUser}
          onResetBearing={handleResetBearing}
          onToggleMapStyle={handleToggleMapStyle}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
      )}

      {/* Modern Glass Bottom Sheet (Requirement 16) */}
      {showBottomSheet && selectedUnit && (
        <MapBottomSheet
          unit={selectedUnit}
          onClose={() => {
            setSelectedUnit(null);
            setRouteCoordinates([]);
          }}
          onBook={onBookUnit}
          onViewDetails={onViewDetails}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#050814',
  },
  fullFlex: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  hudPill: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(5, 8, 20, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    zIndex: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
  },
  hudLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.neonGreen,
  },
  hudText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.8,
  },
  searchBanner: {
    position: 'absolute',
    top: 52,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 8, 20, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 35,
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  searchBannerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default LiveMobilityMap;
