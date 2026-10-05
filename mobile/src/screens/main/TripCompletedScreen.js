import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import AnimatedSpatialBackground from '../../components/AnimatedSpatialBackground';
import GlassCard from '../../components/GlassCard';
import NeonButton from '../../components/NeonButton';
import { triggerHaptic } from '../../utils/haptics';

export const TripCompletedScreen = ({ route, navigation }) => {
  const booking = route.params?.booking || {
    id: 'DN-829140',
    bookingId: 'DN-829140',
    serviceType: 'driver',
    driver: {
      name: 'Ravi Kumar',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    pickupLocation: { address: 'Indiranagar 100ft Rd, Bengaluru' },
    destination: { address: 'Kempegowda Int. Airport (BLR)' },
    estimatedPrice: 850,
    tripMetrics: { distanceKm: 34.2, durationMinutes: 48 },
  };

  const partner = booking.driver || booking.car || { name: 'Ravi Kumar' };

  // Animations
  const checkScale = useRef(new Animated.Value(0)).current;
  const glowRing = useRef(new Animated.Value(0.8)).current;
  const contentFade = useRef(new Animated.Value(0)).current;

  // Count-up display numbers
  const [displayDist, setDisplayDist] = useState(0);
  const [displayDuration, setDisplayDuration] = useState(0);
  const [displayFare, setDisplayFare] = useState(0);

  useEffect(() => {
    triggerHaptic('notificationSuccess');

    Animated.parallel([
      Animated.spring(checkScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 600,
        delay: 250,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowRing, {
          toValue: 1.25,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glowRing, {
          toValue: 0.9,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Numerical Count-up simulation
    const targetDist = booking.tripMetrics?.distanceKm || 34.2;
    const targetDuration = booking.tripMetrics?.durationMinutes || 48;
    const targetFare = booking.estimatedPrice || 850;

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const progress = Math.min(step / 20, 1);
      setDisplayDist(parseFloat((targetDist * progress).toFixed(1)));
      setDisplayDuration(Math.round(targetDuration * progress));
      setDisplayFare(Math.round(targetFare * progress));

      if (progress >= 1) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [checkScale, contentFade, glowRing, booking]);

  return (
    <View style={styles.container}>
      <AnimatedSpatialBackground />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Cinematic Completion Halo */}
          <View style={styles.heroSection}>
            <View style={styles.badgeWrapper}>
              <Animated.View
                style={[
                  styles.glowHalo,
                  {
                    transform: [{ scale: glowRing }],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.checkBadge,
                  {
                    transform: [{ scale: checkScale }],
                  },
                ]}
              >
                <Ionicons name="checkmark-sharp" size={48} color="#050814" />
              </Animated.View>
            </View>

            <Text style={styles.superTitle}>MISSION ACCOMPLISHED</Text>
            <Text style={styles.mainTitle}>TRIP COMPLETED</Text>
            <Text style={styles.bookingId}>TRANSACTION REF #{booking.bookingId || booking.id}</Text>
          </View>

          {/* Animated Metrics HUD Grid */}
          <Animated.View style={{ opacity: contentFade }}>
            <GlassCard style={styles.metricsCard} glowColor={COLORS.cyan}>
              <Text style={styles.cardHeader}>MISSION TELEMETRY METRICS</Text>

              <View style={styles.metricsRow}>
                <View style={styles.metricColumn}>
                  <Ionicons name="speedometer-outline" size={20} color={COLORS.cyan} />
                  <Text style={styles.metricValue}>{displayDist}</Text>
                  <Text style={styles.metricUnit}>KILOMETERS</Text>
                </View>

                <View style={styles.metricDivider} />

                <View style={styles.metricColumn}>
                  <Ionicons name="time-outline" size={20} color={COLORS.electricViolet} />
                  <Text style={styles.metricValue}>{displayDuration}</Text>
                  <Text style={styles.metricUnit}>MINUTES</Text>
                </View>

                <View style={styles.metricDivider} />

                <View style={styles.metricColumn}>
                  <Ionicons name="wallet-outline" size={20} color={COLORS.neonGold} />
                  <Text style={[styles.metricValue, { color: COLORS.neonGold }]}>₹{displayFare}</Text>
                  <Text style={styles.metricUnit}>TOTAL FARE</Text>
                </View>
              </View>
            </GlassCard>

            {/* Partner & Route Summary GlassCard */}
            <GlassCard style={styles.summaryCard}>
              <View style={styles.partnerRow}>
                <Image
                  source={{
                    uri:
                      partner.profileImage ||
                      booking.car?.carImage ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                  }}
                  style={styles.avatar}
                />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.partnerName}>{partner.name}</Text>
                  <Text style={styles.partnerRole}>
                    {booking.serviceType === 'combo'
                      ? `Synergy Package: ${booking.car?.name || 'Vehicle'} + Driver`
                      : booking.serviceType === 'driver'
                      ? 'Elite Chauffeur Pilot'
                      : 'Verified Autonomous Fleet'}
                  </Text>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>SETTLED</Text>
                </View>
              </View>

              {/* Trajectory */}
              <View style={styles.routeBox}>
                <View style={styles.routeItem}>
                  <View style={styles.dotOrigin} />
                  <Text style={styles.routeText} numberOfLines={1}>
                    {booking.pickupLocation?.address}
                  </Text>
                </View>
                <View style={styles.routeRail} />
                <View style={styles.routeItem}>
                  <Ionicons name="location" size={14} color={COLORS.neonPink} style={{ marginRight: 8 }} />
                  <Text style={styles.routeText} numberOfLines={1}>
                    {booking.destination?.address}
                  </Text>
                </View>
              </View>
            </GlassCard>

            {/* Primary Action Button */}
            <View style={styles.actionContainer}>
              <NeonButton
                title="RATE YOUR EXPERIENCE"
                icon="star"
                variant="primary"
                onPress={() => {
                  triggerHaptic('impactMedium');
                  navigation.replace('RatingReview', { booking });
                }}
                style={{ marginBottom: 14 }}
              />

              <TouchableOpacity
                onPress={() => navigation.navigate('MainTabs')}
                style={styles.returnBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.returnText}>RETURN TO ORBIT HUD</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'stretch',
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  badgeWrapper: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  glowHalo: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(0, 242, 254, 0.22)',
    borderWidth: 2,
    borderColor: COLORS.cyan,
  },
  checkBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.9,
    shadowRadius: 16,
  },
  superTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 2,
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  bookingId: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginTop: 4,
  },
  metricsCard: {
    padding: 18,
    marginBottom: 16,
  },
  cardHeader: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 14,
    textAlign: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricColumn: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
    marginTop: 6,
  },
  metricUnit: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryCard: {
    padding: 18,
    marginBottom: 24,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  partnerRole: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderWidth: 1,
    borderColor: COLORS.neonGreen,
  },
  statusPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.neonGreen,
    letterSpacing: 1,
  },
  routeBox: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotOrigin: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.cyan,
    marginRight: 10,
  },
  routeRail: {
    width: 1.5,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginLeft: 3.5,
    marginVertical: 3,
  },
  routeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  actionContainer: {
    marginTop: 4,
  },
  returnBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  returnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 1.2,
  },
});

export default TripCompletedScreen;
