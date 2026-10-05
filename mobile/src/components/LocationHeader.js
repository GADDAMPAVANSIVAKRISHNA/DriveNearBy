import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { triggerHaptic } from '../utils/haptics';

export const LocationHeader = ({ onProfilePress, onLocationPress }) => {
  const { user } = useAuth();
  const { location, refreshLocation, isLoadingLocation } = useLocation();

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Compute futuristic time greeting
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'GOOD MORNING';
    if (hours < 18) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  const userName = user?.name?.split(' ')[0]?.toUpperCase() || 'DINESH';

  return (
    <View style={styles.container}>
      {/* Top Telemetry Header */}
      <View style={styles.topRow}>
        <View style={styles.greetingWrap}>
          <Text style={styles.greetingSub}>DRIVENEARBY AI • MOBILITY NETWORK</Text>
          <Text style={styles.greetingName}>
            {getGreeting()}, {userName}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            triggerHaptic('light');
            onProfilePress && onProfilePress();
          }}
          style={styles.avatarButton}
        >
          <Image
            source={{
              uri:
                user?.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.avatarGlowDot} />
        </TouchableOpacity>
      </View>

      {/* GPS Location Bar with Holographic Pulse */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          triggerHaptic('selection');
          onLocationPress ? onLocationPress() : refreshLocation();
        }}
        style={styles.locationBar}
      >
        <View style={styles.gpsPulseWrap}>
          <Animated.View
            style={[
              styles.gpsPulseRing,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          <View style={styles.gpsPulseDot}>
            <Ionicons name="location" size={13} color="#050814" />
          </View>
        </View>

        <View style={styles.locationTextWrap}>
          <Text style={styles.locationLabel}>DETECTED GPS COORDINATES</Text>
          <Text style={styles.locationAddress} numberOfLines={1}>
            {isLoadingLocation
              ? 'Synchronizing GPS satellite telemetry...'
              : location?.address || 'Indiranagar 100ft Road, Bengaluru'}
          </Text>
        </View>

        <View style={styles.gpsRefreshWrap}>
          <Ionicons
            name={isLoadingLocation ? 'sync' : 'scan-outline'}
            size={16}
            color={COLORS.cyan}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(5, 8, 20, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  greetingWrap: {
    flex: 1,
  },
  greetingSub: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.cyan,
    letterSpacing: 0.8,
  },
  greetingName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
    letterSpacing: -0.2,
  },
  avatarButton: {
    position: 'relative',
    padding: 2,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: COLORS.cyan,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarGlowDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.cyan,
    borderWidth: 2,
    borderColor: '#050814',
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 21, 37, 0.75)',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
  },
  gpsPulseWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 10,
  },
  gpsPulseRing: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0, 242, 254, 0.25)',
  },
  gpsPulseDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTextWrap: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  locationAddress: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 1,
  },
  gpsRefreshWrap: {
    padding: 6,
  },
});

export default LocationHeader;
