import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/theme';

export const AnimatedRoute = ({
  startPixel,
  endPixel,
  intermediatePixels = [],
  color = COLORS.cyan,
  glowColor = 'rgba(0, 242, 254, 0.3)',
}) => {
  const dashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(dashAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      })
    ).start();
  }, [dashAnim]);

  if (!startPixel || !endPixel) return null;

  // Build sequential polyline segments
  const allPoints = [startPixel, ...intermediatePixels, endPixel];
  const segments = [];

  for (let i = 0; i < allPoints.length - 1; i++) {
    const p1 = allPoints[i];
    const p2 = allPoints[i + 1];

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    segments.push({
      key: `seg-${i}`,
      left: p1.x,
      top: p1.y,
      width: length,
      angle,
    });
  }

  const pulseOffset = dashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 24],
  });

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {segments.map((seg) => (
        <View
          key={seg.key}
          style={[
            styles.segmentOrigin,
            {
              left: seg.left,
              top: seg.top,
              width: seg.width,
              transform: [{ rotate: `${seg.angle}deg` }],
            },
          ]}
        >
          {/* Ambient Glow Line Underneath */}
          <View style={[styles.glowLine, { backgroundColor: glowColor }]} />

          {/* Primary Sharp High-Contrast Vector Line */}
          <LinearGradient
            colors={[COLORS.cyan, COLORS.electricViolet]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.mainLine}
          />

          {/* Moving Flow Particle */}
          <Animated.View
            style={[
              styles.flowParticle,
              {
                transform: [{ translateX: pulseOffset }],
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  segmentOrigin: {
    position: 'absolute',
    height: 4,
    transformOrigin: '0% 50%',
    justifyContent: 'center',
    zIndex: 5,
  },
  glowLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 8,
    borderRadius: 4,
    top: -2,
    opacity: 0.7,
  },
  mainLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 1.5,
  },
  flowParticle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    top: -1.5,
    shadowColor: COLORS.cyan,
    shadowOpacity: 1,
    shadowRadius: 5,
  },
});

export default AnimatedRoute;
