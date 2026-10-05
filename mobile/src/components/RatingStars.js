import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { triggerHaptic } from '../utils/haptics';

const AnimatedStar = ({ isSelected, size, color, onPress, interactive, index }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    triggerHaptic('impactLight');
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.4,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (onPress) onPress(index);
  };

  if (!interactive) {
    return (
      <Ionicons
        name={isSelected ? 'star' : 'star-outline'}
        size={size}
        color={isSelected ? color : 'rgba(255, 255, 255, 0.2)'}
        style={{ marginRight: 3 }}
      />
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={{ paddingHorizontal: 4, paddingVertical: 2 }}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          shadowColor: isSelected ? color : 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: isSelected ? 0.9 : 0,
          shadowRadius: 8,
          elevation: isSelected ? 4 : 0,
        }}
      >
        <Ionicons
          name={isSelected ? 'star' : 'star-outline'}
          size={size}
          color={isSelected ? color : 'rgba(255, 255, 255, 0.25)'}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export const RatingStars = ({
  rating = 0,
  maxStars = 5,
  size = 16,
  interactive = false,
  onRatingChange,
  showLabel = true,
  color = COLORS.neonGold || '#F59E0B',
}) => {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    const isSelected = rating >= i;
    stars.push(
      <AnimatedStar
        key={i}
        index={i}
        isSelected={isSelected}
        size={size}
        color={color}
        interactive={interactive}
        onPress={onRatingChange}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>{stars}</View>
      {showLabel && !interactive && (
        <Text style={[styles.ratingText, { fontSize: size * 0.85 }]}>
          {Number(rating).toFixed(1)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 6,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
});

export default RatingStars;
