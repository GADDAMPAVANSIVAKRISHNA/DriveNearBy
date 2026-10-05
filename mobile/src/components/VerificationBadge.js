import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

export const VerificationBadge = ({
  verified = true,
  label = 'Verified',
  size = 'small', // 'small' | 'large'
}) => {
  if (!verified) return null;

  const isSmall = size === 'small';

  return (
    <View style={[styles.badge, isSmall ? styles.smallBadge : styles.largeBadge]}>
      <Ionicons
        name="shield-checkmark"
        size={isSmall ? 12 : 16}
        color={COLORS.info}
        style={{ marginRight: 3 }}
      />
      <Text style={[styles.badgeText, isSmall ? styles.smallText : styles.largeText]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: SIZES.radiusFull,
  },
  smallBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  largeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: '#0369A1',
    fontWeight: '700',
  },
  smallText: {
    fontSize: 11,
  },
  largeText: {
    fontSize: 13,
  },
});

export default VerificationBadge;
