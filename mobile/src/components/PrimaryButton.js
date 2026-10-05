import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

export const PrimaryButton = ({
  title,
  onPress,
  icon,
  loading = false,
  disabled = false,
  variant = 'primary', // 'primary' | 'ai' | 'dark'
  style,
  textStyle,
}) => {
  const getBgColor = () => {
    if (disabled) return COLORS.cardBorder;
    if (variant === 'ai') return COLORS.aiPurple;
    if (variant === 'dark') return COLORS.secondary;
    return COLORS.primary;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor: getBgColor() },
        variant === 'ai' ? SHADOWS.aiGlow : SHADOWS.subtle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.textInverse} size="small" />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={COLORS.textInverse} style={styles.icon} />}
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export const SecondaryButton = ({
  title,
  onPress,
  icon,
  style,
  textStyle,
  color = COLORS.primary,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.outlineButton, { borderColor: color }, style]}
    >
      {icon && <Ionicons name={icon} size={16} color={color} style={styles.icon} />}
      <Text style={[styles.outlineText, { color }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: SIZES.radiusMd,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: COLORS.textInverse,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  outlineText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PrimaryButton;
