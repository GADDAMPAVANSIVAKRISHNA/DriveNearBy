import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import UserLocationMarker from './UserLocationMarker';
import DriverMarker from './DriverMarker';
import CarMarker from './CarMarker';
import { COLORS } from '../../constants/theme';

export const RealMapView = forwardRef(({
  userLocation,
  markers = [],
  selectedMarkerId,
  routeCoordinates = [],
  mapStyle = 'HYBRID',
  isScanning = false,
  scanRadius = 400,
  onSelectMarker,
  onMapPress,
  initialCamera,
}, ref) => {
  const mapRef = useRef(null);

  useImperativeHandle(ref, () => ({
    animateCamera: (cameraOptions, duration = 1200) => {
      if (mapRef.current) {
        mapRef.current.animateCamera(cameraOptions, { duration });
      }
    },
    fitToCoordinates: (coordinates, options = {}) => {
      if (mapRef.current && coordinates.length > 0) {
        mapRef.current.fitToCoordinates(coordinates, {
          edgePadding: { top: 90, right: 60, bottom: 220, left: 60 },
          animated: true,
          ...options,
        });
      }
    },
    setCamera: (cameraOptions) => {
      if (mapRef.current) {
        mapRef.current.setCamera(cameraOptions);
      }
    },
  }));

  // Resolve MapView mapType string ('hybrid' | 'satellite' | 'standard')
  const resolvedMapType =
    mapStyle === 'SATELLITE'
      ? 'satellite'
      : mapStyle === 'ROADMAP'
      ? 'standard'
      : 'hybrid'; // Default is HYBRID (Satellite + Roads + Labels)

  const centerCoords = {
    latitude: userLocation?.latitude || 13.6288,
    longitude: userLocation?.longitude || 79.2982,
  };

  const defaultCamera = {
    center: centerCoords,
    pitch: 45, // 3D camera tilt
    heading: 25, // Bearing
    zoom: 15.5,
    altitude: 1200,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        mapType={resolvedMapType}
        initialCamera={initialCamera || defaultCamera}
        showsBuildings={true}
        showsIndoors={true}
        showsTraffic={false}
        showsCompass={false}
        showsMyLocationButton={false}
        showsScale={false}
        pitchEnabled={true}
        rotateEnabled={true}
        zoomEnabled={true}
        scrollEnabled={true}
        onPress={onMapPress}
      >
        {/* Subtle Search Pulse Circle around User (Requirement 9) */}
        {isScanning && (
          <Circle
            center={centerCoords}
            radius={scanRadius}
            strokeColor="rgba(0, 242, 254, 0.45)"
            strokeWidth={1.5}
            fillColor="rgba(0, 242, 254, 0.08)"
          />
        )}

        {/* Real Geographic Polyline Route from User to Selected Driver/Destination */}
        {routeCoordinates && routeCoordinates.length >= 2 && (
          <>
            {/* Outer Cyan Glow Casing */}
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="rgba(0, 242, 254, 0.35)"
              strokeWidth={8}
              lineCap="round"
              lineJoin="round"
            />
            {/* Core Bright Neon Cyan Polyline */}
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={COLORS.cyan}
              strokeWidth={4.5}
              lineCap="round"
              lineJoin="round"
            />
          </>
        )}

        {/* Real Geographic User Location Marker: 📍 YOU */}
        {userLocation && (
          <Marker
            coordinate={centerCoords}
            anchor={{ x: 0.5, y: 0.5 }}
            zIndex={20}
            tracksViewChanges={false}
          >
            <UserLocationMarker
              heading={25}
              isDemo={userLocation?.address?.includes('Demo') || false}
            />
          </Marker>
        )}

        {/* Real Geographic Nearby Drivers and Cars */}
        {markers.map((item) => {
          const isSelected = selectedMarkerId === item.id;
          const lat = item.latitude || item.lat;
          const lng = item.longitude || item.lng;

          if (!lat || !lng) return null;

          return (
            <Marker
              key={item.id}
              coordinate={{ latitude: lat, longitude: lng }}
              anchor={{ x: 0.5, y: 0.5 }}
              zIndex={isSelected ? 40 : item.isAIMatch ? 30 : 15}
              onPress={() => onSelectMarker && onSelectMarker(item)}
              tracksViewChanges={false}
            >
              {item.type === 'car' ? (
                <CarMarker
                  car={item}
                  isSelected={isSelected}
                  onPress={onSelectMarker}
                />
              ) : (
                <DriverMarker
                  driver={item}
                  isSelected={isSelected}
                  onPress={onSelectMarker}
                />
              )}
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
});

export default RealMapView;
