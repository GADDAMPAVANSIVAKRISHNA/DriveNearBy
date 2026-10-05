import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * Interactive Web Hybrid Satellite Map implementation
 * Used when running on Web / Browser environments.
 * Uses real satellite tiles + roads + labels + terrain + custom markers.
 */
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
  const iframeRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const centerLat = userLocation?.latitude || 13.6288;
  const centerLng = userLocation?.longitude || 79.2982;

  useImperativeHandle(ref, () => ({
    animateCamera: (cameraOptions, duration = 1200) => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'FLY_TO',
            lat: cameraOptions.center?.latitude || cameraOptions.latitude,
            lng: cameraOptions.center?.longitude || cameraOptions.longitude,
            zoom: cameraOptions.zoom || 16,
          },
          '*'
        );
      }
    },
    fitToCoordinates: (coordinates) => {
      if (iframeRef.current && iframeRef.current.contentWindow && coordinates.length > 0) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'FIT_BOUNDS',
            coordinates,
          },
          '*'
        );
      }
    },
    setCamera: (cameraOptions) => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'SET_VIEW',
            lat: cameraOptions.center?.latitude || cameraOptions.latitude,
            lng: cameraOptions.center?.longitude || cameraOptions.longitude,
            zoom: cameraOptions.zoom || 15.5,
          },
          '*'
        );
      }
    },
  }));

  // Handle messages from iframe (e.g. marker selected)
  useEffect(() => {
    const handleWindowMessage = (event) => {
      if (!event.data) return;
      if (event.data.type === 'MARKER_CLICK') {
        const found = markers.find((m) => m.id === event.data.id);
        if (found && onSelectMarker) onSelectMarker(found);
      } else if (event.data.type === 'MAP_CLICK') {
        if (onMapPress) onMapPress();
      } else if (event.data.type === 'MAP_READY') {
        setMapLoaded(true);
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [markers, onSelectMarker, onMapPress]);

  // Synchronize state with iframe
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow && mapLoaded) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'SYNC_STATE',
          userLocation: { latitude: centerLat, longitude: centerLng },
          markers,
          selectedMarkerId,
          routeCoordinates,
          mapStyle,
          isScanning,
        },
        '*'
      );
    }
  }, [centerLat, centerLng, markers, selectedMarkerId, routeCoordinates, mapStyle, isScanning, mapLoaded]);

  // Generate HTML for interactive Leaflet satellite/hybrid map
  const leafletHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #050814; overflow: hidden; }
          .leaflet-control-attribution, .leaflet-control-zoom { display: none !important; }
          
          /* Custom User Marker */
          .user-pin-wrap { position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; }
          .user-pin-pulse { position: absolute; width: 36px; height: 36px; border-radius: 50%; background: rgba(0, 242, 254, 0.25); border: 1.5px solid #00F2FE; animation: pulse 2.2s infinite ease-out; }
          .user-pin-core { width: 20px; height: 20px; border-radius: 50%; background: #00F2FE; border: 2.5px solid #FFFFFF; box-shadow: 0 0 12px #00F2FE; display: flex; align-items: center; justify-content: center; z-index: 5; font-size: 9px; font-weight: 900; color: #050814; }
          .user-label-pill { position: absolute; top: -16px; background: rgba(5,8,20,0.92); border: 1px solid rgba(0,242,254,0.6); color: #FFF; font-size: 8px; font-weight: 900; padding: 1px 5px; border-radius: 4px; white-space: nowrap; }

          /* Driver Marker */
          .driver-pin { width: 34px; height: 34px; border-radius: 50%; border: 2px solid #FFF; box-shadow: 0 2px 8px rgba(0,0,0,0.6); position: relative; cursor: pointer; transition: transform 0.2s; }
          .driver-pin:hover { transform: scale(1.15); }
          .driver-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
          .driver-dot { position: absolute; bottom: -2px; right: -2px; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid #050814; }
          .driver-ai-ring { position: absolute; top: -4px; left: -4px; width: 38px; height: 38px; border-radius: 50%; border: 2px solid #00F2FE; box-shadow: 0 0 10px #00F2FE; animation: ringPulse 1.4s infinite; }
          .driver-pill { position: absolute; bottom: -14px; left: 50%; transform: translateX(-50%); background: rgba(5,8,20,0.92); border: 1px solid rgba(255,255,255,0.2); color: #FFF; font-size: 7.5px; font-weight: 800; padding: 1px 4px; border-radius: 4px; white-space: nowrap; }
          .driver-pill.ai { border-color: #00F2FE; color: #00F2FE; }

          /* Car Marker */
          .car-pin { width: 28px; height: 28px; border-radius: 50%; background: #0A1224; border: 1.5px solid #00F2FE; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.6); font-size: 13px; cursor: pointer; position: relative; }
          .car-pill { position: absolute; bottom: -13px; left: 50%; transform: translateX(-50%); background: rgba(5,8,20,0.92); border: 1px solid rgba(255,255,255,0.2); color: #FFF; font-size: 7px; font-weight: 800; padding: 1px 3px; border-radius: 4px; white-space: nowrap; }

          @keyframes pulse { 0% { transform: scale(0.6); opacity: 1; } 100% { transform: scale(2.2); opacity: 0; } }
          @keyframes ringPulse { 0% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.2); opacity: 0.5; } 100% { transform: scale(1); opacity: 0.9; } }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', {
            center: [${centerLat}, ${centerLng}],
            zoom: 15.5,
            zoomControl: false,
          });

          // Satellite Imagery Layer (ESRI World Imagery)
          const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
            attribution: 'Esri Satellite'
          });

          // Hybrid Labels & Roads Overlays
          const labelsLayer = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19
          });
          const roadsLayer = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19
          });

          // Standard Roadmap Layer
          const roadmapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          });

          satelliteLayer.addTo(map);
          roadsLayer.addTo(map);
          labelsLayer.addTo(map);

          let currentLayers = [satelliteLayer, roadsLayer, labelsLayer];
          let markerGroup = L.layerGroup().addTo(map);
          let routeGroup = L.layerGroup().addTo(map);
          let searchCircle = null;

          function setStyle(style) {
            currentLayers.forEach(l => map.removeLayer(l));
            if (style === 'SATELLITE') {
              satelliteLayer.addTo(map);
              currentLayers = [satelliteLayer];
            } else if (style === 'ROADMAP') {
              roadmapLayer.addTo(map);
              currentLayers = [roadmapLayer];
            } else { // HYBRID
              satelliteLayer.addTo(map);
              roadsLayer.addTo(map);
              labelsLayer.addTo(map);
              currentLayers = [satelliteLayer, roadsLayer, labelsLayer];
            }
          }

          map.on('click', () => {
            window.parent.postMessage({ type: 'MAP_CLICK' }, '*');
          });

          window.addEventListener('message', (e) => {
            const data = e.data;
            if (!data) return;

            if (data.type === 'FLY_TO') {
              map.flyTo([data.lat, data.lng], data.zoom || 16, { duration: 1.2 });
            } else if (data.type === 'SET_VIEW') {
              map.setView([data.lat, data.lng], data.zoom || 15.5);
            } else if (data.type === 'FIT_BOUNDS' && data.coordinates) {
              const bounds = L.latLngBounds(data.coordinates.map(c => [c.latitude, c.longitude]));
              map.fitBounds(bounds, { padding: [60, 60] });
            } else if (data.type === 'SYNC_STATE') {
              if (data.mapStyle) setStyle(data.mapStyle);

              // Update Search Pulse Circle
              if (searchCircle) map.removeLayer(searchCircle);
              if (data.isScanning && data.userLocation) {
                searchCircle = L.circle([data.userLocation.latitude, data.userLocation.longitude], {
                  radius: 400,
                  color: '#00F2FE',
                  weight: 1.5,
                  fillColor: '#00F2FE',
                  fillOpacity: 0.1
                }).addTo(map);
              }

              // Update Markers
              markerGroup.clearLayers();

              // User Location Marker
              if (data.userLocation) {
                const userIcon = L.divIcon({
                  className: 'custom-user-marker',
                  html: '<div class="user-pin-wrap"><div class="user-label-pill">📍 YOU</div><div class="user-pin-pulse"></div><div class="user-pin-core"></div></div>',
                  iconSize: [44, 44],
                  iconAnchor: [22, 22]
                });
                L.marker([data.userLocation.latitude, data.userLocation.longitude], { icon: userIcon, zIndexOffset: 1000 }).addTo(markerGroup);
              }

              // Nearby Drivers & Cars
              (data.markers || []).forEach(m => {
                const isSelected = data.selectedMarkerId === m.id;
                const isAIMatch = m.isAIMatch || (m.matchScore >= 92);
                let html = '';

                if (m.type === 'car') {
                  const model = (m.name || 'Car').split(' ')[0];
                  html = '<div class="car-pin">' +
                    (isSelected ? '<div style="position:absolute; inset:-4px; border:2px solid #FFF; border-radius:50%;"></div>' : '') +
                    '🚗' +
                    '<div class="car-pill">' + model + ' ⭐' + (m.rating || 4.8) + '</div>' +
                  '</div>';
                } else {
                  const statusBg = m.status === 'BUSY' ? '#F59E0B' : m.status === 'OFFLINE' ? '#6B7280' : '#10B981';
                  const avatar = m.avatar || m.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80';
                  html = '<div class="driver-pin" style="' + (isSelected ? 'border-color:#00F2FE; box-shadow:0 0 12px #00F2FE;' : '') + '">' +
                    (isAIMatch ? '<div class="driver-ai-ring"></div>' : '') +
                    '<img class="driver-img" src="' + avatar + '" />' +
                    '<div class="driver-dot" style="background:' + statusBg + '"></div>' +
                    '<div class="driver-pill ' + (isAIMatch ? 'ai' : '') + '">' + (isAIMatch ? (m.matchScore || 96) + '% AI' : '⭐' + (m.rating || 4.8)) + '</div>' +
                  '</div>';
                }

                const markerIcon = L.divIcon({
                  className: 'custom-map-unit',
                  html: html,
                  iconSize: [36, 36],
                  iconAnchor: [18, 18]
                });

                const leafMarker = L.marker([m.latitude, m.longitude], {
                  icon: markerIcon,
                  zIndexOffset: isSelected ? 800 : isAIMatch ? 600 : 300
                }).addTo(markerGroup);

                leafMarker.on('click', () => {
                  window.parent.postMessage({ type: 'MARKER_CLICK', id: m.id }, '*');
                });
              });

              // Route Polyline
              routeGroup.clearLayers();
              if (data.routeCoordinates && data.routeCoordinates.length >= 2) {
                const latlngs = data.routeCoordinates.map(pt => [pt.latitude, pt.longitude]);
                // Glow casing
                L.polyline(latlngs, { color: 'rgba(0, 242, 254, 0.4)', weight: 8 }).addTo(routeGroup);
                // Core cyan road line
                L.polyline(latlngs, { color: '#00F2FE', weight: 4.5 }).addTo(routeGroup);
              }
            }
          });

          window.parent.postMessage({ type: 'MAP_READY' }, '*');
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <iframe
        ref={iframeRef}
        srcDoc={leafletHtml}
        style={styles.iframe}
        title="Real Hybrid Satellite Map"
        frameBorder="0"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    backgroundColor: '#050814',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
});

export default RealMapView;
