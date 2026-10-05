import { useState, useRef, useCallback } from 'react';
import { Animated, Easing } from 'react-native';
import { DEFAULT_CAMERA } from '../services/mapService';
import { triggerHaptic } from '../utils/haptics';

export const useMapCamera = (initialConfig = DEFAULT_CAMERA) => {
  const [camera, setCamera] = useState({
    pitch: initialConfig.pitch ?? 40,
    bearing: initialConfig.bearing ?? 15,
    zoom: initialConfig.zoom ?? 15,
    center: initialConfig.center,
  });

  // Animated values for 60fps native transformations
  const pitchAnim = useRef(new Animated.Value(camera.pitch)).current;
  const bearingAnim = useRef(new Animated.Value(camera.bearing)).current;
  const zoomAnim = useRef(new Animated.Value(camera.zoom)).current;
  const panX = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

  /**
   * Smoothly animates camera to new coordinates, zoom, pitch, and bearing.
   */
  const animateToLocation = useCallback(
    ({ latitude, longitude, zoom = 15.5, pitch = 45, bearing = 0, duration = 900 }) => {
      triggerHaptic('impactLight');

      Animated.parallel([
        Animated.timing(pitchAnim, {
          toValue: pitch,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bearingAnim, {
          toValue: bearing,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(zoomAnim, {
          toValue: zoom,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.spring(panX, {
          toValue: 0,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.spring(panY, {
          toValue: 0,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();

      setCamera({
        center: { latitude, longitude },
        zoom,
        pitch,
        bearing,
      });
    },
    [bearingAnim, panX, panY, pitchAnim, zoomAnim]
  );

  const centerOnUser = useCallback(
    (userCoords) => {
      if (!userCoords) return;
      animateToLocation({
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        zoom: 15.2,
        pitch: 42,
        bearing: 0,
        duration: 800,
      });
    },
    [animateToLocation]
  );

  const focusDriver = useCallback(
    (driver) => {
      if (!driver) return;
      animateToLocation({
        latitude: driver.latitude,
        longitude: driver.longitude,
        zoom: 16.5,
        pitch: 48,
        bearing: driver.bearing || 25,
        duration: 1000,
      });
    },
    [animateToLocation]
  );

  const focusCar = useCallback(
    (car) => {
      if (!car) return;
      animateToLocation({
        latitude: car.latitude,
        longitude: car.longitude,
        zoom: 16.5,
        pitch: 48,
        bearing: car.bearing || 10,
        duration: 1000,
      });
    },
    [animateToLocation]
  );

  const resetMap = useCallback(() => {
    animateToLocation({
      latitude: camera.center.latitude,
      longitude: camera.center.longitude,
      zoom: 15,
      pitch: 40,
      bearing: 0,
      duration: 700,
    });
  }, [animateToLocation, camera.center]);

  const rotateToBearing = useCallback(
    (newBearing) => {
      Animated.timing(bearingAnim, {
        toValue: newBearing,
        duration: 600,
        useNativeDriver: true,
      }).start();
      setCamera((prev) => ({ ...prev, bearing: newBearing }));
    },
    [bearingAnim]
  );

  const toggleTilt = useCallback(() => {
    triggerHaptic('impactLight');
    const newPitch = camera.pitch > 20 ? 0 : 45;
    Animated.timing(pitchAnim, {
      toValue: newPitch,
      duration: 600,
      useNativeDriver: true,
    }).start();
    setCamera((prev) => ({ ...prev, pitch: newPitch }));
  }, [camera.pitch, pitchAnim]);

  const zoomIn = useCallback(() => {
    triggerHaptic('impactLight');
    const newZoom = Math.min(camera.zoom + 1, 18);
    Animated.timing(zoomAnim, {
      toValue: newZoom,
      duration: 400,
      useNativeDriver: false,
    }).start();
    setCamera((prev) => ({ ...prev, zoom: newZoom }));
  }, [camera.zoom, zoomAnim]);

  const zoomOut = useCallback(() => {
    triggerHaptic('impactLight');
    const newZoom = Math.max(camera.zoom - 1, 12);
    Animated.timing(zoomAnim, {
      toValue: newZoom,
      duration: 400,
      useNativeDriver: false,
    }).start();
    setCamera((prev) => ({ ...prev, zoom: newZoom }));
  }, [camera.zoom, zoomAnim]);

  return {
    camera,
    pitchAnim,
    bearingAnim,
    zoomAnim,
    panX,
    panY,
    centerOnUser,
    focusDriver,
    focusCar,
    resetMap,
    animateToLocation,
    rotateToBearing,
    toggleTilt,
    zoomIn,
    zoomOut,
  };
};

export default useMapCamera;
