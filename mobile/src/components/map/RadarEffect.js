import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export const RadarEffect = ({
  isActive = false,
  userLocation,
}) => {
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const sweepRotate = useRef(new Animated.Value(0)).current;
  const badgeFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.timing(badgeFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.loop(
        Animated.timing(wave1, {
          toValue: 1,
          duration: 2800,
          useNativeDriver: true,
        })
      ).start();

      setTimeout(() => {
        Animated.loop(
          Animated.timing(wave2, {
            toValue: 1,
            duration: 2800,
            useNativeDriver: true,
          })
        ).start();
      }, 1400);

      Animated.loop(
        Animated.timing(sweepRotate, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      Animated.timing(badgeFade, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [badgeFade, isActive, sweepRotate, wave1, wave2]);

  if (!isActive) return null;

  const scale1 = wave1.interpolate({ inputRange: [0, 1], outputRange: [0.5, 3.2] });
  const opacity1 = wave1.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.8, 0.35, 0] });

  const scale2 = wave2.interpolate({ inputRange: [0, 1], outputRange: [0.5, 3.2] });
  const opacity2 = wave2.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.8, 0.35, 0] });

  const spin = sweepRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Expanding AI Radar Wave 1 */}
      <View style={styles.centerBox}>
        <Animated.View
          style={[
            styles.expandingRing,
            { transform: [{ scale: scale1 }], opacity: opacity1 },
          ]}
        />
        <Animated.View
          style={[
            styles.expandingRing,
            { transform: [{ scale: scale2 }], opacity: opacity2 },
          ]}
        />

        {/* 360° Soft Light Sweep Sector */}
        <Animated.View
          style={[
            styles.sweepPivot,
            { transform: [{ rotate: spin }] },
          ]}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0, 242, 254, 0.08)', 'rgba(0, 242, 254, 0.25)']}
            style={styles.sweepSector}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          />
        </Animated.View>
      </View>

      {/* Floating Telemetry Discovery Pill */}
      <Animated.View style={[styles.searchingPill, { opacity: badgeFade }]}>
        <Ionicons name="scan-outline" size={13} color={COLORS.cyan} />
        <Text style={styles.searchingText}>SEARCHING NEARBY MOBILITY UNITS...</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerBox: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandingRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: COLORS.cyan,
    backgroundColor: 'rgba(0, 242, 254, 0.06)',
  },
  sweepPivot: {
    position: 'absolute',
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sweepSector: {
    position: 'absolute',
    left: 140,
    width: 140,
    height: 28,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
  searchingPill: {
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(5, 8, 20, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  searchingText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1,
  },
});

export default RadarEffect;
