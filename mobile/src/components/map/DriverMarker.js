import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { triggerHaptic } from '../../utils/haptics';

export const DriverMarker = ({
  driver,
  isSelected = false,
  onPress,
}) => {
  const isAvailable = driver.status !== 'OFFLINE' && driver.status !== 'BUSY';
  const isAIMatch = driver.isAIMatch || (driver.matchScore && driver.matchScore >= 92);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isAIMatch) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.25, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isAIMatch, pulseAnim]);

  const handlePress = () => {
    triggerHaptic('impactLight');
    if (onPress) onPress(driver);
  };

  const getStatusColor = () => {
    if (driver.status === 'BUSY') return '#F59E0B'; // Orange
    if (driver.status === 'OFFLINE') return '#6B7280'; // Gray
    return '#10B981'; // Green
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={[styles.touchWrap, isSelected && styles.touchWrapSelected]}
    >
      <View style={styles.container}>
        {/* AI Recommended Glowing Animated Ring */}
        {isAIMatch && (
          <Animated.View
            style={[
              styles.aiGlowingRing,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
        )}

        {/* Selected Highlight Ring */}
        {isSelected && <View style={styles.selectedRing} />}

        {/* Small Circular Driver Avatar */}
        <View
          style={[
            styles.avatarCircle,
            isAIMatch && styles.avatarAIMatch,
            isSelected && styles.avatarSelected,
          ]}
        >
          <Image
            source={{
              uri:
                driver.avatar ||
                driver.profileImage ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
            }}
            style={styles.avatarImg}
          />

          {/* Availability Indicator Dot */}
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        </View>

        {/* Compact Rating / AI Match Tag */}
        <View
          style={[
            styles.pillTag,
            isAIMatch && styles.pillTagAI,
            isSelected && styles.pillTagSelected,
          ]}
        >
          {isAIMatch ? (
            <View style={styles.aiRow}>
              <Ionicons name="sparkles" size={8} color={COLORS.cyan} />
              <Text style={styles.aiScoreText}>{driver.matchScore || 96}% MATCH</Text>
            </View>
          ) : (
            <Text style={styles.ratingText}>⭐ {driver.rating?.toFixed(1) || '4.8'}</Text>
          )}
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
  aiGlowingRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.cyan,
    backgroundColor: 'rgba(0, 242, 254, 0.2)',
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
  selectedRing: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#050814',
    overflow: 'visible',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarAIMatch: {
    borderColor: COLORS.cyan,
  },
  avatarSelected: {
    borderColor: '#FFFFFF',
    borderWidth: 2.5,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  statusDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#050814',
  },
  pillTag: {
    marginTop: 2,
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
  pillTagAI: {
    borderColor: COLORS.cyan,
    backgroundColor: 'rgba(6, 14, 30, 0.95)',
  },
  pillTagSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(0, 242, 254, 0.25)',
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  aiScoreText: {
    fontSize: 8,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.4,
  },
  ratingText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default DriverMarker;
