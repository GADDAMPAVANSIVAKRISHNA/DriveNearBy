import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import AnimatedSpatialBackground from '../../components/AnimatedSpatialBackground';
import { useAuth } from '../../context/AuthContext';

export const SplashScreen = ({ navigation }) => {
  const { isLoading } = useAuth();

  const logoScale = useRef(new Animated.Value(0.7)).current;
  const pulseRing = useRef(new Animated.Value(1)).current;
  const fadeText = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(fadeText, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseRing, {
          toValue: 1.35,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseRing, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
      if (!isLoading) {
        navigation.replace('MainTabs');
      }
    }, 1600);

    return () => clearTimeout(timer);
  }, [isLoading, logoScale, pulseRing, fadeText]);

  return (
    <AnimatedSpatialBackground style={styles.container}>
      {/* Futuristic Hologram Logo */}
      <View style={styles.centerStage}>
        <View style={styles.ringWrapper}>
          <Animated.View
            style={[
              styles.radarRing,
              {
                transform: [{ scale: pulseRing }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.logoBox,
              {
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <Ionicons name="car-sport" size={46} color="#050814" />
            <View style={styles.aiChip}>
              <Ionicons name="sparkles" size={14} color="#FFFFFF" />
            </View>
          </Animated.View>
        </View>

        <Animated.View style={{ opacity: fadeText, alignItems: 'center' }}>
          <Text style={styles.superTitle}>AUTONOMOUS MOBILITY ORBIT</Text>
          <Text style={styles.brandTitle}>DriveNearby<Text style={{ color: COLORS.cyan }}>.AI</Text></Text>
          <Text style={styles.tagline}>Intelligent Drivers • Fleets • Real-Time Trust Matrix</Text>
        </Animated.View>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.loadingPulseBar}>
          <View style={styles.loadingDot} />
          <Text style={styles.loadingText}>CONNECTING TO NEURAL MOBILITY GRID</Text>
        </View>
      </View>
    </AnimatedSpatialBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050814',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  centerStage: {
    alignItems: 'center',
  },
  ringWrapper: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
    position: 'relative',
  },
  radarRing: {
    position: 'absolute',
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 254, 0.4)',
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 26,
    backgroundColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 12,
  },
  aiChip: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.electricViolet,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#050814',
  },
  superTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 2,
    marginBottom: 6,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
  },
  loadingPulseBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.cyan,
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  loadingText: {
    color: COLORS.cyan,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});

export default SplashScreen;
