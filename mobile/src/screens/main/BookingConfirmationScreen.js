import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import AnimatedSpatialBackground from '../../components/AnimatedSpatialBackground';
import NeonButton from '../../components/NeonButton';
import TrustScoreBadge from '../../components/TrustScoreBadge';
import { useBookings } from '../../context/BookingContext';
import { triggerHaptic } from '../../utils/haptics';

export const BookingConfirmationScreen = ({ route, navigation }) => {
  const { booking } = route.params;
  const { advanceTripStatus } = useBookings();
  const [simulatedStatus, setSimulatedStatus] = useState('ALLOCATING CHAUFFEUR TELEMETRY...');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const checkPulse = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    triggerHaptic('success');

    Animated.spring(checkPulse, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      setSimulatedStatus('✓ AUTONOMOUS DISPATCH CONFIRMED');
      setIsConfirmed(true);
      triggerHaptic('medium');
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleStartTripSimulation = async () => {
    triggerHaptic('light');
    await advanceTripStatus(booking.id || booking.bookingId, 'driver_arriving');
    navigation.replace('ActiveTrip', {
      booking: { ...booking, status: 'driver_arriving' },
    });
  };

  const partner = booking.driver || booking.car || { name: 'Assigned Chauffeur' };

  return (
    <AnimatedSpatialBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Futuristic Success Card */}
          <View style={styles.successCard}>
            <LinearGradient
              colors={['rgba(20, 32, 58, 0.95)', 'rgba(8, 14, 28, 0.98)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.cardRim} />

            <Animated.View style={[styles.checkCircle, { transform: [{ scale: checkPulse }] }]}>
              <Ionicons name="checkmark" size={38} color="#050814" />
            </Animated.View>

            <Text style={styles.title}>BOOKING CONFIRMED</Text>
            <Text style={styles.bookingIdText}>
              MISSION ID: #{booking.bookingId || booking.id}
            </Text>

            <View style={[styles.statusBadge, isConfirmed && styles.statusBadgeActive]}>
              <Ionicons
                name={isConfirmed ? 'checkmark-circle' : 'hourglass-outline'}
                size={14}
                color={isConfirmed ? '#050814' : COLORS.accent}
              />
              <Text style={[styles.statusText, isConfirmed && { color: '#050814' }]}>
                {simulatedStatus}
              </Text>
            </View>
          </View>

          {/* Assigned Mobility Telemetry Details */}
          <View style={styles.detailsCard}>
            <LinearGradient
              colors={['rgba(18, 26, 46, 0.85)', 'rgba(8, 13, 26, 0.94)']}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.sectionTitle}>ALLOCATED MOBILITY UNIT</Text>

            <View style={styles.partnerRow}>
              {booking.driver ? (
                <Image
                  source={{
                    uri:
                      booking.driver.profileImage ||
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                  }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.carAvatar}>
                  <Ionicons name="car" size={24} color={COLORS.cyan} />
                </View>
              )}

              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.partnerName}>
                  {booking.serviceType === 'combo'
                    ? `${booking.car?.name} + ${booking.driver?.name}`
                    : booking.driver
                    ? booking.driver.name
                    : booking.car?.name || 'Selected Rental Car'}
                </Text>
                <Text style={styles.partnerRole}>
                  {booking.serviceType === 'driver'
                    ? 'Verified Chauffeur'
                    : booking.serviceType === 'car'
                    ? 'Self-Drive Vehicle'
                    : 'AI Synergy Package'}
                </Text>
                <View style={{ marginTop: 4 }}>
                  <TrustScoreBadge
                    score={booking.driver?.trustScore || booking.car?.trustScore || 94}
                    size="small"
                  />
                </View>
              </View>
            </View>

            {/* Schedule Info Grid */}
            <View style={styles.gridContainer}>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>DATE</Text>
                <Text style={styles.gridValue}>{booking.bookingDate || 'Today'}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>DEPARTURE TIME</Text>
                <Text style={styles.gridValue}>{booking.startTime || 'Now'}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>DURATION</Text>
                <Text style={styles.gridValue}>{booking.duration || 'Full Day'}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.gridLabel}>TOTAL FARE</Text>
                <Text style={[styles.gridValue, { color: COLORS.cyan, fontWeight: '900' }]}>
                  ₹{booking.estimatedPrice}
                </Text>
              </View>
            </View>

            {/* Route Overview */}
            <View style={styles.routeWrap}>
              <View style={styles.routeRow}>
                <Ionicons name="radio-button-on" size={14} color={COLORS.cyan} />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.routePointLabel}>PICKUP COORDINATE</Text>
                  <Text style={styles.routePointVal}>{booking.pickupLocation?.address}</Text>
                </View>
              </View>

              <View style={styles.routeDivider} />

              <View style={styles.routeRow}>
                <Ionicons name="location" size={14} color={COLORS.aiPink} />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.routePointLabel}>DESTINATION TARGET</Text>
                  <Text style={styles.routePointVal}>{booking.destination?.address}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action CTAs */}
          <View style={styles.actionsWrap}>
            <NeonButton
              title="Track Unit & Begin Live Journey"
              icon="navigate"
              variant="cyan"
              onPress={handleStartTripSimulation}
              style={{ marginBottom: 12 }}
            />

            <NeonButton
              title="Return to Command Center"
              variant="ghost"
              onPress={() => navigation.navigate('MainTabs')}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </AnimatedSpatialBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  successCard: {
    borderRadius: SIZES.radiusLg,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 254, 0.4)',
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.hover,
  },
  cardRim: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: COLORS.cyan,
  },
  checkCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 14,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  bookingIdText: {
    fontSize: 12,
    color: COLORS.cyan,
    marginTop: 4,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusFull,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    gap: 6,
  },
  statusBadgeActive: {
    backgroundColor: COLORS.cyan,
    borderColor: COLORS.cyan,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.accent,
    letterSpacing: 0.5,
  },
  detailsCard: {
    borderRadius: SIZES.radiusLg,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.subtle,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: COLORS.cyan,
  },
  carAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    borderWidth: 1.5,
    borderColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  partnerRole: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  gridItem: {
    width: '48%',
    backgroundColor: 'rgba(10, 16, 32, 0.65)',
    padding: 10,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  gridLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  gridValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  routeWrap: {
    backgroundColor: 'rgba(10, 16, 32, 0.65)',
    padding: 12,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routePointLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  routePointVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E2E8F0',
    marginTop: 1,
  },
  routeDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 6.5,
    marginVertical: 3,
  },
  actionsWrap: {
    gap: 8,
  },
});

export default BookingConfirmationScreen;
