import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

// Predefined device size presets for laptop/desktop preview
const DEVICE_PRESETS = [
  {
    id: 'mobile-standard',
    name: 'Standard Mobile',
    shortName: '390px',
    icon: 'phone-portrait-outline',
    width: 390,
    aspectRatio: '19.5:9',
    description: 'iPhone 14 / 15 / 16 / Pixel 8',
  },
  {
    id: 'mobile-max',
    name: 'Pro Max',
    shortName: '430px',
    icon: 'phone-portrait',
    width: 430,
    aspectRatio: '19.5:9',
    description: 'iPhone Pro Max / Galaxy S24 Ultra',
  },
  {
    id: 'tablet-fold',
    name: 'Fold / Tablet',
    shortName: '600px',
    icon: 'tablet-portrait-outline',
    width: 600,
    aspectRatio: '4:3',
    description: 'Galaxy Fold / iPad Mini',
  },
  {
    id: 'fluid-full',
    name: 'Fluid Laptop',
    shortName: 'Full Width',
    icon: 'laptop-outline',
    width: '100%',
    aspectRatio: 'Responsive',
    description: 'Adapts to full browser window',
  },
];

export const ResponsiveContainer = ({ children }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  // State for active device preset on laptop/desktop web
  const [selectedPresetId, setSelectedPresetId] = useState('mobile-standard');
  const [showBezel, setShowBezel] = useState(true);

  // Current system time for simulated phone status bar
  const [timeString, setTimeString] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setTimeString(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Determine if we should show native 1:1 mobile mode without simulator chrome:
  // If not web, OR if the browser window width is <= 520px (a real phone browser or narrowed window)
  const isNativeOrSmallMobile = !isWeb || windowWidth <= 520;

  // 1. PURE MOBILE VIEW: Directly render 100% full screen with no outer chrome
  if (isNativeOrSmallMobile) {
    return (
      <View style={styles.nativeMobileWrapper}>
        {children}
      </View>
    );
  }

  // 2. LAPTOP / DESKTOP RESPONSIVE VIEW:
  // Dynamically adapt ratio based on selected preset
  const activePreset = DEVICE_PRESETS.find((p) => p.id === selectedPresetId) || DEVICE_PRESETS[0];
  const isFullWidthMode = activePreset.id === 'fluid-full';

  // Calculate container dimensions
  const targetDeviceWidth = isFullWidthMode ? '100%' : activePreset.width;
  // Frame height: fits nicely within the laptop viewport with margin for top toolbar
  const maxAvailableHeight = Math.max(windowHeight - 96, 620);
  const targetDeviceHeight = isFullWidthMode ? '100%' : Math.min(maxAvailableHeight, 884);

  return (
    <View style={styles.desktopOuterBackdrop}>
      {/* Ambient Cyber Grid & Glow */}
      <LinearGradient
        colors={['#030611', '#060B1B', '#02040A']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Subtle ambient lighting orbs on laptop screen */}
      <View style={styles.ambientOrbLeft} />
      <View style={styles.ambientOrbRight} />

      {/* TOP DESKTOP RATIO & DEVICE SWITCHER TOOLBAR */}
      <View style={styles.topControlToolbar}>
        <View style={styles.brandBadge}>
          <LinearGradient
            colors={[COLORS.cyan, '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.brandIconGrad}
          >
            <Ionicons name="car-sport" size={14} color="#050814" />
          </LinearGradient>
          <View>
            <Text style={styles.brandTitle}>DriveNearby AI</Text>
            <Text style={styles.brandSubtitle}>Responsive Mobile Viewport</Text>
          </View>
        </View>

        {/* Ratio Preset Buttons */}
        <View style={styles.presetButtonsGroup}>
          {DEVICE_PRESETS.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <TouchableOpacity
                key={preset.id}
                style={[
                  styles.presetBtn,
                  isSelected && styles.presetBtnActive,
                ]}
                onPress={() => setSelectedPresetId(preset.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={preset.icon}
                  size={14}
                  color={isSelected ? COLORS.cyan : 'rgba(255,255,255,0.6)'}
                />
                <Text
                  style={[
                    styles.presetBtnText,
                    isSelected && styles.presetBtnTextActive,
                  ]}
                >
                  {preset.shortName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bezel Toggle & Device Info */}
        <View style={styles.toolbarRightActions}>
          {!isFullWidthMode && (
            <TouchableOpacity
              style={[styles.toolActionBtn, showBezel && styles.toolActionBtnActive]}
              onPress={() => setShowBezel((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={showBezel ? 'tablet-landscape' : 'square-outline'}
                size={14}
                color={showBezel ? COLORS.cyan : 'rgba(255,255,255,0.6)'}
              />
              <Text style={styles.toolActionBtnText}>
                {showBezel ? 'Frame On' : 'No Frame'}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.specsBadge}>
            <Text style={styles.specsText}>
              {isFullWidthMode ? 'Fluid Window' : `${activePreset.width}px • ${activePreset.aspectRatio}`}
            </Text>
          </View>
        </View>
      </View>

      {/* CENTER WORKSPACE: DESKTOP SIDEBARS + PHONE SCREEN CONTAINER */}
      <View style={styles.stageContainer}>
        {/* Left Side Info Panel (Only on wide desktop screens > 1150px) */}
        {windowWidth > 1150 && !isFullWidthMode && (
          <View style={styles.sideInfoPanel}>
            <View style={styles.sideCard}>
              <View style={styles.sideCardHeader}>
                <Ionicons name="sparkles" size={16} color={COLORS.cyan} />
                <Text style={styles.sideCardTitle}>AI Mobility Engine</Text>
              </View>
              <Text style={styles.sideCardDesc}>
                DriveNearby AI combines satellite geo-matching, real-time driver telemetry, and dynamic trust scoring into a seamless mobile UI.
              </Text>
              
              <View style={styles.sideFeatureList}>
                <View style={styles.sideFeatureItem}>
                  <Ionicons name="checkmark-circle" size={13} color="#10B981" />
                  <Text style={styles.sideFeatureText}>Real-Time Satellite Hybrid Map</Text>
                </View>
                <View style={styles.sideFeatureItem}>
                  <Ionicons name="checkmark-circle" size={13} color="#10B981" />
                  <Text style={styles.sideFeatureText}>Dual Car & Chauffeur Booking</Text>
                </View>
                <View style={styles.sideFeatureItem}>
                  <Ionicons name="checkmark-circle" size={13} color="#10B981" />
                  <Text style={styles.sideFeatureText}>Live Dynamic Trust Score System</Text>
                </View>
                <View style={styles.sideFeatureItem}>
                  <Ionicons name="checkmark-circle" size={13} color="#10B981" />
                  <Text style={styles.sideFeatureText}>Active Trip Telemetry & Tracking</Text>
                </View>
              </View>
            </View>

            <View style={[styles.sideCard, { marginTop: 16 }]}>
              <View style={styles.sideCardHeader}>
                <Ionicons name="phone-portrait" size={16} color="#818CF8" />
                <Text style={styles.sideCardTitle}>Mobile Responsive</Text>
              </View>
              <Text style={styles.sideCardDesc}>
                Opening this link on any smartphone or tablet automatically switches to 100% full-screen native mobile mode.
              </Text>
            </View>
          </View>
        )}

        {/* THE RESPONSIVE PHONE / SCREEN FRAME */}
        <View
          style={[
            styles.deviceChassisWrapper,
            isFullWidthMode
              ? styles.deviceChassisFullWidth
              : {
                  width: targetDeviceWidth,
                  height: targetDeviceHeight,
                  borderRadius: showBezel ? 44 : 20,
                  borderWidth: showBezel ? 10 : 1,
                  borderColor: showBezel ? '#172033' : 'rgba(0, 242, 254, 0.25)',
                },
          ]}
        >
          {/* Real Smartphone Dynamic Island / Notch (Only if Bezel is enabled & not full width) */}
          {showBezel && !isFullWidthMode && (
            <View style={styles.dynamicIslandContainer}>
              <View style={styles.dynamicIslandPill}>
                <View style={styles.cameraLens} />
                <View style={styles.sensorDot} />
                <View style={styles.islandStatusDot} />
              </View>
            </View>
          )}

          {/* Simulated Mobile Status Bar Header (Only when framed on desktop) */}
          {showBezel && !isFullWidthMode && (
            <View style={styles.simulatedPhoneStatusBar}>
              <Text style={styles.statusBarTime}>{timeString}</Text>
              <View style={styles.statusBarIcons}>
                <Ionicons name="cellular" size={12} color="#FFFFFF" style={{ marginRight: 5 }} />
                <Ionicons name="wifi" size={12} color="#FFFFFF" style={{ marginRight: 5 }} />
                <Ionicons name="battery-full" size={13} color="#FFFFFF" />
              </View>
            </View>
          )}

          {/* INNER APPLICATION CONTAINER */}
          <View style={styles.innerAppContainer}>
            {children}
          </View>

          {/* Simulated Home Indicator Bar at the bottom of the phone */}
          {showBezel && !isFullWidthMode && (
            <View style={styles.simulatedHomeBarContainer}>
              <View style={styles.simulatedHomeBar} />
            </View>
          )}
        </View>

        {/* Right Side Quick Specs Panel (Only on wide desktop screens > 1300px) */}
        {windowWidth > 1300 && !isFullWidthMode && (
          <View style={styles.sideInfoPanel}>
            <View style={styles.sideCard}>
              <View style={styles.sideCardHeader}>
                <Ionicons name="hardware-chip-outline" size={16} color={COLORS.cyan} />
                <Text style={styles.sideCardTitle}>Active Viewport</Text>
              </View>
              
              <View style={styles.specMetricRow}>
                <Text style={styles.specMetricLabel}>Device Preset:</Text>
                <Text style={styles.specMetricValue}>{activePreset.name}</Text>
              </View>
              <View style={styles.specMetricRow}>
                <Text style={styles.specMetricLabel}>Width Ratio:</Text>
                <Text style={styles.specMetricValue}>{activePreset.width} px</Text>
              </View>
              <View style={styles.specMetricRow}>
                <Text style={styles.specMetricLabel}>Target Form:</Text>
                <Text style={styles.specMetricValue}>{activePreset.description}</Text>
              </View>
              <View style={styles.specMetricRow}>
                <Text style={styles.specMetricLabel}>Browser Window:</Text>
                <Text style={styles.specMetricValue}>{Math.round(windowWidth)} × {Math.round(windowHeight)}</Text>
              </View>

              <View style={styles.tipBox}>
                <Ionicons name="bulb-outline" size={13} color={COLORS.cyan} style={{ marginRight: 6 }} />
                <Text style={styles.tipText}>
                  Use the top preset buttons to test how cards, maps, and modals look across standard, large, and tablet screens.
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Native mobile full-screen container
  nativeMobileWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#050814',
  },

  // Desktop / Laptop outer backdrop
  desktopOuterBackdrop: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#030611',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  // Ambient lighting orbs
  ambientOrbLeft: {
    position: 'absolute',
    left: '10%',
    top: '25%',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(0, 242, 254, 0.04)',
    pointerEvents: 'none',
  },
  ambientOrbRight: {
    position: 'absolute',
    right: '8%',
    bottom: '20%',
    width: 440,
    height: 440,
    borderRadius: 220,
    backgroundColor: 'rgba(129, 140, 248, 0.05)',
    pointerEvents: 'none',
  },

  // Top Control Toolbar
  topControlToolbar: {
    height: 56,
    backgroundColor: 'rgba(7, 12, 28, 0.88)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 242, 254, 0.15)',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIconGrad: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.45)',
    letterSpacing: 0.3,
  },

  // Ratio Preset Buttons
  presetButtonsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 22, 44, 0.9)',
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  presetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
  },
  presetBtnActive: {
    backgroundColor: 'rgba(0, 242, 254, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.4)',
  },
  presetBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.55)',
  },
  presetBtnTextActive: {
    color: COLORS.cyan,
    fontWeight: '800',
  },

  // Toolbar right actions
  toolbarRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toolActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  toolActionBtnActive: {
    borderColor: 'rgba(0, 242, 254, 0.3)',
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
  },
  toolActionBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  specsBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.2)',
  },
  specsText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.cyan,
    letterSpacing: 0.3,
  },

  // Center Stage Container
  stageContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 28,
  },

  // Side Info Panels (Desktop only)
  sideInfoPanel: {
    width: 250,
    maxWidth: 270,
  },
  sideCard: {
    backgroundColor: 'rgba(8, 14, 30, 0.75)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  sideCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sideCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  sideCardDesc: {
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(255, 255, 255, 0.55)',
    marginBottom: 12,
  },
  sideFeatureList: {
    gap: 7,
  },
  sideFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  sideFeatureText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.75)',
  },
  specMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  specMetricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.45)',
  },
  specMetricValue: {
    fontSize: 10,
    fontWeight: '800',
    color: '#E2E8F0',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 242, 254, 0.06)',
    borderRadius: 10,
    padding: 9,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.15)',
  },
  tipText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },

  // Phone Device Chassis
  deviceChassisWrapper: {
    backgroundColor: '#050814',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 28,
    elevation: 20,
    alignSelf: 'center',
  },
  deviceChassisFullWidth: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    borderWidth: 0,
    shadowOpacity: 0,
  },

  // Real Dynamic Island / Notch
  dynamicIslandContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    pointerEvents: 'none',
  },
  dynamicIslandPill: {
    width: 110,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cameraLens: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#0D152A',
    borderWidth: 1.5,
    borderColor: '#1E293B',
  },
  sensorDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#0F172A',
  },
  islandStatusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10B981',
    opacity: 0.8,
  },

  // Simulated Phone Status Bar Header
  simulatedPhoneStatusBar: {
    height: 38,
    paddingTop: 8,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#050814',
    zIndex: 9998,
    pointerEvents: 'none',
  },
  statusBarTime: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  statusBarIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Inner application container
  innerAppContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#050814',
    position: 'relative',
    overflow: 'hidden',
  },

  // Simulated Home Indicator Bar at the bottom of the phone
  simulatedHomeBarContainer: {
    height: 18,
    backgroundColor: '#050814',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9998,
    pointerEvents: 'none',
  },
  simulatedHomeBar: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
});

export default ResponsiveContainer;
