import React, { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import NeonButton from './NeonButton';
import GlassCard from './GlassCard';

export const LoadingState = ({ message = 'Synchronizing with Neural Mobility Grid...' }) => {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.spinnerWrap}>
        <ActivityIndicator size="large" color={COLORS.cyan} />
      </View>
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

export const EmptyState = ({
  icon = 'car-sport-outline',
  title = 'No Units Detected in Sector',
  subtitle = 'Recalibrate search radius or adjust telemetry filters to discover available mobility units.',
  buttonTitle,
  onButtonPress,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <GlassCard style={styles.emptyContainer} glowColor={COLORS.cyan}>
      <Animated.View
        style={[
          styles.iconCircle,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Ionicons name={icon} size={32} color={COLORS.cyan} />
      </Animated.View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
      {buttonTitle && (
        <NeonButton
          title={buttonTitle}
          onPress={onButtonPress}
          variant="cyan"
          style={{ marginTop: 18 }}
        />
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerWrap: {
    marginBottom: 14,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.cyan,
    letterSpacing: 0.8,
  },
  emptyContainer: {
    paddingVertical: 36,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 254, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default { LoadingState, EmptyState };
