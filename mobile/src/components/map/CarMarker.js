import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { triggerHaptic } from '../../utils/haptics';

export const CarMarker = ({
  car,
  isSelected = false,
  onPress,
}) => {
  const isAvailable = car.status !== 'UNAVAILABLE' && car.status !== 'BOOKED';
  const shortModel = (car.name || car.model || 'Car').split(' ')[0];
  const rating = car.rating ? car.rating.toFixed(1) : '4.8';

  const handlePress = () => {
    triggerHaptic('impactLight');
    if (onPress) onPress(car);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={[styles.touchWrap, isSelected && styles.touchWrapSelected]}
    >
      <View style={styles.container}>
        {/* Selected Halo */}
        {isSelected && <View style={styles.selectedGlow} />}

        {/* Custom Vehicle Badge */}
        <View style={[styles.carBadge, isSelected && styles.carBadgeSelected]}>
          <Ionicons
            name="car-sport"
            size={14}
            color={isSelected ? '#050814' : COLORS.cyan}
          />
          {/* Availability Dot */}
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isAvailable ? '#10B981' : '#F59E0B' },
            ]}
          />
        </View>

        {/* Model & Rating Pill: e.g. Creta ⭐4.8 */}
        <View style={[styles.namePill, isSelected && styles.namePillSelected]}>
          <Text style={styles.modelText} numberOfLines={1}>{shortModel}</Text>
          <Text style={styles.ratingText}>⭐{rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchWrapSelected: {
    zIndex: 50,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  carBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0A1224',
    borderWidth: 1.5,
    borderColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  carBadgeSelected: {
    backgroundColor: COLORS.cyan,
    borderColor: '#FFFFFF',
    borderWidth: 2,
  },
  statusDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1,
    borderColor: '#050814',
  },
  namePill: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(5, 8, 20, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  namePillSelected: {
    borderColor: COLORS.cyan,
    backgroundColor: 'rgba(0, 242, 254, 0.2)',
  },
  modelText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  ratingText: {
    fontSize: 7.5,
    fontWeight: '800',
    color: COLORS.neonGold,
  },
});

export default CarMarker;
