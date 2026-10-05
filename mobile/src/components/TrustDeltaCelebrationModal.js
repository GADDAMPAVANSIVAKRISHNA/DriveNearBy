import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import NeonButton from './NeonButton';
import { triggerHaptic } from '../utils/haptics';

export const TrustDeltaCelebrationModal = ({
  visible,
  trustDelta,
  onClose,
}) => {
  const pulseGlow = useRef(new Animated.Value(1)).current;
  const rotateHalo = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && trustDelta) {
      triggerHaptic('success');
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseGlow, { toValue: 1.12, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseGlow, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(rotateHalo, { toValue: 1, duration: 6000, useNativeDriver: true })
      ).start();
    }
  }, [pulseGlow, rotateHalo, trustDelta, visible]);

  if (!trustDelta || !visible) return null;

  const {
    previousRating = 4.8,
    newRating = 4.9,
    previousTrips = 142,
    newTrips = 143,
    previousTrustScore = 94,
    newTrustScore = 95,
  } = trustDelta;

  const haloSpin = rotateHalo.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <LinearGradient
            colors={['rgba(24, 32, 60, 0.96)', 'rgba(8, 12, 26, 0.98)']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.cardRim} />

          {/* Holographic Glowing Trophy Halo */}
          <View style={styles.haloOuterWrap}>
            <Animated.View
              style={[
                styles.dashedHalo,
                { transform: [{ rotate: haloSpin }] },
              ]}
            />
            <Animated.View
              style={[
                styles.coreTrophyWrap,
                { transform: [{ scale: pulseGlow }] },
              ]}
            >
              <Ionicons name="trophy" size={32} color="#050814" />
            </Animated.View>
          </View>

          <Text style={styles.title}>TRUST MATRIX UPDATED</Text>
          <Text style={styles.subtitle}>
            Your multi-criteria review has just updated the live AI ranking graph & driver trust index.
          </Text>

          {/* Telemetry Comparison Box */}
          <View style={styles.deltaBox}>
            {/* Trust Score Hero Number */}
            <View style={styles.statHeroRow}>
              <View style={styles.statHeroBox}>
                <Text style={styles.statHeroLabel}>PREVIOUS TRUST</Text>
                <Text style={styles.statHeroValOld}>{previousTrustScore}</Text>
              </View>

              <Ionicons name="arrow-forward" size={20} color={COLORS.cyan} />

              <View style={styles.statHeroBox}>
                <Text style={[styles.statHeroLabel, { color: COLORS.cyan }]}>UPDATED TRUST</Text>
                <Text style={styles.statHeroValNew}>{newTrustScore}/100</Text>
              </View>
            </View>

            {/* Other Stats */}
            <View style={styles.subStatsRow}>
              <View style={styles.subStatItem}>
                <Text style={styles.subStatLabel}>Rating</Text>
                <Text style={styles.subStatVal}>
                  {previousRating}★ ➔ <Text style={{ color: COLORS.accent }}>{newRating}★</Text>
                </Text>
              </View>
              <View style={styles.subStatDivider} />
              <View style={styles.subStatItem}>
                <Text style={styles.subStatLabel}>Verified Trips</Text>
                <Text style={styles.subStatVal}>
                  {previousTrips} ➔ <Text style={{ color: COLORS.cyan }}>{newTrips}</Text>
                </Text>
              </View>
            </View>

            {/* AI Feedback Impact Note */}
            <View style={styles.impactNote}>
              <Ionicons name="sparkles" size={13} color={COLORS.cyan} />
              <Text style={styles.impactNoteText}>
                Future riders searching in this area will see updated AI match priority based on your authentic trip experience.
              </Text>
            </View>
          </View>

          <NeonButton
            title="Done & View Updated Ranking"
            variant="cyan"
            onPress={onClose}
            style={{ width: '100%' }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 5, 12, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    borderRadius: SIZES.radiusLg,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 254, 0.4)',
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.hover,
  },
  cardRim: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: COLORS.cyan,
  },
  haloOuterWrap: {
    width: 84,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 14,
  },
  dashedHalo: {
    position: 'absolute',
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2,
    borderColor: COLORS.cyan,
    borderStyle: 'dashed',
    opacity: 0.8,
  },
  coreTrophyWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 14,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 4,
    marginBottom: 16,
  },
  deltaBox: {
    width: '100%',
    backgroundColor: 'rgba(10, 16, 32, 0.75)',
    borderRadius: SIZES.radiusMd,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  statHeroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  statHeroBox: {
    alignItems: 'center',
  },
  statHeroLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  statHeroValOld: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  statHeroValNew: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.cyan,
    marginTop: 2,
  },
  subStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  subStatItem: {
    alignItems: 'center',
  },
  subStatLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  subStatVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  subStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  impactNote: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
    borderRadius: 6,
    padding: 8,
    gap: 6,
    alignItems: 'center',
  },
  impactNoteText: {
    flex: 1,
    fontSize: 10,
    color: '#BAE6FD',
    lineHeight: 14,
  },
});

export default TrustDeltaCelebrationModal;
