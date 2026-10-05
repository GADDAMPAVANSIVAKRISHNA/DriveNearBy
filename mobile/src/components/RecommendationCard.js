import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import RatingStars from './RatingStars';
import TrustScoreBadge from './TrustScoreBadge';
import NeonButton from './NeonButton';
import { triggerHaptic } from '../utils/haptics';

export const RecommendationCard = ({
  item,
  type = 'driver',
  onPress,
  onBookPress,
  style,
}) => {
  if (!item) return null;

  const isDriver = type === 'driver';
  const name = item.name;
  const image = isDriver ? item.profileImage : item.carImage;
  const price = isDriver ? item.pricing?.perDay : item.pricePerDay;
  const matchPercent = item.aiMatchScore || 94;

  // Pulse & Rotation animations for AI ring
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(ringRotate, { toValue: 1, duration: 8000, useNativeDriver: true })
    ).start();
  }, []);

  const spin = ringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.cardContainer, style]}>
      {/* Background with Dark Glass & Subtle AI Neon Gradient */}
      <LinearGradient
        colors={['rgba(20, 27, 48, 0.90)', 'rgba(9, 14, 28, 0.96)']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
      />

      {/* Cyber Edge Lighting */}
      <View style={styles.topCyberLine} />

      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => {
          triggerHaptic('selection');
          onPress && onPress(item);
        }}
        style={styles.innerContent}
      >
        {/* Top Header Row with AI Hologram Badge */}
        <View style={styles.headerRow}>
          <View style={styles.aiTag}>
            <Ionicons name="sparkles" size={13} color={COLORS.cyan} />
            <Text style={styles.aiTagText}>SPATIAL AI MATCH ENGINE</Text>
          </View>
          <View style={styles.tierPill}>
            <Text style={styles.tierText}>TOP RECOMMENDATION</Text>
          </View>
        </View>

        {/* Hero Circular Percentage & Partner Info */}
        <View style={styles.heroRow}>
          {/* Circular Animated Match Percentage */}
          <View style={styles.circleOuterWrap}>
            <Animated.View
              style={[
                styles.rotatingDashedRing,
                { transform: [{ rotate: spin }] },
              ]}
            />
            <Animated.View
              style={[
                styles.scoreCircleCore,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text style={styles.scoreNumber}>{matchPercent}%</Text>
              <Text style={styles.scoreSubLabel}>MATCH</Text>
            </Animated.View>
          </View>

          {/* Partner Photo & Details */}
          <View style={styles.partnerInfoCol}>
            <View style={styles.avatarRow}>
              <Image source={{ uri: image }} style={styles.avatar} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.name} numberOfLines={1}>{name}</Text>
                <View style={styles.ratingRow}>
                  <RatingStars rating={item.rating || 4.8} size={13} />
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.tripsText}>{item.completedTrips || 140}+ trips</Text>
                </View>
                <Text style={styles.distText}>📍 {item.distanceKm || 1.6} km from your pin</Text>
              </View>
            </View>
          </View>
        </View>

        {/* "Why this match?" Sequential Factor Chips */}
        <View style={styles.whySection}>
          <Text style={styles.whyTitle}>WHY THIS AI MATCH?</Text>
          <View style={styles.chipsRow}>
            <View style={styles.factorChip}>
              <Ionicons name="checkmark-circle" size={12} color={COLORS.cyan} />
              <Text style={styles.chipText}>Close to you ({item.distanceKm || 1.6} km)</Text>
            </View>
            <View style={styles.factorChip}>
              <Ionicons name="checkmark-circle" size={12} color={COLORS.cyan} />
              <Text style={styles.chipText}>4.8★ Top rated</Text>
            </View>
            <View style={styles.factorChip}>
              <Ionicons name="checkmark-circle" size={12} color={COLORS.cyan} />
              <Text style={styles.chipText}>Instant availability</Text>
            </View>
            <View style={styles.factorChip}>
              <Ionicons name="checkmark-circle" size={12} color={COLORS.cyan} />
              <Text style={styles.chipText}>Police ID verified</Text>
            </View>
          </View>
        </View>

        {/* Price & Trust Row */}
        <View style={styles.footerRow}>
          <TrustScoreBadge
            score={item.trustScore || 94}
            size="small"
            entityName={name}
          />
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>ESTIMATED RATE</Text>
            <Text style={styles.priceValue}>
              ₹{price}
              <Text style={styles.priceUnit}> / day</Text>
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Futuristic Neon CTA Button */}
      <View style={styles.ctaWrapper}>
        <NeonButton
          title={isDriver ? 'Book AI Recommended Driver' : 'Rent AI Recommended Car'}
          icon="flash"
          variant="cyan"
          onPress={() => onBookPress && onBookPress(item)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: SIZES.radiusLg,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 254, 0.35)',
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.hover,
  },
  topCyberLine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: COLORS.cyan,
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
  },
  innerContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    gap: 5,
  },
  aiTagText: {
    color: COLORS.cyan,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  tierPill: {
    backgroundColor: 'rgba(129, 140, 248, 0.12)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.25)',
  },
  tierText: {
    color: COLORS.aiPurple,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  circleOuterWrap: {
    width: 82,
    height: 82,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rotatingDashedRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.cyan,
    borderStyle: 'dashed',
    opacity: 0.8,
  },
  scoreCircleCore: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#070D1F',
    borderWidth: 2,
    borderColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
  scoreNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  scoreSubLabel: {
    color: COLORS.cyan,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  partnerInfoCol: {
    flex: 1,
    marginLeft: 14,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: COLORS.cyan,
  },
  name: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  dot: {
    color: COLORS.textMuted,
    marginHorizontal: 4,
  },
  tripsText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  distText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 1,
  },
  whySection: {
    backgroundColor: 'rgba(10, 16, 32, 0.6)',
    borderRadius: SIZES.radiusMd,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 14,
  },
  whyTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  factorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    gap: 4,
  },
  chipText: {
    fontSize: 11,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  priceUnit: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  ctaWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default RecommendationCard;
