import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import AnimatedSpatialBackground from '../../components/AnimatedSpatialBackground';
import VerificationBadge from '../../components/VerificationBadge';
import RatingStars from '../../components/RatingStars';
import TrustScoreBadge from '../../components/TrustScoreBadge';
import NeonButton from '../../components/NeonButton';
import { triggerHaptic } from '../../utils/haptics';

export const CarDetailsScreen = ({ route, navigation }) => {
  const { car } = route.params;

  if (!car) return null;

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
          <Text style={styles.appBarTitle}>VEHICLE SPECIFICATIONS</Text>
          <TouchableOpacity
            onPress={() => triggerHaptic('selection')}
            style={styles.shareBtn}
          >
            <Ionicons name="bookmark-outline" size={18} color={COLORS.cyan} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Vehicle Image Card */}
          <View style={styles.heroWrap}>
            <Image source={{ uri: car.carImage }} style={styles.heroImage} resizeMode="cover" />
            <LinearGradient
              colors={['transparent', 'rgba(5, 8, 20, 0.9)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{car.category} • {car.transmission}</Text>
            </View>
          </View>

          {/* Title & Trust Header */}
          <View style={styles.glassCard}>
            <LinearGradient
              colors={['rgba(20, 28, 52, 0.85)', 'rgba(9, 14, 28, 0.95)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.topRim} />

            <View style={styles.titleRow}>
              <Text style={styles.carName}>{car.name}</Text>
              <VerificationBadge verified={car.verified} size="large" />
            </View>

            <View style={styles.metaRow}>
              <RatingStars rating={car.rating} size={14} />
              <Text style={styles.dot}>•</Text>
              <Text style={styles.tripsText}>{car.completedTrips} recorded runs</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.distText}>📍 {car.distanceKm} km</Text>
            </View>

            <View style={styles.trustRow}>
              <TrustScoreBadge score={car.trustScore || 94} entityName={car.name} />
              <View style={styles.verifiedOwnerBadge}>
                <Ionicons name="business" size={13} color={COLORS.cyan} />
                <Text style={styles.ownerText}>{car.owner?.name || 'DriveNearby Fleet'}</Text>
              </View>
            </View>
          </View>

          {/* Key Specifications Grid */}
          <View style={styles.glassCard}>
            <LinearGradient
              colors={['rgba(18, 26, 46, 0.85)', 'rgba(8, 13, 26, 0.94)']}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.sectionHeading}>KEY HARDWARE SPECIFICATIONS</Text>
            <View style={styles.specGrid}>
              <View style={styles.specBox}>
                <Ionicons name="git-branch-outline" size={18} color={COLORS.cyan} />
                <Text style={styles.specVal}>{car.transmission}</Text>
                <Text style={styles.specKey}>TRANSMISSION</Text>
              </View>
              <View style={styles.specBox}>
                <Ionicons name="water-outline" size={18} color={COLORS.aiPurple} />
                <Text style={styles.specVal}>{car.fuelType}</Text>
                <Text style={styles.specKey}>PROPULSION</Text>
              </View>
              <View style={styles.specBox}>
                <Ionicons name="people-outline" size={18} color={COLORS.cyan} />
                <Text style={styles.specVal}>{car.seats} Person</Text>
                <Text style={styles.specKey}>CABIN CAPACITY</Text>
              </View>
              <View style={styles.specBox}>
                <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.success} />
                <Text style={styles.specVal}>Fastag Enabled</Text>
                <Text style={styles.specKey}>TOLL TELEMETRY</Text>
              </View>
            </View>
          </View>

          {/* Features List */}
          <View style={styles.glassCard}>
            <LinearGradient
              colors={['rgba(18, 26, 46, 0.85)', 'rgba(8, 13, 26, 0.94)']}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.sectionHeading}>INCLUDED SAFETY & COMFORT TECH</Text>
            <View style={styles.featureList}>
              {(car.features || ['Panoramic Sunroof', 'Airbags', 'GPS Navigation', 'Reverse Camera']).map((f) => (
                <View key={f} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={15} color={COLORS.cyan} />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Pickup Station Station */}
          <View style={styles.glassCard}>
            <LinearGradient
              colors={['rgba(18, 26, 46, 0.85)', 'rgba(8, 13, 26, 0.94)']}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.sectionHeading}>DEPOT / PICKUP STATION</Text>
            <View style={styles.stationRow}>
              <Ionicons name="location" size={20} color={COLORS.cyan} style={{ marginTop: 2 }} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.stationName}>{car.address || 'Koramangala 4th Block, Bengaluru'}</Text>
                <Text style={styles.stationSub}>Contactless digital key unlock or depot handover available</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Floating Bottom Booking Action Bar */}
        <View style={styles.bottomBar}>
          <LinearGradient
            colors={['rgba(14, 21, 38, 0.95)', '#050814']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.bottomRim} />

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>DAILY RENTAL</Text>
            <Text style={styles.priceValue}>
              ₹{car.pricePerDay}
              <Text style={styles.priceUnit}> / day</Text>
            </Text>
          </View>

          <NeonButton
            title="Rent This Vehicle"
            icon="key-outline"
            variant="cyan"
            onPress={() => navigation.navigate('Booking', { serviceType: 'car', car })}
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
    maxWidth: 800,
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
    paddingBottom: 110,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  heroWrap: {
    width: '100%',
    height: 220,
    position: 'relative',
    backgroundColor: '#070D1F',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 14,
    left: 20,
    backgroundColor: 'rgba(5, 8, 20, 0.85)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  glassCard: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: SIZES.radiusLg,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  carName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dot: {
    color: COLORS.textMuted,
    marginHorizontal: 5,
  },
  tripsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  distText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  verifiedOwnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ownerText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  specGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  specBox: {
    width: '47%',
    backgroundColor: 'rgba(10, 16, 32, 0.65)',
    padding: 12,
    borderRadius: SIZES.radiusMd,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  specVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 6,
  },
  specKey: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  stationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stationName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stationSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 800,
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

export default CarDetailsScreen;
