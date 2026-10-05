import React, { createContext, useState, useEffect, useContext } from 'react';
import locationService, { DEFAULT_LOCATION } from '../services/locationService';
import LocationPermissionModal from '../components/map/LocationPermissionModal';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [permissionGranted, setPermissionGranted] = useState(true);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const fetchLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const res = await locationService.requestLocationPermissionAndGet();
      setPermissionGranted(res.permissionGranted);

      if (res.permissionGranted && res.coords) {
        setLocation({
          latitude: res.coords.latitude,
          longitude: res.coords.longitude,
          address: res.formattedAddress || 'Real GPS Position, Bengaluru',
          city: 'Bengaluru',
        });
        setIsDemoMode(false);
        setShowPermissionModal(false);
      } else {
        // Show permission explanation modal with Demo option
        setShowPermissionModal(true);
      }
    } catch (err) {
      console.warn('Error fetching location:', err);
      setShowPermissionModal(true);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleUseDemoLocation = () => {
    setLocation(DEFAULT_LOCATION);
    setIsDemoMode(true);
    setShowPermissionModal(false);
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        permissionGranted,
        isLoadingLocation,
        isDemoMode,
        refreshLocation: fetchLocation,
        useDemoLocation: handleUseDemoLocation,
      }}
    >
      {children}
      <LocationPermissionModal
        visible={showPermissionModal}
        onAllowLocation={fetchLocation}
        onUseDemoLocation={handleUseDemoLocation}
      />
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
export default LocationContext;
