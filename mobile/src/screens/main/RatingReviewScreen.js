import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import AnimatedSpatialBackground from '../../components/AnimatedSpatialBackground';
import GlassCard from '../../components/GlassCard';
import NeonButton from '../../components/NeonButton';
import RatingStars from '../../components/RatingStars';
import TrustDeltaCelebrationModal from '../../components/TrustDeltaCelebrationModal';
import { useBookings } from '../../context/BookingContext';
import { triggerHaptic } from '../../utils/haptics';

export const RatingReviewScreen = ({ route, navigation }) => {
  const { submitTripReview } = useBookings();
  const booking = route.params?.booking || {
    id: 'DN-829140',
    bookingId: 'DN-829140',
    driver: {
      id: 'drv-01',
      name: 'Ravi Kumar',
      rating: 4.8,
      completedTrips: 142,
      trustScore: 94,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    serviceType: 'driver',
  };

  const partner = booking.driver || booking.car || { name: 'Ravi Kumar', id: 'drv-01' };

  // Ratings State
  const [overallRating, setOverallRating] = useState(5);
  const [subRatings, setSubRatings] = useState({
    driving: 5,
    punctuality: 5,
    behaviour: 5,
    safety: 5,
    vehicleCleanliness: 5,
  });
  const [comment, setComment] = useState('Smooth, futuristic and safe ride. Outstanding driver courtesy and clean vehicle!');
  const [loading, setLoading] = useState(false);
  const [trustDeltaModal, setTrustDeltaModal] = useState(null);

  const subCriteria = [
    { key: 'driving', label: 'Driving Precision', icon: 'car-sport' },
    { key: 'punctuality', label: 'Punctuality & ETA', icon: 'time' },
    { key: 'behaviour', label: 'Courtesy & Demeanor', icon: 'happy' },
    { key: 'safety', label: 'Safety & Rule Adherence', icon: 'shield-checkmark' },
    { key: 'vehicleCleanliness', label: 'Sanitation & Ambience', icon: 'sparkles' },
  ];

  // Sequential Entrance Animation for Criteria Rows
  const rowAnims = useRef(subCriteria.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = rowAnims.map((anim, idx) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 150 + idx * 90,
        useNativeDriver: true,
      })
    );
    Animated.stagger(60, animations).start();
  }, [rowAnims]);

  const handleSubRatingChange = (key, val) => {
    setSubRatings((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async () => {
    triggerHaptic('notificationSuccess');
    setLoading(true);
    const result = await submitTripReview({
      bookingId: booking.id || booking.bookingId,
      targetType: booking.serviceType,
      targetId: partner.id || 'drv-01',
      overallRating,
      subRatings,
      comment,
    });
    setLoading(false);

    if (result && result.trustUpdate) {
      setTrustDeltaModal(result.trustUpdate);
    } else {
      navigation.navigate('MainTabs');
    }
  };

  const handleModalDone = () => {
    setTrustDeltaModal(null);
    navigation.navigate('MainTabs');
  };

  return (
    <AnimatedSpatialBackground>
      <SafeAreaView style={styles.safeArea}>
        {/* Futuristic Top App Bar */}
        <View style={styles.appBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.appBarTitle}>RATE & VERIFY TRIP</Text>
            <Text style={styles.appBarSubtitle}>TRANSPARENT AI TRUST MATRIX</Text>
          </View>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Partner Info Holographic Banner */}
          <GlassCard style={styles.partnerBanner} glowColor={COLORS.cyan}>
            <View style={styles.avatarBorder}>
              <Image
                source={{
                  uri:
                    partner.profileImage ||
                    booking.car?.carImage ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                }}
                style={styles.avatar}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.partnerName}>{partner.name}</Text>
              <Text style={styles.partnerRole}>
                MISSION #{booking.bookingId || booking.id} • COMPLETED
              </Text>
            </View>
            <View style={styles.verifiedTag}>
              <Ionicons name="checkmark-done" size={12} color={COLORS.cyan} />
              <Text style={styles.verifiedText}>VERIFIED</Text>
            </View>
          </GlassCard>

          {/* Overall Rating Section */}
          <GlassCard style={styles.overallRatingCard} glowColor={COLORS.neonGold}>
            <Text style={styles.ratingHeading}>OVERALL MISSION SATISFACTION</Text>
            <Text style={styles.ratingSub}>Tap any star to update ratings and trigger haptic response</Text>

            <View style={styles.starTouchWrap}>
              <RatingStars
                rating={overallRating}
                size={38}
                interactive={true}
                onRatingChange={(r) => {
                  triggerHaptic('impactMedium');
                  setOverallRating(r);
                }}
                showLabel={false}
              />
            </View>

            <View style={styles.scoreWordPill}>
              <Text style={styles.scoreWord}>
                {overallRating === 5
                  ? '⭐ 5.0 — EXCEPTIONAL'
                  : overallRating === 4
                  ? '⭐ 4.0 — VERY SATISFIED'
                  : overallRating === 3
                  ? '⭐ 3.0 — AVERAGE TRIP'
                  : '⭐ ' + overallRating + '.0 — NEEDS IMPROVEMENT'}
              </Text>
            </View>
          </GlassCard>

          {/* Granular Sub-Criteria Ratings with Sequential Stagger */}
          <GlassCard style={styles.criteriaCard} glowColor={COLORS.electricViolet}>
            <View style={styles.criteriaHeader}>
              <Ionicons name="analytics" size={16} color={COLORS.cyan} />
              <Text style={styles.sectionTitle}>MULTIDIMENSIONAL METRICS</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              These specific vector ratings directly re-weight the AI Trust Score for this unit:
            </Text>

            {subCriteria.map((item, idx) => {
              const anim = rowAnims[idx];
              return (
                <Animated.View
                  key={item.key}
                  style={[
                    styles.criterionRow,
                    {
                      opacity: anim,
                      transform: [
                        {
                          translateY: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [16, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <View style={styles.critLabelRow}>
                    <View style={styles.critIconWrap}>
                      <Ionicons name={item.icon} size={15} color={COLORS.cyan} />
                    </View>
                    <Text style={styles.critLabel}>{item.label}</Text>
                  </View>

                  <RatingStars
                    rating={subRatings[item.key]}
                    size={22}
                    interactive={true}
                    onRatingChange={(val) => {
                      triggerHaptic('impactLight');
                      handleSubRatingChange(item.key, val);
                    }}
                    showLabel={false}
                  />
                </Animated.View>
              );
            })}
          </GlassCard>

          {/* Written Feedback Glass Card */}
          <GlassCard style={styles.reviewTextCard}>
            <View style={styles.criteriaHeader}>
              <Ionicons name="create-outline" size={16} color={COLORS.electricViolet} />
              <Text style={styles.sectionTitle}>QUALITATIVE OBSERVATIONS</Text>
            </View>
            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder="Provide comments regarding driving precision, cleanliness, reliability..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={styles.textArea}
            />
          </GlassCard>

          {/* AI Transparency & Network Impact Banner */}
          <GlassCard style={styles.transparencyCard} glowColor={COLORS.cyan}>
            <Ionicons name="hardware-chip-outline" size={20} color={COLORS.cyan} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.transparencyTitle}>NEURAL NETWORK RE-CALIBRATION</Text>
              <Text style={styles.transparencyBody}>
                Submitting this verified review recalculates the partner's public Trust Score (0-100) and tunes the local mobility dispatch algorithm.
              </Text>
            </View>
          </GlassCard>

          {/* Submit Review CTA */}
          <NeonButton
            title="SUBMIT & UPDATE TRUST SCORE"
            icon="shield-checkmark"
            variant="ai"
            loading={loading}
            onPress={handleSubmit}
            style={{ marginTop: 6, marginBottom: 20 }}
          />
        </ScrollView>
      </SafeAreaView>

      {/* Trust Delta Celebration Modal */}
      <TrustDeltaCelebrationModal
        visible={!!trustDeltaModal}
        trustDelta={trustDeltaModal}
        onClose={handleModalDone}
      />
    </AnimatedSpatialBackground>
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
  headerCenter: {
    alignItems: 'center',
  },
  appBarTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  appBarSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.cyan,
    letterSpacing: 1,
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  partnerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 14,
  },
  avatarBorder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: COLORS.cyan,
    padding: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  partnerName: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  partnerRole: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    gap: 4,
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.8,
  },
  overallRatingCard: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  ratingHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.textSecondary,
    letterSpacing: 1.2,
  },
  ratingSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 16,
    textAlign: 'center',
  },
  starTouchWrap: {
    paddingVertical: 6,
  },
  scoreWordPill: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  scoreWord: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.neonGold,
    letterSpacing: 0.8,
  },
  criteriaCard: {
    padding: 18,
    marginBottom: 14,
  },
  criteriaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1.1,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 14,
    lineHeight: 16,
  },
  criterionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  critLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  critIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  critLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  reviewTextCard: {
    padding: 18,
    marginBottom: 14,
  },
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: COLORS.textPrimary,
    padding: 14,
    fontSize: 13,
    minHeight: 90,
    lineHeight: 19,
    marginTop: 10,
  },
  transparencyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    marginBottom: 16,
  },
  transparencyTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1,
    marginBottom: 4,
  },
  transparencyBody: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
});

export default RatingReviewScreen;
