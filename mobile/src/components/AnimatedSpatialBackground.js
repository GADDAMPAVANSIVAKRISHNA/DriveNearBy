import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export const AnimatedSpatialBackground = ({ children, style }) => {
  // Orb 1: Cyan neon floating orb
  const orb1X = useRef(new Animated.Value(0)).current;
  const orb1Y = useRef(new Animated.Value(0)).current;
  const orb1Scale = useRef(new Animated.Value(1)).current;

  // Orb 2: Electric violet floating orb
  const orb2X = useRef(new Animated.Value(0)).current;
  const orb2Y = useRef(new Animated.Value(0)).current;

  // Floating particles
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;

  // Grid breathing pulse
  const gridPulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // 1. Slow cosmic breathing for Cyan Orb
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(orb1X, { toValue: 30, duration: 8000, useNativeDriver: true }),
          Animated.timing(orb1Y, { toValue: -40, duration: 8000, useNativeDriver: true }),
          Animated.timing(orb1Scale, { toValue: 1.15, duration: 8000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(orb1X, { toValue: -25, duration: 9000, useNativeDriver: true }),
          Animated.timing(orb1Y, { toValue: 20, duration: 9000, useNativeDriver: true }),
          Animated.timing(orb1Scale, { toValue: 0.95, duration: 9000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(orb1X, { toValue: 0, duration: 7000, useNativeDriver: true }),
          Animated.timing(orb1Y, { toValue: 0, duration: 7000, useNativeDriver: true }),
          Animated.timing(orb1Scale, { toValue: 1, duration: 7000, useNativeDriver: true }),
        ]),
      ])
    ).start();

    // 2. Violet Orb counter-movement
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(orb2X, { toValue: -40, duration: 10000, useNativeDriver: true }),
          Animated.timing(orb2Y, { toValue: 50, duration: 10000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(orb2X, { toValue: 35, duration: 11000, useNativeDriver: true }),
          Animated.timing(orb2Y, { toValue: -30, duration: 11000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(orb2X, { toValue: 0, duration: 8000, useNativeDriver: true }),
          Animated.timing(orb2Y, { toValue: 0, duration: 8000, useNativeDriver: true }),
        ]),
      ])
    ).start();

    // 3. Floating particles vertical oscillation
    Animated.loop(
      Animated.sequence([
        Animated.timing(particle1, { toValue: 1, duration: 4000, useNativeDriver: true }),
        Animated.timing(particle1, { toValue: 0, duration: 4000, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(particle2, { toValue: 1, duration: 5500, useNativeDriver: true }),
        Animated.timing(particle2, { toValue: 0, duration: 5500, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(particle3, { toValue: 1, duration: 6500, useNativeDriver: true }),
        Animated.timing(particle3, { toValue: 0, duration: 6500, useNativeDriver: true }),
      ])
    ).start();

    // 4. Subtle grid lines breathing
    Animated.loop(
      Animated.sequence([
        Animated.timing(gridPulse, { toValue: 0.8, duration: 5000, useNativeDriver: true }),
        Animated.timing(gridPulse, { toValue: 0.4, duration: 5000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const p1Y = particle1.interpolate({ inputRange: [0, 1], outputRange: [0, -35] });
  const p1Opacity = particle1.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3, 0.9, 0.3] });

  const p2Y = particle2.interpolate({ inputRange: [0, 1], outputRange: [0, -45] });
  const p2Opacity = particle2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.2, 0.8, 0.2] });

  const p3Y = particle3.interpolate({ inputRange: [0, 1], outputRange: [0, -50] });

  const isBackdropOnly = !children;

  return (
    <View
      style={[
        isBackdropOnly ? styles.absoluteBackdrop : styles.container,
        style,
      ]}
      pointerEvents={isBackdropOnly ? 'none' : 'auto'}
    >
      {/* Base Space Backdrop */}
      <LinearGradient
        colors={['#040711', '#070D1F', '#050813']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Layer 1: Subtle perspective futuristic cyber-grid lines */}
      <Animated.View style={[styles.gridOverlay, { opacity: gridPulse }]}>
        <View style={styles.gridLineH1} />
        <View style={styles.gridLineH2} />
        <View style={styles.gridLineH3} />
        <View style={styles.gridLineV1} />
        <View style={styles.gridLineV2} />
      </Animated.View>

      {/* Layer 2: Neon Cyan Glowing Spatial Orb */}
      <Animated.View
        style={[
          styles.cyanOrb,
          {
            transform: [
              { translateX: orb1X },
              { translateY: orb1Y },
              { scale: orb1Scale },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(0, 242, 254, 0.22)', 'rgba(6, 182, 212, 0.08)', 'transparent']}
          style={styles.orbGradient}
          start={{ x: 0.2, y: 0.2 }}
          end={{ x: 0.8, y: 0.8 }}
        />
      </Animated.View>

      {/* Layer 3: Electric Violet Floating Spatial Orb */}
      <Animated.View
        style={[
          styles.violetOrb,
          {
            transform: [
              { translateX: orb2X },
              { translateY: orb2Y },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(129, 140, 248, 0.20)', 'rgba(79, 70, 229, 0.06)', 'transparent']}
          style={styles.orbGradient}
          start={{ x: 0.5, y: 0.2 }}
          end={{ x: 0.5, y: 0.9 }}
        />
      </Animated.View>

      {/* Layer 4: Micro Light Sparks */}
      <Animated.View
        style={[
          styles.particleDot,
          { top: '18%', left: '22%' },
          { transform: [{ translateY: p1Y }], opacity: p1Opacity },
        ]}
      />
      <Animated.View
        style={[
          styles.particleDotCyan,
          { top: '35%', right: '18%' },
          { transform: [{ translateY: p2Y }], opacity: p2Opacity },
        ]}
      />
      <Animated.View
        style={[
          styles.particleDot,
          { top: '65%', left: '15%' },
          { transform: [{ translateY: p3Y }] },
        ]}
      />
      <Animated.View
        style={[
          styles.particleDotCyan,
          { top: '82%', right: '28%' },
          { transform: [{ translateY: p1Y }], opacity: p1Opacity },
        ]}
      />

      {/* Content Mount Point */}
      {children ? <View style={styles.contentWrap}>{children}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#050814',
    position: 'relative',
    overflow: 'hidden',
  },
  absoluteBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#050814',
    overflow: 'hidden',
    zIndex: 0,
    pointerEvents: 'none',
  },
  contentWrap: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 10,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  gridLineH1: {
    position: 'absolute',
    top: '20%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 242, 254, 0.04)',
  },
  gridLineH2: {
    position: 'absolute',
    top: '55%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.04)',
  },
  gridLineH3: {
    position: 'absolute',
    top: '80%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 242, 254, 0.03)',
  },
  gridLineV1: {
    position: 'absolute',
    left: '28%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0, 242, 254, 0.03)',
  },
  gridLineV2: {
    position: 'absolute',
    left: '72%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.03)',
  },
  cyanOrb: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 280,
    height: 280,
    borderRadius: 140,
    pointerEvents: 'none',
  },
  violetOrb: {
    position: 'absolute',
    top: height * 0.45,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    pointerEvents: 'none',
  },
  orbGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  particleDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#818CF8',
    shadowColor: '#818CF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
    pointerEvents: 'none',
  },
  particleDotCyan: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#00F2FE',
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 5,
    pointerEvents: 'none',
  },
});

export default AnimatedSpatialBackground;
