import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import AnimatedSpatialBackground from '../../components/AnimatedSpatialBackground';
import NeonButton from '../../components/NeonButton';
import { useBookings } from '../../context/BookingContext';
import { useLocation } from '../../context/LocationContext';
import { triggerHaptic } from '../../utils/haptics';

export const BookingScreen = ({ route, navigation }) => {
  const { addBooking } = useBookings();
  const { location } = useLocation();

  const {
    serviceType = 'driver',
    driver = null,
    car = null,
    estimatedPrice: routePrice = null,
  } = route.params || {};

  const [pickupLocation, setPickupLocation] = useState(
    location?.address || 'Indiranagar 100ft Rd, Bengaluru'
  );
  const [destination, setDestination] = useState('Kempegowda Int. Airport (BLR)');
  const [bookingDate, setBookingDate] = useState('Today, 28 Sep');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [duration, setDuration] = useState('Full Day (8 hrs)');
  const [currentStep, setCurrentStep] = useState(2); // Step 2: Schedule
  const [loading, setLoading] = useState(false);

  const basePrice = routePrice
    ? routePrice
    : serviceType === 'driver'
    ? driver?.pricing?.perDay || 800
    : serviceType === 'car'
    ? car?.pricePerDay || 1800
    : 2400;

  const handleConfirm = async () => {
    if (!pickupLocation || !destination) {
      Alert.alert('Missing Field', 'Please provide both pickup and destination locations.');
      return;
    }

    triggerHaptic('success');
    setLoading(true);
    const newBooking = await addBooking({
      serviceType,
      driver,
      car,
      pickupLocation,
      destination,
      bookingDate,
      startTime,
      duration,
      estimatedPrice: basePrice,
    });
    setLoading(false);

    navigation.replace('BookingConfirmation', { booking: newBooking });
  };

  return (
    <AnimatedSpatialBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.appBar}>
          <TouchableOpacity
            onPress={() => {
              triggerHaptic('light');
              navigation.goBack();
            }}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>CHECKOUT TELEMETRY</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Futuristic 3-Step Checkout Flow Indicator */}
          <View style={styles.stepIndicatorCard}>
            <LinearGradient
              colors={['rgba(20, 28, 52, 0.85)', 'rgba(9, 14, 28, 0.95)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.stepperRow}>
              {/* Step 01 */}
              <View style={styles.stepNode}>
                <View style={[styles.stepCircle, styles.stepCircleDone]}>
                  <Ionicons name="checkmark" size={11} color="#050814" />
                </View>
                <Text style={styles.stepTextDone}>01 SELECT</Text>
              </View>

              <View style={[styles.stepDivider, { backgroundColor: COLORS.cyan }]} />

              {/* Step 02 (Active) */}
              <View style={styles.stepNode}>
                <View style={[styles.stepCircle, styles.stepCircleActive]}>
                  <Text style={styles.stepNumberActive}>02</Text>
                </View>
                <Text style={styles.stepTextActive}>SCHEDULE</Text>
              </View>

              <View style={styles.stepDivider} />

              {/* Step 03 */}
              <View style={styles.stepNode}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumberPending}>03</Text>
                </View>
                <Text style={styles.stepTextPending}>CONFIRM</Text>
              </View>
            </View>
          </View>

          {/* Service Summary Banner */}
          <View style={styles.serviceBanner}>
            <LinearGradient
              colors={['rgba(0, 242, 254, 0.15)', 'rgba(129, 140, 248, 0.08)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.bannerRim} />

            <View style={styles.serviceIconWrap}>
              <Ionicons
                name={serviceType === 'driver' ? 'person' : serviceType === 'car' ? 'car' : 'car-sport'}
                size={22}
                color={COLORS.cyan}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.serviceTypeTitle}>
                {serviceType === 'driver'
                  ? `Chauffeur: ${driver?.name || 'Ravi Kumar'}`
                  : serviceType === 'car'
                  ? `Rental: ${car?.name || 'Hyundai Creta'}`
                  : `Combo: ${car?.name} + ${driver?.name}`}
              </Text>
              <Text style={styles.serviceTypeSub}>
                ⭐ {driver?.rating || car?.rating || 4.8} • Verified Autonomous Guarantee
              </Text>
            </View>
          </View>

          {/* Route Inputs Card */}
          <View style={styles.glassCard}>
            <LinearGradient
              colors={['rgba(18, 26, 46, 0.85)', 'rgba(8, 13, 26, 0.94)']}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.sectionHeading}>JOURNEY TELEMETRY</Text>

            <View style={styles.routeInputGroup}>
              <View style={styles.iconTrack}>
                <View style={[styles.routeDot, { backgroundColor: COLORS.cyan }]} />
                <View style={styles.routeLine} />
                <View style={[styles.routeDot, { backgroundColor: COLORS.aiPink }]} />
              </View>

              <View style={styles.inputsColumn}>
                <View style={styles.inputBox}>
                  <Text style={styles.inputLabel}>PICKUP COORDINATE</Text>
                  <TextInput
                    value={pickupLocation}
                    onChangeText={setPickupLocation}
                    placeholder="Enter pickup address"
                    placeholderTextColor={COLORS.textMuted}
                    style={styles.textInput}
                  />
                </View>

                <View style={[styles.inputBox, { marginTop: 10 }]}>
                  <Text style={styles.inputLabel}>DESTINATION TARGET</Text>
                  <TextInput
                    value={destination}
                    onChangeText={setDestination}
                    placeholder="Enter destination address"
                    placeholderTextColor={COLORS.textMuted}
                    style={styles.textInput}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Schedule Options */}
          <View style={styles.glassCard}>
            <LinearGradient
              colors={['rgba(18, 26, 46, 0.85)', 'rgba(8, 13, 26, 0.94)']}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.sectionHeading}>TIME & DURATION PARAMETERS</Text>

            <View style={styles.gridRow}>
              <View style={styles.gridItem}>
                <Text style={styles.inputLabel}>MISSION DATE</Text>
                <View style={styles.fieldRow}>
                  <Ionicons name="calendar-outline" size={15} color={COLORS.cyan} />
                  <TextInput
                    value={bookingDate}
                    onChangeText={setBookingDate}
                    style={styles.smallInput}
                  />
                </View>
              </View>

              <View style={styles.gridItem}>
                <Text style={styles.inputLabel}>DEPARTURE TIME</Text>
                <View style={styles.fieldRow}>
                  <Ionicons name="time-outline" size={15} color={COLORS.cyan} />
                  <TextInput
                    value={startTime}
                    onChangeText={setStartTime}
                    style={styles.smallInput}
                  />
                </View>
              </View>
            </View>

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>PACKAGE DURATION</Text>
            <View style={styles.durationRow}>
              {['4 Hours', 'Full Day (8 hrs)', 'Outstation 24 hrs'].map((d) => {
                const isSelected = duration === d;
                return (
                  <TouchableOpacity
                    key={d}
                    activeOpacity={0.8}
                    onPress={() => {
                      triggerHaptic('selection');
                      setDuration(d);
                    }}
                    style={[styles.durationPill, isSelected && styles.durationPillActive]}
                  >
                    <Text style={[styles.durationText, isSelected && styles.durationTextActive]}>
                      {d}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Animated Fare Estimate Matrix */}
          <View style={styles.glassCard}>
            <LinearGradient
              colors={['rgba(18, 26, 46, 0.85)', 'rgba(8, 13, 26, 0.94)']}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.sectionHeading}>FARE BREAKDOWN MATRIX</Text>

            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Base Mobility Rate</Text>
              <Text style={styles.fareVal}>₹{basePrice}</Text>
            </View>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>AI Trust & Safety Insurance</Text>
              <Text style={[styles.fareVal, { color: COLORS.cyan }]}>INCLUDED (FREE)</Text>
            </View>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Platform Telemetry Fee</Text>
              <Text style={styles.fareVal}>₹0</Text>
            </View>

            <View style={styles.fareTotalRow}>
              <Text style={styles.fareTotalLabel}>TOTAL ESTIMATED FARE</Text>
              <Text style={styles.fareTotalVal}>₹{basePrice}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Floating Bottom Bar */}
        <View style={styles.bottomBar}>
          <LinearGradient
            colors={['rgba(14, 21, 38, 0.95)', '#050814']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.bottomRim} />

          <View>
            <Text style={styles.footerSub}>ESTIMATED TOTAL</Text>
            <Text style={styles.footerPrice}>₹{basePrice}</Text>
          </View>

          <NeonButton
            title="Confirm Booking"
            icon="checkmark-circle"
            variant="cyan"
            loading={loading}
            onPress={handleConfirm}
            style={{ paddingHorizontal: 22 }}
          />
        </View>
      </SafeAreaView>
    </AnimatedSpatialBackground>
  );
};

const styles = StyleSheet.create({
  container: {
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
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  appBarTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  stepIndicatorCard: {
    borderRadius: SIZES.radiusLg,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.subtle,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepNode: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepCircleDone: {
    backgroundColor: COLORS.cyan,
  },
  stepCircleActive: {
    backgroundColor: 'rgba(0, 242, 254, 0.2)',
    borderWidth: 1.5,
    borderColor: COLORS.cyan,
  },
  stepNumberActive: {
    color: COLORS.cyan,
    fontSize: 10,
    fontWeight: '900',
  },
  stepNumberPending: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  stepTextDone: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.cyan,
    letterSpacing: 0.5,
  },
  stepTextActive: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  stepTextPending: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  stepDivider: {
    flex: 1,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 8,
    marginBottom: 12,
  },
  serviceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radiusLg,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.subtle,
  },
  bannerRim: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: COLORS.cyan,
  },
  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTypeTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  serviceTypeSub: {
    fontSize: 11,
    color: COLORS.cyan,
    marginTop: 2,
    fontWeight: '700',
  },
  glassCard: {
    borderRadius: SIZES.radiusLg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.card,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  routeInputGroup: {
    flexDirection: 'row',
  },
  iconTrack: {
    alignItems: 'center',
    width: 20,
    paddingTop: 16,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeLine: {
    width: 1.5,
    height: 38,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 4,
  },
  inputsColumn: {
    flex: 1,
    marginLeft: 10,
  },
  inputBox: {
    backgroundColor: 'rgba(10, 16, 32, 0.75)',
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  textInput: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridItem: {
    flex: 1,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 16, 32, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: 4,
    gap: 6,
  },
  smallInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  durationRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  durationPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: SIZES.radiusFull,
    backgroundColor: 'rgba(10, 16, 32, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  durationPillActive: {
    backgroundColor: 'rgba(0, 242, 254, 0.18)',
    borderColor: COLORS.cyan,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  durationTextActive: {
    color: COLORS.cyan,
    fontWeight: '900',
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fareLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  fareVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  fareTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  fareTotalLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  fareTotalVal: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.cyan,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 720,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    ...SHADOWS.hover,
  },
  bottomRim: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: COLORS.cyan,
  },
  footerSub: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});

export default BookingScreen;
