import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

export const GlassCard = ({
  children,
  style,
  glowColor = null, // 'cyan' | 'violet' | 'pink'
  variant = 'default', // 'default' | 'surface' | 'highlight'
}) => {
  const getGradientColors = () => {
    if (variant === 'highlight') {
      return ['rgba(28, 39, 68, 0.88)', 'rgba(14, 21, 38, 0.95)'];
    }
    if (variant === 'surface') {
      return ['rgba(20, 28, 48, 0.72)', 'rgba(10, 16, 30, 0.85)'];
    }
    return ['rgba(16, 24, 44, 0.80)', 'rgba(9, 14, 26, 0.92)'];
  };

  const getBorderColor = () => {
    if (glowColor === 'cyan') return 'rgba(0, 242, 254, 0.35)';
    if (glowColor === 'violet') return 'rgba(129, 140, 248, 0.35)';
    if (glowColor === 'pink') return 'rgba(244, 63, 94, 0.35)';
    return COLORS.cardBorder;
  };

  const getGlowShadow = () => {
    if (glowColor === 'cyan') return SHADOWS.cyanGlow;
    if (glowColor === 'violet') return SHADOWS.aiGlow;
    return SHADOWS.card;
  };

  return (
    <View style={[styles.outerContainer, getGlowShadow(), { borderColor: getBorderColor() }, style]}>
      <LinearGradient
        colors={getGradientColors()}
        style={styles.innerGradient}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
      >
        {/* Subtle top edge specular highlight reflection */}
        <View style={styles.topHighlightLine} />
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: SIZES.radiusLg,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  innerGradient: {
    padding: 16,
    width: '100%',
    position: 'relative',
  },
  topHighlightLine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});

export default GlassCard;
