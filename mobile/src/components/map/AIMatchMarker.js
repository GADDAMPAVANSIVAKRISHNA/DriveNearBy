import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { triggerHaptic } from '../../utils/haptics';

export const AIMatchMarker = ({
  unit,
  matchScore = 96,
  onPress,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.25, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 8000, useNativeDriver: true })
    ).start();
  }, [pulseAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => {
        triggerHaptic('impactLight');
        if (onPress) onPress(unit);
      }}
      style={styles.container}
    >
      {/* Rotating Cyber Ring */}
      <Animated.View
        style={[
          styles.rotatingRing,
          { transform: [{ rotate: spin }] },
        ]}
      />

      {/* Pulsing Aura */}
      <Animated.View
        style={[
          styles.pulsingAura,
          { transform: [{ scale: pulseAnim }] },
        ]}
      />

      {/* Core Score Badge */}
      <View style={styles.coreBadge}>
        <Ionicons name="sparkles" size={10} color={COLORS.cyan} style={{ marginBottom: 1 }} />
        <Text style={styles.scoreText}>{matchScore}%</Text>
      </View>

      {/* Floating Tag */}
      <View style={styles.tagPill}>
        <Text style={styles.tagText}>TOP AI MATCH</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    position: 'relative',
    zIndex: 25,
  },
  rotatingRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.cyan,
  },
  pulsingAura: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
  },
  coreBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(5, 8, 20, 0.95)',
    borderWidth: 1.5,
    borderColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  scoreText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.cyan,
  },
  tagPill: {
    position: 'absolute',
    bottom: -16,
    backgroundColor: 'rgba(8, 14, 34, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.5)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
});

export default AIMatchMarker;
