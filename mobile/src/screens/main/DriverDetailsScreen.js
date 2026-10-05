import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import AnimatedSpatialBackground from '../../components/AnimatedSpatialBackground';
import RatingStars from '../../components/RatingStars';
import VerificationBadge from '../../components/VerificationBadge';
import TrustScoreBadge from '../../components/TrustScoreBadge';
import ReviewCard from '../../components/ReviewCard';
import NeonButton from '../../components/NeonButton';
import { triggerHaptic } from '../../utils/haptics';

export const DriverDetailsScreen = ({ route, navigation }) => {
  const { driver } = route.params;

  if (!driver) return null;

  // Rotating holographic ring around driver photo
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 8000, useNativeDriver: true })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <AnimatedSpatialBackground>
      <SafeAreaView style={styles.container}>
        {/* App Bar */}
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
          <Text style={styles.appBarTitle}>DRIVER DOSSIER</Text>
          <TouchableOpacity
            onPress={() => triggerHaptic('selection')}
            style={styles.shareBtn}
          >
            <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.cyan} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Profile Card with Holographic Ring */}
          <View style={styles.profileHeaderCard}>
            <LinearGradient
              colors={['rgba(20, 28, 52, 0.88)', 'rgba(9, 14, 28, 0.95)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.topRim} />

            {/* Avatar with Animated Holographic Ring */}
            <View style={styles.avatarOuterWrap}>
              <Animated.View
                style={[
                  styles.hologramRing,
                  { transform: [{ rotate: spin }] },
                ]}
              />
              <Image source={{ uri: driver.profileImage }} style={styles.profileAvatar} />
            </View>

            <View style={styles.nameRow}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <VerificationBadge verified={driver.verified} size="large" />
            </View>

            <Text style={styles.badgeText}>{driver.badge || 'ELITE VERIFIED PRO'}</Text>

            {/* Key Telemetry Metrics */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCol}>
                <View style={styles.metricValRow}>
                  <Ionicons name="star" size={15} color={COLORS.accent} />
                  <Text style={styles.metricValue}>{driver.rating}</Text>
                </View>
                <Text style={styles.metricSub}>{driver.totalRatings || 128} REVIEWS</Text>
              </View>

              <View style={styles.metricDivider} />

              <View style={styles.metricCol}>
                <Text style={styles.metricValue}>{driver.completedTrips}</Text>
                <Text style={styles.metricSub}>MISSIONS</Text>
              </View>

              <View style={styles.metricDivider} />

              <View style={styles.metricCol}>
                <Text style={styles.metricValue}>{driver.experienceYears} YRS</Text>
                <Text style={styles.metricSub}>EXPERIENCE</Text>
              </View>

              <View style={styles.metricDivider} />

              <View style={styles.metricCol}>
                <Text style={[styles.metricValue, { color: COLORS.cyan }]}>
                  {driver.distanceKm} km
                </Text>
                <Text style={styles.metricSub}>RADAR DIST</Text>
              </View>
            </View>
          </View>

          {/* AI Trust Score & Reliability Telemetry */}
          <View style={styles.trustCard}>
            <LinearGradient
              colors={['rgba(16, 32, 56, 0.9)', 'rgba(6, 16, 32, 0.96)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={[styles.topRim, { backgroundColor: COLORS.cyan }]} />

            <View style={styles.trustHeader}>
              <View style={styles.trustTitleRow}>
                <Ionicons name="shield-checkmark" size={18} color={COLORS.cyan} />
                <Text style={styles.trustTitle}>AI TRUST & INTEGRITY SCORE</Text>
              </View>
              <TrustScoreBadge
                score={driver.trustScore || 94}
                entityName={driver.name}
                showInfoButton={true}
              />
            </View>

            <Text style={styles.trustDesc}>
              "Dynamically calculated through {driver.completedTrips} recorded journeys, verified RTO commercial badge, zero incident history, and {driver.cancellationRate || 1.1}% low cancellation."
            </Text>

            {/* Animated Category Progress Bars */}
            <View style={styles.trustMetricsWrap}>
              <View style={styles.barItem}>
                <View style={styles.barLabelRow}>
                  <Text style={styles.barLabel}>Safety & Defensive Driving</Text>
                  <Text style={styles.barVal}>98%</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: '98%', backgroundColor: COLORS.cyan }]} />
                </View>
              </View>

              <View style={styles.barItem}>
                <View style={styles.barLabelRow}>
                  <Text style={styles.barLabel}>Punctuality & Route Knowledge</Text>
                  <Text style={styles.barVal}>96%</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: '96%', backgroundColor: COLORS.success }]} />
                </View>
              </View>

              <View style={styles.barItem}>
                <View style={styles.barLabelRow}>
                  <Text style={styles.barLabel}>Vehicle Care & Cleanliness</Text>
                  <Text style={styles.barVal}>95%</Text>
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: '95%', backgroundColor: COLORS.aiPurple }]} />
                </View>
              </View>
            </View>
          </View>

          {/* Vehicle Competencies & Languages */}
          <View style={styles.sectionCard}>
            <LinearGradient
              colors={['rgba(18, 26, 46, 0.85)', 'rgba(8, 13, 26, 0.94)']}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.sectionHeading}>VEHICLE CAPABILITIES</Text>
            <View style={styles.tagWrap}>
              {(driver.vehicleSkills || ['Sedan', 'SUV', 'Automatic', 'Manual', 'Night Highway']).map((skill) => (
                <View key={skill} style={styles.skillTag}>
                  <Ionicons name="car-sport-outline" size={12} color={COLORS.cyan} />
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionHeading, { marginTop: 14 }]}>LANGUAGES</Text>
            <View style={styles.tagWrap}>
              {(driver.languages || ['English', 'Hindi', 'Kannada']).map((lang) => (
                <View key={lang} style={styles.langTag}>
                  <Ionicons name="chatbubbles-outline" size={12} color={COLORS.textSecondary} />
                  <Text style={styles.langText}>{lang}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recent Reviews */}
          <View style={styles.sectionCard}>
            <LinearGradient
              colors={['rgba(18, 26, 46, 0.85)', 'rgba(8, 13, 26, 0.94)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.reviewsTitleRow}>
              <Text style={styles.sectionHeading}>VERIFIED TRIP FEEDBACK</Text>
              <Text style={styles.reviewScoreAvg}>⭐ {driver.rating} / 5.0</Text>
            </View>

            {driver.recentReviews?.length > 0 ? (
              driver.recentReviews.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))
            ) : (
              <Text style={styles.noReviews}>No recent reviews logged.</Text>
            )}
          </View>
        </ScrollView>

        {/* Floating Bottom Booking Command Bar */}
        <View style={styles.bottomBar}>
          <LinearGradient
            colors={['rgba(14, 21, 38, 0.95)', '#050814']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.bottomRim} />

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>DAILY CHAUFFEUR RATE</Text>
            <Text style={styles.priceValue}>
              ₹{driver.pricing?.perDay || 800}
              <Text style={styles.priceUnit}> / day</Text>
            </Text>
          </View>

          <NeonButton
            title="Book Chauffeur"
            icon="calendar"
            variant="cyan"
            onPress={() => navigation.navigate('Booking', { serviceType: 'driver', driver })}
            style={{ paddingHorizontal: 16 }}
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
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110,
  },
  profileHeaderCard: {
    borderRadius: SIZES.radiusLg,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.card,
  },
  topRim: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: COLORS.cyan,
  },
  avatarOuterWrap: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  hologramRing: {
    position: 'absolute',
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 2,
    borderColor: COLORS.cyan,
    borderStyle: 'dashed',
    opacity: 0.8,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#050814',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  driverName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  metricCol: {
    alignItems: 'center',
  },
  metricValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  metricSub: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  trustCard: {
    borderRadius: SIZES.radiusLg,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.35)',
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.hover,
  },
  trustHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  trustTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.8,
  },
  trustDesc: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 17,
    marginBottom: 14,
  },
  trustMetricsWrap: {
    backgroundColor: 'rgba(10, 16, 32, 0.7)',
    borderRadius: SIZES.radiusMd,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  barItem: {
    gap: 4,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  barVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  barTrack: {
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  sectionCard: {
    borderRadius: SIZES.radiusLg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.subtle,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
    gap: 4,
  },
  skillText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.cyan,
  },
  langTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    gap: 4,
  },
  langText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  reviewsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewScoreAvg: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.accent,
  },
  noReviews: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  priceContainer: {
    justifyContent: 'center',
  },
  priceLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
});

export default DriverDetailsScreen;
