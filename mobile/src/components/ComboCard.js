import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import NeonButton from './NeonButton';
import { triggerHaptic } from '../utils/haptics';

export const ComboCard = ({ combo, onBook, style }) => {
  if (!combo) return null;
  const { driver, car, comboPricePerDay, distanceKm, matchScore, badge, aiRecommendationReason } = combo;

  return (
    <View style={[styles.card, style]}>
      {/* Dark Glass Base */}
      <LinearGradient
        colors={['rgba(24, 30, 56, 0.90)', 'rgba(10, 15, 30, 0.96)']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Cyber Violet Edge */}
      <View style={styles.topEdgeGlow} />

      {/* Top Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.badgeRow}>
          <Ionicons name="sparkles" size={13} color="#FFFFFF" />
          <Text style={styles.badgeText}>{badge || 'AI ALL-IN-ONE COMBO'}</Text>
        </View>
        <Text style={styles.matchScoreText}>{matchScore}% SYNERGY</Text>
      </View>

      <View style={styles.body}>
        {/* Title */}
        <Text style={styles.titleText}>
          {car?.name} + {driver?.name}
        </Text>

        {/* Dual Avatars Telemetry */}
        <View style={styles.dualMediaRow}>
          <View style={styles.carImgWrap}>
            <Image source={{ uri: car?.carImage }} style={styles.carImg} />
            <Text style={styles.itemTag}>VEHICLE</Text>
          </View>

          <View style={styles.connectorWrap}>
            <View style={styles.connectorLine} />
            <View style={styles.plusIconWrap}>
              <Ionicons name="add" size={14} color={COLORS.cyan} />
            </View>
            <View style={styles.connectorLine} />
          </View>

          <View style={styles.driverImgWrap}>
            <Image source={{ uri: driver?.profileImage }} style={styles.driverImg} />
            <Text style={styles.itemTag}>CHAUFFEUR</Text>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>CAR RATING</Text>
            <Text style={styles.metricValue}>⭐ {car?.rating || 4.8}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>DRIVER TRUST</Text>
            <Text style={[styles.metricValue, { color: COLORS.cyan }]}>
              {driver?.trustScore || 94}/100
            </Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>PROXIMITY</Text>
            <Text style={styles.metricValue}>📍 {distanceKm || 2.1} km</Text>
          </View>
        </View>

        {aiRecommendationReason && (
          <View style={styles.reasonBox}>
            <Text style={styles.reasonText}>💡 {aiRecommendationReason}</Text>
          </View>
        )}

        {/* Footer with Price and Book Combo CTA */}
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.priceLabel}>ALL-INCLUSIVE COMBO</Text>
            <Text style={styles.priceVal}>
              ₹{comboPricePerDay}
              <Text style={styles.priceUnit}> / day</Text>
            </Text>
          </View>

          <NeonButton
            title="Book Combo"
            icon="car-sport"
            variant="ai"
            size="small"
            onPress={() => onBook && onBook(combo)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.radiusLg,
    borderWidth: 1.5,
    borderColor: 'rgba(129, 140, 248, 0.35)',
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.aiGlow,
  },
  topEdgeGlow: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: COLORS.aiPurple,
  },
  headerBanner: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  matchScoreText: {
    color: COLORS.cyan,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  body: {
    padding: 16,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  dualMediaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  carImgWrap: {
    alignItems: 'center',
  },
  carImg: {
    width: 95,
    height: 56,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  connectorWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  connectorLine: {
    width: 14,
    height: 1,
    backgroundColor: 'rgba(0, 242, 254, 0.3)',
  },
  plusIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverImgWrap: {
    alignItems: 'center',
  },
  driverImg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.aiPurple,
  },
  itemTag: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  metricsGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10, 16, 32, 0.65)',
    borderRadius: SIZES.radiusMd,
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  metricDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  reasonBox: {
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    padding: 8,
    borderRadius: SIZES.radiusSm,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.25)',
  },
  reasonText: {
    fontSize: 11,
    color: '#C7D2FE',
    lineHeight: 15,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  priceLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  priceVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  priceUnit: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});

export default ComboCard;
