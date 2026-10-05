import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import RatingStars from './RatingStars';
import VerificationBadge from './VerificationBadge';
import NeonButton from './NeonButton';
import { triggerHaptic } from '../utils/haptics';

export const CarCard = ({
  car,
  onViewDetails,
  onRent,
  showFullActions = true,
  style,
}) => {
  if (!car) return null;

  return (
    <View style={[styles.card, style]}>
      {/* Dark Glass Base */}
      <LinearGradient
        colors={['rgba(18, 26, 46, 0.85)', 'rgba(8, 13, 26, 0.94)']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Vehicle Hero Image */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: car.carImage }} style={styles.carImage} resizeMode="cover" />

        {/* Gradient Shadow Overlay */}
        <LinearGradient
          colors={['rgba(5, 8, 20, 0.6)', 'transparent', 'rgba(5, 8, 20, 0.9)']}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Top Badges */}
        <View style={styles.badgeOverlay}>
          <VerificationBadge verified={car.verified} />
          {car.aiMatchScore >= 90 && (
            <View style={styles.aiPill}>
              <Ionicons name="sparkles" size={11} color="#050814" />
              <Text style={styles.aiPillText}>{car.aiMatchScore}% AI MATCH</Text>
            </View>
          )}
        </View>

        {/* Category & Transmission Tag */}
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{car.category} • {car.transmission}</Text>
        </View>
      </View>

      {/* Vehicle Info */}
      <View style={styles.bodyWrap}>
        <View style={styles.titleRow}>
          <Text style={styles.carName}>{car.name}</Text>
          <RatingStars rating={car.rating} size={14} />
        </View>

        <View style={styles.specRow}>
          <View style={styles.specItem}>
            <Ionicons name="location" size={12} color={COLORS.cyan} />
            <Text style={styles.specText}>{car.distanceKm} km</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="flash-outline" size={12} color={COLORS.aiPurple} />
            <Text style={styles.specText}>{car.fuelType}</Text>
          </View>
          <View style={styles.specItem}>
            <Ionicons name="people-outline" size={12} color={COLORS.textSecondary} />
            <Text style={styles.specText}>{car.seats} Seats</Text>
          </View>
        </View>

        {car.aiRecommendationReason ? (
          <View style={styles.reasonBox}>
            <Text style={styles.reasonText} numberOfLines={2}>
              💡 {car.aiRecommendationReason}
            </Text>
          </View>
        ) : null}

        {/* Price & Action Row */}
        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>RENTAL RATE</Text>
            <Text style={styles.priceValue}>
              ₹{car.pricePerDay}
              <Text style={styles.priceUnit}> / day</Text>
            </Text>
          </View>

          {showFullActions && (
            <View style={styles.buttonsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  triggerHaptic('light');
                  onViewDetails && onViewDetails(car);
                }}
                style={styles.detailsBtn}
              >
                <Text style={styles.detailsBtnText}>Specs</Text>
              </TouchableOpacity>

              <NeonButton
                title="Rent Car"
                icon="key-outline"
                variant="cyan"
                size="small"
                onPress={() => onRent && onRent(car)}
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
  imageWrap: {
    width: '100%',
    height: 160,
    backgroundColor: '#0A0F1F',
    position: 'relative',
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  aiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cyan,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: SIZES.radiusFull,
    gap: 4,
  },
  aiPillText: {
    color: '#050814',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  categoryPill: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    backgroundColor: 'rgba(5, 8, 20, 0.85)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryText: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: '800',
  },
  bodyWrap: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  carName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  reasonBox: {
    backgroundColor: 'rgba(10, 16, 32, 0.7)',
    padding: 8,
    borderRadius: SIZES.radiusSm,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  reasonText: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 15,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default CarCard;
