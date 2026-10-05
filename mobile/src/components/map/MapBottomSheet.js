import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import GlassCard from '../GlassCard';
import NeonButton from '../NeonButton';
import { triggerHaptic } from '../../utils/haptics';

export const MapBottomSheet = ({
  unit,
  onClose,
  onBook,
  onViewDetails,
}) => {
  const slideAnim = useRef(new Animated.Value(180)).current;

  useEffect(() => {
    if (unit) {
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 180,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [slideAnim, unit]);

  if (!unit) return null;

  const isDriver = unit.type === 'driver';
  const name = unit.name || 'Verified Partner';
  const rating = unit.rating || 4.8;
  const trips = unit.trips || unit.completedTrips || 128;
  const distanceKm = unit.distanceKm ? Number(unit.distanceKm).toFixed(1) : '1.6';
  const matchScore = unit.matchScore || unit.aiMatchScore || 96;
  const isAIMatch = unit.isAIMatch !== false;
  const priceDisplay = isDriver
    ? `₹${unit.dailyPrice || unit.pricing?.perDay || 800}/day`
    : `₹${unit.dailyPrice || unit.pricePerDay || 2400}/day`;

  const imageUri =
    unit.avatar ||
    unit.profileImage ||
    unit.image ||
    unit.carImage ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';

  return (
    <Animated.View
      style={[
        styles.sheetContainer,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <GlassCard style={styles.card} glowColor={COLORS.cyan}>
        {/* Drag Handle & Close */}
        <View style={styles.headerBar}>
          <View style={styles.dragPill} />
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => {
              triggerHaptic('impactLight');
              if (onClose) onClose();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={16} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>
        </View>

        {/* AI MATCH 96% Header */}
        <View style={styles.aiMatchHeaderRow}>
          <View style={styles.aiTag}>
            <Text style={styles.aiRobotEmoji}>🤖</Text>
            <Text style={styles.aiMatchLabel}>AI MATCH</Text>
          </View>
          <Text style={styles.aiPercentage}>{matchScore}%</Text>
        </View>

        {/* Driver / Partner Main Info */}
        <View style={styles.profileRow}>
          <Image source={{ uri: imageUri }} style={styles.avatar} />

          <View style={styles.profileTextCol}>
            <Text style={styles.partnerName} numberOfLines={1}>{name}</Text>
            
            {/* Meta Row: ⭐ 4.8 | 🚗 128 Trips | 📍 1.6 km away | ✓ Verified */}
            <View style={styles.statsRow}>
              <Text style={styles.statItem}>⭐ {rating}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.statItem}>🚗 {trips} Trips</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.statItem}>📍 {distanceKm} km</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>

            {/* Price Tag */}
            <Text style={styles.priceText}>{priceDisplay}</Text>
          </View>
        </View>

        {/* Action Buttons: [ VIEW DRIVER ] [ BOOK NOW ] */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.viewBtn}
            onPress={() => {
              triggerHaptic('impactLight');
              if (onViewDetails) onViewDetails(unit);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.viewBtnText}>VIEW DRIVER</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => {
              triggerHaptic('impactMedium');
              if (onBook) onBook(unit);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.bookBtnText}>BOOK NOW</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    zIndex: 50,
  },
  card: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: 'rgba(5, 8, 20, 0.88)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 254, 0.4)',
    borderRadius: 20,
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
  },
  headerBar: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 18,
    marginBottom: 4,
  },
  dragPill: {
    width: 34,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  aiMatchHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 10,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  aiRobotEmoji: {
    fontSize: 14,
  },
  aiMatchLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1.2,
  },
  aiPercentage: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.cyan,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: COLORS.cyan,
  },
  profileTextCol: {
    flex: 1,
    marginLeft: 12,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 2,
    gap: 4,
  },
  statItem: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  dot: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 10,
  },
  verifiedText: {
    fontSize: 10.5,
    color: COLORS.neonGreen,
    fontWeight: '800',
  },
  priceText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.neonGold,
    marginTop: 3,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  viewBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  bookBtn: {
    flex: 1.2,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  bookBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#050814',
    letterSpacing: 0.8,
  },
});

export default MapBottomSheet;
