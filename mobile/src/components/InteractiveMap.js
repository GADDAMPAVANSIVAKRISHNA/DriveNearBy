import React from 'react';
import LiveMobilityMap from './map/LiveMobilityMap';

/**
 * Backward-compatible bridge to LiveMobilityMap.
 * Preserves all legacy prop contracts while offering full 3D camera pitch,
 * live GPS tracking, animated routes, radar discovery, and map controls.
 */
export const InteractiveMap = ({
  userLocation,
  markers = [],
  selectedMarkerId,
  onSelectMarker,
  onBookUnit,
  onViewDetails,
  height = 260,
  interactive = true,
  tripStatus = null,
  isScanning = false,
  showControls = true,
  showBottomSheet = true,
  style,
}) => {
  return (
    <LiveMobilityMap
      userLocation={userLocation}
      markers={markers}
      selectedMarkerId={selectedMarkerId}
      onSelectMarker={onSelectMarker}
      onBookUnit={onBookUnit}
      onViewDetails={onViewDetails}
      height={height}
      interactive={interactive}
      tripStatus={tripStatus}
      isScanning={isScanning}
      showControls={showControls}
      showBottomSheet={showBottomSheet}
      style={style}
    />
  );
};

export default InteractiveMap;
