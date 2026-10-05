import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { triggerHaptic } from '../../utils/haptics';

export const MapControls = ({
  currentStyle = 'HYBRID',
  is3D = true,
  bearing = 0,
  onCenterOnUser,
  onResetBearing,
  onToggleMapStyle,
  onToggleTilt,
  onZoomIn,
  onZoomOut,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* 📍 Center on me */}
      <TouchableOpacity
        style={styles.controlBtn}
        onPress={() => {
          triggerHaptic('impactLight');
          if (onCenterOnUser) onCenterOnUser();
        }}
        activeOpacity={0.75}
        accessibilityLabel="Center on me"
      >
        <Ionicons name="locate" size={17} color={COLORS.cyan} />
      </TouchableOpacity>

      {/* 🧭 Compass (Resets Bearing / Shows Heading) */}
      <TouchableOpacity
        style={styles.controlBtn}
        onPress={() => {
          triggerHaptic('impactLight');
          if (onResetBearing) onResetBearing();
        }}
        activeOpacity={0.75}
        accessibilityLabel="Compass"
      >
        <Ionicons
          name="compass-outline"
          size={18}
          color="#FFFFFF"
          style={{ transform: [{ rotate: `${-bearing}deg` }] }}
        />
      </TouchableOpacity>

      {/* 🗺️ Map style switcher */}
      <TouchableOpacity
        style={[styles.controlBtn, styles.styleBtn]}
        onPress={() => {
          triggerHaptic('impactLight');
          if (onToggleMapStyle) onToggleMapStyle();
        }}
        activeOpacity={0.75}
        accessibilityLabel="Toggle map style"
      >
        <Ionicons name="layers-outline" size={16} color={COLORS.cyan} />
        <Text style={styles.styleLabel}>{currentStyle.slice(0, 3)}</Text>
      </TouchableOpacity>

      {/* ＋ / － Zoom Controls */}
      <View style={styles.zoomStack}>
        <TouchableOpacity
          style={styles.zoomBtn}
          onPress={() => {
            triggerHaptic('impactLight');
            if (onZoomIn) onZoomIn();
          }}
          activeOpacity={0.75}
          accessibilityLabel="Zoom in"
        >
          <Ionicons name="add" size={17} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.zoomDivider} />

        <TouchableOpacity
          style={styles.zoomBtn}
          onPress={() => {
            triggerHaptic('impactLight');
            if (onZoomOut) onZoomOut();
          }}
          activeOpacity={0.75}
          accessibilityLabel="Zoom out"
        >
          <Ionicons name="remove" size={17} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    top: 60,
    gap: 8,
    zIndex: 40,
  },
  controlBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(5, 8, 20, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
  styleBtn: {
    paddingVertical: 2,
    height: 40,
    borderRadius: 12,
    gap: 1,
  },
  styleLabel: {
    fontSize: 7,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.5,
  },
  zoomStack: {
    width: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(5, 8, 20, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
  zoomBtn: {
    width: 36,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    width: 20,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});

export default MapControls;
