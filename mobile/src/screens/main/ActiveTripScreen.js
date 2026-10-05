import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import AnimatedSpatialBackground from '../../components/AnimatedSpatialBackground';
import GlassCard from '../../components/GlassCard';
import NeonButton from '../../components/NeonButton';
import InteractiveMap from '../../components/InteractiveMap';
import TrustScoreBadge from '../../components/TrustScoreBadge';
import { useBookings } from '../../context/BookingContext';
import { useLocation } from '../../context/LocationContext';
import { triggerHaptic } from '../../utils/haptics';

const TRIP_STATES = [
  { key: 'confirmed', label: 'BOOKING CONFIRMED', icon: 'checkmark-circle', eta: '4 min pickup' },
  { key: 'driver_arriving', label: 'DRIVER ARRIVING', icon: 'car-sport', eta: '2 min pickup' },
  { key: 'driver_arrived', label: 'DRIVER ARRIVED', icon: 'location', eta: 'Boarding now' },
  { key: 'trip_started', label: 'TRIP STARTED', icon: 'navigate', eta: '38 min to destination' },
  { key: 'in_progress', label: 'TRIP IN PROGRESS', icon: 'speedometer', eta: '18 min remaining' },
  { key: 'trip_completed', label: 'TRIP COMPLETED', icon: 'flag', eta: 'Arrived at destination' },
];

export const ActiveTripScreen = ({ route, navigation }) => {
  const { advanceTripStatus } = useBookings();
  const { location } = useLocation();

  const booking = route.params?.booking || {
    id: 'DN-829140',
    bookingId: 'DN-829140',
    driver: {
      name: 'Ravi Kumar',
      phone: '+91 98450 12345',
      rating: 4.8,
      trustScore: 94,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    pickupLocation: { address: 'Indiranagar 100ft Rd, Bengaluru' },
    destination: { address: 'Kempegowda Int. Airport (BLR)' },
    status: 'driver_arriving',
    estimatedPrice: 850,
  };

  const [currentStatus, setCurrentStatus] = useState(booking.status || 'driver_arriving');
  const [loadingStep, setLoadingStep] = useState(false);

  const currentIndex = TRIP_STATES.findIndex((s) => s.key === currentStatus);
  const safeIndex = currentIndex >= 0 ? currentIndex : 1;

  // Pulse animation for live badge
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const handleNextStatus = async () => {
    triggerHaptic('impactMedium');
    if (safeIndex >= TRIP_STATES.length - 1) {
      navigation.replace('TripCompleted', { booking: { ...booking, status: 'trip_completed' } });
      return;
    }

    const nextState = TRIP_STATES[safeIndex + 1];
    setLoadingStep(true);
    await advanceTripStatus(booking.id || booking.bookingId, nextState.key);
    setCurrentStatus(nextState.key);
    setLoadingStep(false);

    if (nextState.key === 'trip_completed') {
      triggerHaptic('notificationSuccess');
      navigation.replace('TripCompleted', {
        booking: { ...booking, status: 'trip_completed' },
      });
    }
  };

  const partner = booking.driver || booking.car || { name: 'Assigned Driver', rating: 4.8 };

  return (
    <View style={styles.container}>
      <AnimatedSpatialBackground />

      <SafeAreaView style={styles.safeArea}>
        {/* HUD Navigation Header */}
        <View style={styles.appBar}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs')}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <View style={styles.appBarCenter}>
            <View style={styles.liveTagRow}>
              <Animated.View style={[styles.liveDot, { transform: [{ scale: pulseAnim }] }]} />
              <Text style={styles.liveTagText}>LIVE COMMAND CENTER</Text>
            </View>
            <Text style={styles.appBarSubtitle}>MISSION #{booking.bookingId || booking.id}</Text>
          </View>

          <TouchableOpacity
            onPress={() => Alert.alert('Emergency SOS', 'Immediate telemetry and GPS sent to DriveNearby 24/7 Security Operations.')}
            style={styles.sosBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* 3D Mobility Radar Centerpiece */}
          <View style={styles.mapContainer}>
            <InteractiveMap
              userLocation={location}
              height={260}
              tripStatus={currentStatus}
              markers={[
                {
                  id: 'partner',
                  name: partner.name,
                  title: partner.name,
                  type: booking.driver ? 'driver' : 'car',
                  latitude:
                    safeIndex <= 1
                      ? location.latitude + 0.005 * (2 - safeIndex)
                      : safeIndex === 2
                      ? location.latitude
                      : location.latitude + 0.006 * (safeIndex - 1),
                  longitude:
                    safeIndex <= 1
                      ? location.longitude + 0.004 * (2 - safeIndex)
                      : safeIndex === 2
                      ? location.longitude
                      : location.longitude + 0.007 * (safeIndex - 1),
                  rating: partner.rating,
                  avatar: partner.profileImage || booking.driver?.profileImage,
                  trustScore: partner.trustScore || 94,
                  status: 'AVAILABLE',
                  isAIMatch: true,
                  matchScore: 96,
                },
                {
                  id: 'pickup',
                  name: 'Pickup Point',
                  title: 'Pickup Location',
                  type: 'pickup',
                  latitude: location.latitude,
                  longitude: location.longitude,
                },
                {
                  id: 'destination',
                  name: 'Destination Point',
                  title: 'Destination',
                  type: 'destination',
                  latitude: location.latitude + 0.024,
                  longitude: location.longitude + 0.028,
                },
              ]}
            />
          </View>

          {/* Real-time Telemetry Bar */}
          <GlassCard style={styles.telemetryBar} glowColor={COLORS.cyan}>
            <View style={styles.telemetryItem}>
              <Text style={styles.telemetryLabel}>ESTIMATED ETA</Text>
              <Text style={styles.telemetryValue}>{TRIP_STATES[safeIndex].eta.split(' ')[0]} {TRIP_STATES[safeIndex].eta.split(' ')[1]}</Text>
            </View>
            <View style={styles.telemetryDivider} />
            <View style={styles.telemetryItem}>
              <Text style={styles.telemetryLabel}>TELEMETRY</Text>
              <Text style={[styles.telemetryValue, { color: COLORS.cyan }]}>
                {safeIndex >= 3 ? '48 km/h' : 'En Route'}
              </Text>
            </View>
            <View style={styles.telemetryDivider} />
            <View style={styles.telemetryItem}>
              <Text style={styles.telemetryLabel}>TRIP FARE</Text>
              <Text style={[styles.telemetryValue, { color: COLORS.neonGold }]}>
                ₹{booking.estimatedPrice}
              </Text>
            </View>
          </GlassCard>

          {/* Mission Lifecycle Stage Card */}
          <GlassCard style={styles.lifecycleCard} glowColor={COLORS.electricViolet}>
            <View style={styles.statusHighlightRow}>
              <View style={styles.statusBadge}>
                <Ionicons name={TRIP_STATES[safeIndex].icon} size={16} color={COLORS.cyan} />
                <Text style={styles.statusHighlightText}>
                  {TRIP_STATES[safeIndex].label}
                </Text>
              </View>
              <Text style={styles.stageCounter}>STAGE 0{safeIndex + 1}/06</Text>
            </View>

            {/* Glowing Stepper Rail */}
            <View style={styles.stepperRow}>
              {TRIP_STATES.map((step, idx) => {
                const isPast = idx < safeIndex;
                const isCurrent = idx === safeIndex;
                return (
                  <View key={step.key} style={styles.stepCol}>
                    <View
                      style={[
                        styles.stepCircle,
                        isPast && styles.stepCirclePast,
                        isCurrent && styles.stepCircleCurrent,
                      ]}
                    >
                      <Ionicons
                        name={isPast ? 'checkmark-sharp' : step.icon}
                        size={12}
                        color={isPast ? COLORS.cyan : isCurrent ? '#FFFFFF' : 'rgba(255, 255, 255, 0.25)'}
                      />
                    </View>
                    {idx < TRIP_STATES.length - 1 && (
                      <View
                        style={[
                          styles.stepConnector,
                          isPast && { backgroundColor: COLORS.cyan, shadowColor: COLORS.cyan, shadowOpacity: 0.8 },
                        ]}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </GlassCard>

          {/* Assigned Unit & Driver Profile */}
          <GlassCard style={styles.partnerCard}>
            <View style={styles.partnerRow}>
              <View style={styles.avatarGlow}>
                <Image
                  source={{
                    uri:
                      booking.driver?.profileImage ||
                      booking.car?.carImage ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                  }}
                  style={styles.avatar}
                />
              </View>

              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.partnerName}>{partner.name}</Text>
                <Text style={styles.partnerRole}>
                  ⭐ {partner.rating} • {booking.serviceType === 'driver' ? 'Elite Chauffeur' : 'Verified Fleet Unit'}
                </Text>
                <View style={{ marginTop: 6, alignSelf: 'flex-start' }}>
                  <TrustScoreBadge score={partner.trustScore || 94} size="small" />
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.contactRow}>
                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic('impactLight');
                    Alert.alert('Secure Link', `Contacting ${partner.name} over encrypted VoIp channel.`);
                  }}
                  style={styles.actionCircleBtn}
                >
                  <Ionicons name="call" size={17} color={COLORS.cyan} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    triggerHaptic('impactLight');
                    Alert.alert('AI Mission Chat', 'Opening DriveNearby End-to-End Encrypted Comms.');
                  }}
                  style={[styles.actionCircleBtn, { borderColor: 'rgba(129, 140, 248, 0.4)' }]}
                >
                  <Ionicons name="chatbubble-ellipses" size={17} color={COLORS.electricViolet} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Trajectory Route */}
            <View style={styles.routeBox}>
              <View style={styles.routePoint}>
                <View style={styles.greenPulseDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.routeHeader}>ORIGIN</Text>
                  <Text style={styles.routeAddr} numberOfLines={1}>
                    {booking.pickupLocation?.address}
                  </Text>
                </View>
              </View>

              <View style={styles.routeVerticalRail} />

              <View style={styles.routePoint}>
                <Ionicons name="location" size={15} color={COLORS.neonPink} style={{ marginRight: 8 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.routeHeader, { color: COLORS.neonPink }]}>DESTINATION</Text>
                  <Text style={styles.routeAddr} numberOfLines={1}>
                    {booking.destination?.address}
                  </Text>
                </View>
              </View>
            </View>
          </GlassCard>

          {/* Hackathon Fast Forward Engine */}
          <GlassCard style={styles.simCard} glowColor={COLORS.cyan}>
            <View style={styles.simHeader}>
              <Ionicons name="flash" size={16} color={COLORS.cyan} />
              <Text style={styles.simTitle}>MISSION SIMULATION CONTROLLER</Text>
            </View>
            <Text style={styles.simDesc}>
              Tap below to accelerate the trip timeline through all lifecycle states.
            </Text>

            <NeonButton
              title={
                safeIndex === TRIP_STATES.length - 2
                  ? 'Complete Mission & Rate 🏁'
                  : `Advance To: ${TRIP_STATES[safeIndex + 1]?.label || 'Next State'}`
              }
              variant={safeIndex === TRIP_STATES.length - 2 ? 'primary' : 'ai'}
              loading={loadingStep}
              onPress={handleNextStatus}
              icon="play-forward"
            />
          </GlassCard>
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
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  appBarCenter: {
    alignItems: 'center',
  },
  liveTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.neonGreen,
    marginRight: 6,
    shadowColor: COLORS.neonGreen,
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  liveTagText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1.2,
  },
  appBarSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  sosBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(244, 63, 94, 0.18)',
    borderWidth: 1,
    borderColor: COLORS.neonPink,
  },
  sosText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.neonPink,
    letterSpacing: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  mapContainer: {
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
  },
  telemetryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  telemetryItem: {
    alignItems: 'center',
    flex: 1,
  },
  telemetryLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  telemetryValue: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  telemetryDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  lifecycleCard: {
    padding: 18,
    marginBottom: 14,
  },
  statusHighlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusHighlightText: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1.1,
  },
  stageCounter: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCirclePast: {
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    borderColor: COLORS.cyan,
  },
  stepCircleCurrent: {
    backgroundColor: COLORS.cyan,
    borderColor: COLORS.cyan,
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.9,
    shadowRadius: 10,
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 3,
  },
  partnerCard: {
    padding: 16,
    marginBottom: 14,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarGlow: {
    width: 52,
    height: 52,
    borderRadius: 26,
    padding: 2,
    borderWidth: 1.5,
    borderColor: COLORS.cyan,
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  partnerRole: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeBox: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.neonGreen,
    marginRight: 10,
    shadowColor: COLORS.neonGreen,
    shadowOpacity: 0.9,
    shadowRadius: 5,
  },
  routeHeader: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1,
  },
  routeAddr: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  routeVerticalRail: {
    width: 2,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginLeft: 3,
    marginVertical: 4,
  },
  simCard: {
    padding: 16,
    marginBottom: 20,
  },
  simHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  simTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1.2,
  },
  simDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 14,
    lineHeight: 18,
  },
});

export default ActiveTripScreen;
