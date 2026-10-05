import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export const UserLocationMarker = ({
  heading = 0,
  accuracy = 15,
  isDemo = false,
  showLabel = true,
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const pulse2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 2400,
        useNativeDriver: true,
      })
    ).start();

    const t = setTimeout(() => {
      Animated.loop(
        Animated.timing(pulse2Anim, {
          toValue: 1,
          duration: 2400,
          useNativeDriver: true,
        })
      ).start();
    }, 1200);

    return () => clearTimeout(t);
  }, [pulseAnim, pulse2Anim]);

  const scale1 = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 2.5],
  });
  const opacity1 = pulseAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.8, 0.35, 0],
  });

  const scale2 = pulse2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 2.5],
  });
  const opacity2 = pulse2Anim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.8, 0.35, 0],
  });

  return (
    <View style={styles.container}>
      {/* Accuracy Circle */}
      <View style={styles.accuracyCircle} />

      {/* Soft Blue / Cyan Pulse Waves */}
      <Animated.View
        style={[
          styles.pulseWave,
          {
            transform: [{ scale: scale1 }],
            opacity: opacity1,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.pulseWave,
          {
            transform: [{ scale: scale2 }],
            opacity: opacity2,
          },
        ]}
      />

      {/* Small Glowing Center Point */}
      <View style={styles.glowingCenter}>
        <View style={styles.coreDot}>
          <Ionicons
            name="navigate"
            size={12}
            color="#050814"
            style={{ transform: [{ rotate: `${heading || 0}deg` }] }}
          />
        </View>
      </View>

      {/* 📍 YOU Label Badge */}
      {showLabel && (
        <View style={styles.badgeWrap}>
          <Text style={styles.pinEmoji}>📍</Text>
          <Text style={styles.badgeText}>YOU</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  accuracyCircle: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.35)',
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
  },
  pulseWave: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cyan,
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
  },
  glowingCenter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 242, 254, 0.4)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
  },
  coreDot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeWrap: {
    position: 'absolute',
    top: -22,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 8, 20, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.45)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 8,
    gap: 3,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 6,
  },
  pinEmoji: {
    fontSize: 10,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
});

export default UserLocationMarker;
