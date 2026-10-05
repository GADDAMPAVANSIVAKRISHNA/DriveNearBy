import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { DEFAULT_LOCATION } from '../services/locationService';

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [accuracy, setAccuracy] = useState(15);
  const [heading, setHeading] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState('undetermined'); // 'granted' | 'denied' | 'undetermined'
  const [isLocating, setIsLocating] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const requestPermission = useCallback(async () => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status === 'granted') {
        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setUserLocation({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
          address: 'Current Real GPS Position',
          city: 'Bengaluru',
        });
        setAccuracy(current.coords.accuracy || 12);
        setHeading(current.coords.heading || 0);
        setIsDemoMode(false);
      } else {
        // Fall back gracefully to demo location
        setUserLocation(DEFAULT_LOCATION);
        setIsDemoMode(true);
      }
    } catch (err) {
      console.warn('Location detection notice:', err.message);
      setUserLocation(DEFAULT_LOCATION);
      setIsDemoMode(true);
    } finally {
      setIsLocating(false);
    }
  }, []);

  const useDemoLocation = useCallback(() => {
    setUserLocation(DEFAULT_LOCATION);
    setIsDemoMode(true);
    setPermissionStatus('denied');
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return {
    userLocation,
    setUserLocation,
    accuracy,
    heading,
    permissionStatus,
    isLocating,
    isDemoMode,
    requestPermission,
    useDemoLocation,
  };
};

export default useUserLocation;
