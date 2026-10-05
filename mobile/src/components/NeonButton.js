import React, { useRef } from 'react';
import {
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { triggerHaptic } from '../utils/haptics';

export const NeonButton = ({
  title,
  onPress,
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  variant = 'cyan', // 'cyan' | 'ai' | 'ghost' | 'emerald' | 'danger'
  style,
  textStyle,
  size = 'medium', // 'small' | 'medium' | 'large'
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled || loading) return;
    triggerHaptic('light');
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  const getGradientColors = () => {
    if (disabled) return ['#1E293B', '#0F172A'];
    switch (variant) {
      case 'cyan':
        return ['#00F2FE', '#0284C7'];
      case 'ai':
        return ['#818CF8', '#6366F1', '#EC4899'];
      case 'emerald':
        return ['#10B981', '#059669'];
      case 'danger':
        return ['#F43F5E', '#BE123C'];
      case 'ghost':
      default:
        return ['rgba(30, 41, 69, 0.6)', 'rgba(15, 23, 42, 0.8)'];
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.textMuted;
    if (variant === 'cyan') return '#050814'; // Dark text on bright cyan looks ultra-sharp
    return '#FFFFFF';
  };

  const getGlow = () => {
    if (disabled) return {};
    if (variant === 'cyan') return SHADOWS.cyanGlow;
    if (variant === 'ai') return SHADOWS.aiGlow;
    return SHADOWS.subtle;
  };

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Animated.View
        style={[
          styles.buttonWrapper,
          getGlow(),
          { transform: [{ scale: scaleAnim }] },
          variant === 'ghost' && styles.ghostBorder,
          style,
        ]}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            isSmall && styles.smallBtn,
            isLarge && styles.largeBtn,
          ]}
        >
          {loading ? (
            <ActivityIndicator color={getTextColor()} size="small" />
          ) : (
            <View style={styles.contentRow}>
              {icon && iconPosition === 'left' && (
                <Ionicons
                  name={icon}
                  size={isSmall ? 14 : 17}
                  color={getTextColor()}
                  style={{ marginRight: 6 }}
                />
              )}
              <Text
                style={[
                  styles.btnText,
                  { color: getTextColor() },
                  isSmall && styles.smallText,
                  isLarge && styles.largeText,
                  textStyle,
                ]}
              >
                {title}
              </Text>
              {icon && iconPosition === 'right' && (
                <Ionicons
                  name={icon}
                  size={isSmall ? 14 : 17}
                  color={getTextColor()}
                  style={{ marginLeft: 6 }}
                />
              )}
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
  },
  ghostBorder: {
    borderWidth: 1.2,
    borderColor: 'rgba(0, 242, 254, 0.45)',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: SIZES.radiusMd,
  },
  smallBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusSm,
  },
  largeBtn: {
    paddingVertical: 16,
    paddingHorizontal: 26,
    borderRadius: SIZES.radiusLg,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  smallText: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  largeText: {
    fontSize: 16,
    letterSpacing: 0.8,
  },
});

export default NeonButton;
