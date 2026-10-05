import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import GlassCard from './GlassCard';
import RatingStars from './RatingStars';
import { triggerHaptic } from '../utils/haptics';

export const BookingCard = ({
  booking,
  onPress,
  onRatePress,
  onTrackPress,
  style,
}) => {
  if (!booking) return null;

  const isActive = ['confirmed', 'driver_arriving', 'driver_arrived', 'trip_started', 'in_progress'].includes(
    booking.status
  );
  const isCompleted = booking.status === 'trip_completed';

  const getStatusBadge = () => {
    switch (booking.status) {
      case 'confirmed':
        return { label: 'CONFIRMED', bg: 'rgba(245, 158, 11, 0.15)', text: COLORS.neonGold, icon: 'checkmark-circle' };
      case 'driver_arriving':
        return { label: 'DISPATCHED', bg: 'rgba(0, 242, 254, 0.15)', text: COLORS.cyan, icon: 'car-sport' };
      case 'driver_arrived':
        return { label: 'ARRIVED', bg: 'rgba(16, 185, 129, 0.15)', text: COLORS.neonGreen, icon: 'location' };
      case 'trip_started':
      case 'in_progress':
        return { label: 'IN TRANSIT', bg: 'rgba(129, 140, 248, 0.18)', text: COLORS.electricViolet, icon: 'speedometer' };
      case 'trip_completed':
        return { label: 'COMPLETED', bg: 'rgba(255, 255, 255, 0.08)', text: COLORS.textSecondary, icon: 'flag' };
      case 'cancelled':
        return { label: 'CANCELLED', bg: 'rgba(244, 63, 94, 0.15)', text: COLORS.neonPink, icon: 'close-circle' };
      default:
        return { label: booking.status.toUpperCase(), bg: 'rgba(255, 255, 255, 0.08)', text: COLORS.textSecondary, icon: 'ellipse' };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <GlassCard
      style={[styles.card, style]}
      glowColor={isActive ? COLORS.cyan : COLORS.electricViolet}
    >
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => onPress && onPress(booking)}
      >
        {/* Top Meta Bar */}
        <View style={styles.topRow}>
          <View style={styles.idWrap}>
            <Text style={styles.bookingId}>MISSION #{booking.bookingId || booking.id}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.dateText}>{booking.bookingDate || 'TODAY'}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg, borderColor: statusInfo.text }]}>
            <Ionicons name={statusInfo.icon} size={11} color={statusInfo.text} />
            <Text style={[styles.statusText, { color: statusInfo.text }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        {/* Target Details */}
        <View style={styles.targetRow}>
          <View style={styles.avatarWrap}>
            {booking.driver ? (
              <Image
                source={{ uri: booking.driver.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' }}
                style={styles.avatarImg}
              />
            ) : (
              <View style={styles.carAvatar}>
                <Ionicons name="car-sport" size={22} color={COLORS.cyan} />
              </View>
            )}
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.titleText}>
              {booking.serviceType === 'combo'
                ? `${booking.car?.name || 'Car'} + ${booking.driver?.name || 'Driver'}`
                : booking.driver
                ? booking.driver.name
                : booking.car?.name || 'Autonomous Vehicle'}
            </Text>
            <Text style={styles.typeText}>
              {booking.serviceType === 'driver' ? '👨✈️ Chauffeur Only' : booking.serviceType === 'car' ? '🚗 Vehicle Rental' : '🚘 Car + Chauffeur'}
            </Text>
          </View>

          <View style={styles.priceCol}>
            <Text style={styles.amount}>₹{booking.estimatedPrice}</Text>
            <Text style={styles.duration}>{booking.duration || 'Full Mission'}</Text>
          </View>
        </View>

        {/* Locations */}
        <View style={styles.locationContainer}>
          <View style={styles.locationItem}>
            <View style={[styles.locDot, { backgroundColor: COLORS.cyan }]} />
            <Text style={styles.locText} numberOfLines={1}>
              {booking.pickupLocation?.address || 'Pickup waypoint'}
            </Text>
          </View>
          <View style={styles.locLine} />
          <View style={styles.locationItem}>
            <Ionicons name="location" size={12} color={COLORS.neonPink} style={{ marginRight: 6 }} />
            <Text style={styles.locText} numberOfLines={1}>
              {booking.destination?.address || 'Destination terminal'}
            </Text>
          </View>
        </View>

        {/* Bottom Actions based on state */}
        <View style={styles.footer}>
          {isActive ? (
            <TouchableOpacity
              style={styles.trackBtn}
              onPress={() => {
                triggerHaptic('impactMedium');
                onTrackPress && onTrackPress(booking);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="navigate-circle" size={17} color="#050814" />
              <Text style={styles.trackBtnText}>ACCESS LIVE COMMAND CENTER</Text>
            </TouchableOpacity>
          ) : isCompleted ? (
            <View style={styles.completedFooterRow}>
              {booking.reviewSubmitted ? (
                <View style={styles.ratedRow}>
                  <Ionicons name="shield-checkmark" size={15} color={COLORS.cyan} />
                  <Text style={styles.ratedText}>AI TRUST MATRIX UPDATED</Text>
                  <RatingStars rating={booking.userRating || 5.0} size={12} showLabel={false} />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.rateBtn}
                  onPress={() => {
                    triggerHaptic('impactLight');
                    onRatePress && onRatePress(booking);
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="star" size={14} color="#FFFFFF" />
                  <Text style={styles.rateBtnText}>Rate Experience & Calibrate Trust</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  idWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingId: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1,
  },
  dot: {
    color: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 6,
  },
  dateText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.4)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  carAvatar: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
    marginLeft: 12,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  typeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.neonGold,
  },
  duration: {
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  locationContainer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  locLine: {
    width: 1.5,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginLeft: 2.5,
    marginVertical: 2,
  },
  locText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    flex: 1,
  },
  footer: {
    marginTop: 12,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cyan,
    paddingVertical: 10,
    borderRadius: SIZES.radiusMd,
    gap: 6,
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  trackBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#050814',
    letterSpacing: 1,
  },
  completedFooterRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 8,
  },
  ratedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratedText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.8,
  },
  rateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(129, 140, 248, 0.2)',
    borderWidth: 1,
    borderColor: COLORS.electricViolet,
    paddingVertical: 8,
    borderRadius: SIZES.radiusMd,
    gap: 6,
  },
  rateBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default BookingCard;
