import { useState, useEffect } from 'react';
import mockLocationService from '../services/mockLocationService';

export const useNearbyMobility = (userLocation, options = { enableLiveDrift: true, intervalMs: 3000 }) => {
  const [drivers, setDrivers] = useState([]);
  const [cars, setCars] = useState([]);
  const [aiRecommendedDriver, setAiRecommendedDriver] = useState(null);
  const [aiRecommendedCar, setAiRecommendedCar] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!userLocation || !userLocation.latitude) return;

    if (!options.enableLiveDrift) {
      const initial = mockLocationService.getInitialNearbyUnits(userLocation);
      setDrivers(initial.drivers);
      setCars(initial.cars);
      setAiRecommendedDriver(initial.drivers.find((d) => d.isAIMatch) || initial.drivers[0]);
      setAiRecommendedCar(initial.cars.find((c) => c.isAIMatch) || initial.cars[0]);
      return;
    }

    const unsubscribe = mockLocationService.startLiveTrackingSimulation(
      userLocation,
      (updated) => {
        setDrivers(updated.drivers || []);
        setCars(updated.cars || []);
        setAiRecommendedDriver((updated.drivers || []).find((d) => d.isAIMatch) || updated.drivers?.[0]);
        setAiRecommendedCar((updated.cars || []).find((c) => c.isAIMatch) || updated.cars?.[0]);
      },
      options.intervalMs || 3000
    );

    return () => unsubscribe();
  }, [userLocation?.latitude, userLocation?.longitude, options.enableLiveDrift, options.intervalMs]);

  const triggerRadarDiscovery = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2800);
  };

  return {
    drivers,
    cars,
    allUnits: [...drivers, ...cars],
    aiRecommendedDriver,
    aiRecommendedCar,
    isScanning,
    triggerRadarDiscovery,
  };
};

export default useNearbyMobility;
