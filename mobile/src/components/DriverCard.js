import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import RatingStars from './RatingStars';
import VerificationBadge from './VerificationBadge';
import TrustScoreBadge from './TrustScoreBadge';
import NeonButton from './NeonButton';
import { triggerHaptic } from '../utils/haptics';

export const DriverCard = ({
  driver,
  onViewDetails,
  onBook,
  showFullActions = true,
  style,
}) => {
  if (!driver) return null;

  const isAIMatch = (driver.aiMatchScore || 85) >= 88;

  return (
    <View style={[styles.card, isAIMatch && styles.cardAIMatch, style]}>
      {/* Dark Translucent Glass Surface */}
      <LinearGradient
        colors={['rgba(18, 26, 46, 0.85)', 'rgba(8, 13, 26, 0.94)']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* AI Header Ribbon if high match */}
      {isAIMatch && (
        <View style={styles.aiRibbon}>
          <LinearGradient
            colors={['#00F2FE', '#4FACFE']}
            style={styles.aiRibbonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="sparkles" size={11} color="#050814" />
            <Text style={styles.aiRibbonText}>
              AI MATCH: {driver.aiMatchScore || 94}% • {driver.aiBadge || 'Recommended'}
            </Text>
          </LinearGradient>
        </View>
      )}

      <View style={styles.contentWrap}>
        {/* Profile Info Row */}
        <View style={styles.topRow}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: driver.profileImage }} style={styles.avatar} />
            <View style={styles.onlineDot} />
          </View>

          <View style={styles.infoCol}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>{driver.name}</Text>
              <VerificationBadge verified={driver.verified} />
            </View>

            <View style={styles.metricsRow}>
              <RatingStars rating={driver.rating} size={13} />
              <Text style={styles.dot}>•</Text>
              <Text style={styles.metaText}>{driver.completedTrips} trips</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.metaText}>📍 {driver.distanceKm} km</Text>
            </View>

            {/* Trust Score & Rate */}
            <View style={styles.trustScoreRow}>
              <TrustScoreBadge
                score={driver.trustScore || 92}
                entityName={driver.name}
                size="small"
              />
            </View>
          </View>
        </View>

        {/* Explainable AI Reason Tag */}
        {driver.aiRecommendationReason ? (
          <View style={styles.reasonBox}>
            <Text style={styles.reasonText} numberOfLines={2}>
              💡 {driver.aiRecommendationReason}
            </Text>
          </View>
        ) : null}

        {/* Price & Action Row */}
        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>DAILY CHAUFFEUR</Text>
            <Text style={styles.priceValue}>
              ₹{driver.pricing?.perDay || 800}
              <Text style={styles.priceUnit}> / day</Text>
            </Text>
          </View>

          {showFullActions && (
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  triggerHaptic('light');
                  onViewDetails && onViewDetails(driver);
                }}
                style={styles.detailsBtn}
              >
                <Text style={styles.detailsBtnText}>Details</Text>
              </TouchableOpacity>

              <NeonButton
                title="Book Driver"
                icon="flash"
                variant="cyan"
                size="small"
                onPress={() => onBook && onBook(driver)}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.card,
  },
  cardAIMatch: {
    borderColor: 'rgba(0, 242, 254, 0.35)',
    ...SHADOWS.hover,
  },
  aiRibbon: {
    width: '100%',
  },
  aiRibbonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    gap: 5,
  },
  aiRibbonText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#050814',
    letterSpacing: 0.5,
  },
  contentWrap: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.cyan,
    backgroundColor: '#070D1F',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: '#050814',
  },
  infoCol: {
    flex: 1,
    marginLeft: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    flexShrink: 1,
    marginRight: 6,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  dot: {
    color: COLORS.textMuted,
    marginHorizontal: 5,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  trustScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  reasonBox: {
    backgroundColor: 'rgba(10, 16, 32, 0.7)',
    padding: 8,
    borderRadius: SIZES.radiusSm,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  reasonText: {
    fontSize: 11,
    lineHeight: 15,
    color: '#CBD5E1',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  priceContainer: {
    justifyContent: 'center',
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
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailsBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    backgroundColor: 'rgba(30, 41, 69, 0.4)',
  },
  detailsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
});

export default DriverCard;
