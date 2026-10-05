import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Animated,
  Platform,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import LiveMobilityMap from '../../components/map/LiveMobilityMap';
import LocationHeader from '../../components/LocationHeader';
import RecommendationCard from '../../components/RecommendationCard';
import AnimatedSpatialBackground from '../../components/AnimatedSpatialBackground';
import TrustDeltaCelebrationModal from '../../components/TrustDeltaCelebrationModal';
import { useBookings } from '../../context/BookingContext';
import { useLocation } from '../../context/LocationContext';
import { useNearbyMobility } from '../../hooks/useNearbyMobility';
import { useResponsive } from '../../hooks/useResponsive';
import { triggerHaptic } from '../../utils/haptics';

export const HomeScreen = ({ navigation }) => {
  const { isMobile, isTablet, isDesktop, maxContentWidth, gutter } = useResponsive();
  const {
    drivers,
    cars,
    combos,
    bookings,
    latestTrustDelta,
    setLatestTrustDelta,
  } = useBookings();
  const { location, refreshLocation } = useLocation();

  // Map view toggle: false = Hub Dashboard, true = Fullscreen Live Satellite Map
  const [isMapOpen, setIsMapOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'drivers' | 'cars' | 'combos'
  const [selectedUnitId, setSelectedUnitId] = useState(null);

  // Radar pulse animation for the preview card
  const radarPulseAnim = useRef(new Animated.Value(1)).current;
  const radarRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(radarPulseAnim, { toValue: 1.25, duration: 1800, useNativeDriver: true }),
        Animated.timing(radarPulseAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(radarRotateAnim, { toValue: 1, duration: 6000, useNativeDriver: true })
    ).start();
  }, []);

  const radarSpin = radarRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Live GPS mobility stream around real user coordinates
  const { allUnits, isScanning } = useNearbyMobility(location);

  // Filter markers based on category and search query
  const mapMarkers = useMemo(() => {
    let source = allUnits && allUnits.length > 0 ? allUnits : drivers;

    if (activeCategory === 'drivers') {
      source = source.filter((u) => u.type === 'driver');
    } else if (activeCategory === 'cars') {
      source = source.filter((u) => u.type === 'car');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      source = source.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.vehicleModel?.toLowerCase().includes(q) ||
          u.type?.toLowerCase().includes(q)
      );
    }

    return source.map((d) => ({
      id: d.id,
      name: d.name,
      title: d.name,
      type: d.type || 'driver',
      latitude: d.latitude || d.coordinates?.latitude || 13.6288,
      longitude: d.longitude || d.coordinates?.longitude || 79.2982,
      rating: d.rating || 4.8,
      avatar: d.avatar || d.profileImage,
      trustScore: d.trustScore || 94,
      isAIMatch: d.isAIMatch !== false,
      matchScore: d.matchScore || 96,
      trips: d.trips || d.completedTrips || 128,
      hourlyRate: d.hourlyRate || 150,
      dailyPrice: d.dailyPrice || 800,
      status: d.status || 'AVAILABLE',
      distanceKm: d.distanceKm || 1.6,
    }));
  }, [allUnits, drivers, activeCategory, searchQuery]);

  // Top AI Recommended Driver
  const topAIRecommended = useMemo(() => {
    return (
      mapMarkers.find((m) => m.isAIMatch && m.type === 'driver') ||
      mapMarkers.find((m) => m.type === 'driver') ||
      drivers[0]
    );
  }, [mapMarkers, drivers]);

  const selectedUnit = useMemo(() => {
    return mapMarkers.find((m) => m.id === selectedUnitId) || null;
  }, [mapMarkers, selectedUnitId]);

  // Active in-progress booking (if any)
  const activeBooking = useMemo(() => {
    return (bookings || []).find((b) =>
      ['confirmed', 'driver_arriving', 'driver_arrived', 'trip_started', 'in_progress'].includes(b?.status)
    );
  }, [bookings]);

  // --- FULL SCREEN SATELLITE MAP VIEW ---
  if (isMapOpen) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* Real Satellite/Hybrid Geographic Map */}
        <View style={styles.mapWrapper}>
          <LiveMobilityMap
            userLocation={location}
            markers={mapMarkers}
            selectedMarkerId={selectedUnitId}
            onSelectMarker={(unit) => setSelectedUnitId(unit.id)}
            onBookUnit={(unit) => {
              if (unit.type === 'driver') {
                navigation.navigate('Booking', { serviceType: 'driver', driver: unit });
              } else {
                navigation.navigate('Booking', { serviceType: 'car', car: unit });
              }
            }}
            onViewDetails={(unit) => {
              if (unit.type === 'driver') {
                navigation.navigate('DriverDetails', { driver: unit });
              } else {
                navigation.navigate('CarDetails', { car: unit });
              }
            }}
            isScanning={isScanning}
            showControls={true}
            showBottomSheet={true}
            autoSelectAIMatch={true}
          />
        </View>

        {/* Floating Top Controls with Back to Hub Button */}
        <SafeAreaView style={styles.topSafeArea}>
          <View style={[styles.topOverlay, { maxWidth: isMobile ? '100%' : 720, alignSelf: 'center', width: '100%' }]}>
            <View style={styles.locationPillRow}>
              {/* Back to Hub Dashboard Button */}
              <TouchableOpacity
                style={styles.backToHubBtn}
                onPress={() => {
                  triggerHaptic('light');
                  setIsMapOpen(false);
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={16} color="#050814" />
                <Text style={styles.backToHubText}>HUB</Text>
              </TouchableOpacity>

              {/* Location Pill */}
              <TouchableOpacity
                style={styles.locationPill}
                onPress={() => {
                  triggerHaptic('light');
                  refreshLocation();
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="location-sharp" size={14} color={COLORS.cyan} />
                <Text style={styles.locationPillText} numberOfLines={1}>
                  {location.address?.split(',')[0] || 'Tirupati, AP'}
                </Text>
                <Ionicons name="chevron-down" size={12} color={COLORS.cyan} />
              </TouchableOpacity>

              <View style={styles.headerRightActions}>
                {activeBooking && (
                  <TouchableOpacity
                    style={styles.activeTripTag}
                    onPress={() => navigation.navigate('ActiveTrip', { booking: activeBooking })}
                    activeOpacity={0.8}
                  >
                    <View style={styles.liveTripDot} />
                    <Text style={styles.activeTripText}>ACTIVE</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.profileBtn}
                  onPress={() => navigation.navigate('ProfileTab')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="person-circle" size={24} color={COLORS.cyan} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Floating Search Bar */}
            <View style={styles.searchBarContainer}>
              <Ionicons name="search" size={17} color={COLORS.cyan} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search drivers, cars or locations"
                placeholderTextColor="rgba(255, 255, 255, 0.45)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 ? (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={16} color="rgba(255, 255, 255, 0.5)" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.searchFilterBtn}
                  onPress={() => navigation.navigate('NearbyDrivers')}
                >
                  <Ionicons name="options-outline" size={16} color={COLORS.cyan} />
                </TouchableOpacity>
              )}
            </View>

            {/* Category Filter Chips */}
            <View style={styles.chipsRow}>
              <TouchableOpacity
                style={[styles.chip, activeCategory === 'all' && styles.chipActive]}
                onPress={() => {
                  triggerHaptic('light');
                  setActiveCategory('all');
                }}
              >
                <Text style={[styles.chipText, activeCategory === 'all' && styles.chipTextActive]}>
                  ⚡ All Mobility
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.chip, activeCategory === 'drivers' && styles.chipActive]}
                onPress={() => {
                  triggerHaptic('light');
                  setActiveCategory('drivers');
                }}
              >
                <Text style={[styles.chipText, activeCategory === 'drivers' && styles.chipTextActive]}>
                  👨‍✈️ Drivers
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.chip, activeCategory === 'cars' && styles.chipActive]}
                onPress={() => {
                  triggerHaptic('light');
                  setActiveCategory('cars');
                }}
              >
                <Text style={[styles.chipText, activeCategory === 'cars' && styles.chipTextActive]}>
                  🚗 Rental Cars
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chipCombo}
                onPress={() => navigation.navigate('CarDriver')}
              >
                <Text style={styles.chipComboText}>🚘 Combo (15% Off)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        {/* Compact AI Recommendation Card on Map */}
        {!selectedUnit && topAIRecommended && (
          <View style={[styles.bottomCardWrap, { maxWidth: isMobile ? '100%' : 680, alignSelf: 'center', width: '100%' }]}>
            <TouchableOpacity
              style={styles.aiCompactCard}
              onPress={() => {
                triggerHaptic('impactLight');
                setSelectedUnitId(topAIRecommended.id);
              }}
              activeOpacity={0.9}
            >
              <View style={styles.aiCompactHeader}>
                <View style={styles.aiBadgeRow}>
                  <Text style={styles.robotEmoji}>🤖</Text>
                  <Text style={styles.aiBadgeTitle}>AI MATCH HIGHLIGHT</Text>
                </View>
                <View style={styles.scorePill}>
                  <Ionicons name="sparkles" size={10} color={COLORS.cyan} />
                  <Text style={styles.scoreText}>{topAIRecommended.matchScore || 96}% MATCH</Text>
                </View>
              </View>

              <View style={styles.aiCompactBody}>
                <View style={styles.compactAvatarWrap}>
                  <Ionicons name="person" size={20} color={COLORS.cyan} />
                </View>

                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.compactDriverName}>{topAIRecommended.name}</Text>
                  <View style={styles.compactMetaRow}>
                    <Text style={styles.compactMetaText}>⭐ {topAIRecommended.rating || 4.8}</Text>
                    <Text style={styles.compactDot}>•</Text>
                    <Text style={styles.compactMetaText}>📍 {topAIRecommended.distanceKm || 1.6} km</Text>
                    <Text style={styles.compactDot}>•</Text>
                    <Text style={styles.compactPrice}>₹{topAIRecommended.dailyPrice || 800}/day</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.compactBookBtn}
                  onPress={() => {
                    triggerHaptic('impactMedium');
                    navigation.navigate('Booking', { serviceType: 'driver', driver: topAIRecommended });
                  }}
                >
                  <Text style={styles.compactBookText}>BOOK</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <TrustDeltaCelebrationModal
          visible={!!latestTrustDelta}
          trustDelta={latestTrustDelta}
          onClose={() => setLatestTrustDelta(null)}
        />
      </View>
    );
  }

  // --- DEFAULT: HUB DASHBOARD VIEW ---
  return (
    <AnimatedSpatialBackground>
      <SafeAreaView style={styles.hubSafeContainer}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <ScrollView
          style={styles.hubScrollView}
          contentContainerStyle={[
            styles.hubContent,
            {
              maxWidth: maxContentWidth,
              alignSelf: 'center',
              width: '100%',
              paddingHorizontal: isMobile ? 16 : gutter,
              paddingBottom: isMobile ? 80 : 100,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Header with Avatar, Greeting & Real-time GPS Location */}
          <LocationHeader
            onProfilePress={() => navigation.navigate('ProfileTab')}
            onLocationPress={refreshLocation}
          />

          {/* Active Trip Banner if In-Progress */}
          {activeBooking && (
            <TouchableOpacity
              style={styles.activeTripBanner}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('ActiveTrip', { booking: activeBooking })}
            >
              <LinearGradient
                colors={['rgba(16, 185, 129, 0.25)', 'rgba(6, 78, 59, 0.4)']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
              <View style={styles.activeTripLeft}>
                <View style={styles.activePulseRing}>
                  <View style={styles.liveTripDotLarge} />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.activeBannerTitle}>MISSION IN PROGRESS</Text>
                  <Text style={styles.activeBannerSub}>
                    {activeBooking.driver?.name || 'Driver'} is on route • Tap for live tracking
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#10B981" />
            </TouchableOpacity>
          )}

          {/* 2. Cyber Search Bar */}
          <View style={styles.hubSearchContainer}>
            <Ionicons name="search" size={18} color={COLORS.cyan} style={styles.searchIcon} />
            <TextInput
              style={styles.hubSearchInput}
              placeholder="Search drivers, rental cars, or locations..."
              placeholderTextColor="rgba(255, 255, 255, 0.45)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => navigation.navigate('NearbyDrivers')}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color="rgba(255, 255, 255, 0.5)" />
              </TouchableOpacity>
            )}
          </View>

          {/* 3. Primary Mobility Services Grid (Drivers, Cars, Combo) */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>MOBILITY SERVICES</Text>
            <Text style={styles.sectionSubtitle}>VERIFIED URBAN DISPATCH</Text>
          </View>

          <View style={isMobile ? styles.servicesGrid : styles.servicesGridDesktop}>
            {/* Service 1: Verified Drivers */}
            <TouchableOpacity
              style={styles.serviceCard}
              activeOpacity={0.85}
              onPress={() => {
                triggerHaptic('impactLight');
                navigation.navigate('NearbyDrivers');
              }}
            >
              <LinearGradient
                colors={['rgba(0, 242, 254, 0.16)', 'rgba(9, 14, 28, 0.9)']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.serviceIconWrapCyan}>
                <Ionicons name="person" size={22} color={COLORS.cyan} />
              </View>
              <View style={styles.serviceBadgeCyan}>
                <Text style={styles.serviceBadgeText}>INSTANT DISPATCH</Text>
              </View>
              <Text style={styles.serviceCardTitle}>Hire Driver</Text>
              <Text style={styles.serviceCardDesc}>
                Police-verified chauffeurs by hour or day.
              </Text>
              <View style={styles.serviceFooterRow}>
                <Text style={styles.servicePriceTag}>From ₹150/hr</Text>
                <Ionicons name="arrow-forward-circle" size={20} color={COLORS.cyan} />
              </View>
            </TouchableOpacity>

            {/* Service 2: Self-Drive Rental Cars */}
            <TouchableOpacity
              style={styles.serviceCard}
              activeOpacity={0.85}
              onPress={() => {
                triggerHaptic('impactLight');
                navigation.navigate('NearbyCars');
              }}
            >
              <LinearGradient
                colors={['rgba(129, 140, 248, 0.18)', 'rgba(9, 14, 28, 0.9)']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.serviceIconWrapViolet}>
                <Ionicons name="car-sport" size={22} color={COLORS.aiPurple} />
              </View>
              <View style={styles.serviceBadgeViolet}>
                <Text style={styles.serviceBadgeText}>SELF-DRIVE</Text>
              </View>
              <Text style={styles.serviceCardTitle}>Rental Cars</Text>
              <Text style={styles.serviceCardDesc}>
                SUVs, Sedans & EVs with zero-deposit options.
              </Text>
              <View style={styles.serviceFooterRow}>
                <Text style={styles.servicePriceTagViolet}>From ₹1,800/day</Text>
                <Ionicons name="arrow-forward-circle" size={20} color={COLORS.aiPurple} />
              </View>
            </TouchableOpacity>

            {/* Service 3 on Desktop / Tablet: In-Grid Synergy Card */}
            {!isMobile && (
              <TouchableOpacity
                style={[styles.serviceCard, styles.comboServiceCard]}
                activeOpacity={0.85}
                onPress={() => {
                  triggerHaptic('impactLight');
                  navigation.navigate('CarDriver');
                }}
              >
                <LinearGradient
                  colors={['rgba(245, 158, 11, 0.22)', 'rgba(236, 72, 153, 0.12)', 'rgba(9, 14, 28, 0.95)']}
                  style={StyleSheet.absoluteFillObject}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <View style={styles.serviceIconWrapGold}>
                  <Ionicons name="flash" size={22} color="#F59E0B" />
                </View>
                <View style={styles.serviceBadgeGold}>
                  <Text style={styles.serviceBadgeText}>15% SYNERGY OFF</Text>
                </View>
                <Text style={styles.serviceCardTitle}>Car + Driver</Text>
                <Text style={styles.serviceCardDesc}>
                  Bundled vehicle & verified driver package.
                </Text>
                <View style={styles.serviceFooterRow}>
                  <Text style={styles.servicePriceTagGold}>Save ₹400/day</Text>
                  <Ionicons name="arrow-forward-circle" size={20} color="#F59E0B" />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Service 3: Car + Driver Combo (Banner Style on Mobile screens only) */}
          {isMobile && (
            <TouchableOpacity
              style={styles.comboBannerCard}
              activeOpacity={0.88}
              onPress={() => {
                triggerHaptic('impactLight');
                navigation.navigate('CarDriver');
              }}
            >
              <LinearGradient
                colors={['rgba(245, 158, 11, 0.22)', 'rgba(236, 72, 153, 0.12)', 'rgba(9, 14, 28, 0.95)']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.comboBannerContent}>
                <View style={styles.comboBadgeRow}>
                  <View style={styles.comboSavePill}>
                    <Ionicons name="flash" size={11} color="#050814" />
                    <Text style={styles.comboSaveText}>15% SYNERGY DISCOUNT</Text>
                  </View>
                  <Text style={styles.comboTierText}>ALL-IN-ONE PACKAGE</Text>
                </View>
                <Text style={styles.comboTitle}>Car + Chauffeur Combo</Text>
                <Text style={styles.comboDesc}>
                  Premium vehicle + professional driver bundled seamlessly for worry-free travel.
                </Text>
                <View style={styles.comboActionRow}>
                  <Text style={styles.comboPriceHighlight}>Save up to ₹400/day</Text>
                  <View style={styles.comboBtnPill}>
                    <Text style={styles.comboBtnText}>Book Synergy</Text>
                    <Ionicons name="chevron-forward" size={14} color="#050814" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* 4. Live Mobility Radar Preview Card with "Open Live Map" Button */}
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={styles.livePulseDot} />
              <Text style={styles.sectionTitle}>LIVE RADAR DISPATCH</Text>
            </View>
            <Text style={styles.activeCountTag}>
              {allUnits?.length || 8} UNITS ACTIVE NEARBY
            </Text>
          </View>

          <TouchableOpacity
            style={styles.radarCard}
            activeOpacity={0.9}
            onPress={() => {
              triggerHaptic('impactMedium');
              setIsMapOpen(true);
            }}
          >
            <LinearGradient
              colors={['rgba(14, 26, 52, 0.92)', 'rgba(6, 12, 28, 0.98)']}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Radar Cyber Grid Background & Animated Sweep */}
            <View style={styles.radarGridVisual}>
              <Animated.View
                style={[
                  styles.radarSweepLine,
                  {
                    transform: [{ rotate: radarSpin }],
                  },
                ]}
              />

              {/* Pulsing Concentric Radar Rings */}
              <Animated.View
                style={[
                  styles.radarPulseRingOuter,
                  { transform: [{ scale: radarPulseAnim }] },
                ]}
              />
              <View style={styles.radarRingMiddle} />
              <View style={styles.radarRingCenter}>
                <Ionicons name="navigate" size={16} color={COLORS.cyan} />
              </View>

              {/* Simulated active blips around user */}
              <View style={[styles.radarBlip, { top: '25%', left: '30%' }]}>
                <Ionicons name="person" size={10} color="#FFFFFF" />
              </View>
              <View style={[styles.radarBlipCar, { top: '35%', right: '28%' }]}>
                <Ionicons name="car" size={10} color="#050814" />
              </View>
              <View style={[styles.radarBlip, { bottom: '28%', left: '42%' }]}>
                <Ionicons name="person" size={10} color="#FFFFFF" />
              </View>
              <View style={[styles.radarBlipCar, { bottom: '22%', right: '35%' }]}>
                <Ionicons name="car" size={10} color="#050814" />
              </View>
            </View>

            {/* Radar Overlay Info & Action */}
            <View style={styles.radarOverlayContent}>
              <View style={styles.radarHeaderRow}>
                <View style={styles.radarLiveBadge}>
                  <View style={styles.liveGreenDot} />
                  <Text style={styles.radarLiveText}>SATELLITE TELEMETRY ACTIVE</Text>
                </View>
                <Text style={styles.radarCoordText}>
                  {location.latitude.toFixed(3)}°N • {location.longitude.toFixed(3)}°E
                </Text>
              </View>

              <Text style={styles.radarHeadline}>
                Real-Time GPS Mobility Stream
              </Text>
              <Text style={styles.radarBodyText}>
                View verified chauffeurs & self-drive cars moving live on satellite hybrid map with 3D terrain pitch.
              </Text>

              {/* Primary "OPEN LIVE MAP" Button */}
              <TouchableOpacity
                style={styles.openMapPrimaryBtn}
                activeOpacity={0.85}
                onPress={() => {
                  triggerHaptic('impactMedium');
                  setIsMapOpen(true);
                }}
              >
                <LinearGradient
                  colors={['#00F2FE', '#0284C7']}
                  style={StyleSheet.absoluteFillObject}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <Ionicons name="map" size={18} color="#050814" />
                <Text style={styles.openMapPrimaryText}>OPEN LIVE MAP</Text>
                <Ionicons name="chevron-forward" size={16} color="#050814" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          {/* 5. AI Recommended Driver of the Moment */}
          {topAIRecommended && (
            <View style={styles.aiSectionWrap}>
              <View style={styles.sectionHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 14 }}>🤖</Text>
                  <Text style={styles.sectionTitle}>TOP AI RECOMMENDATION</Text>
                </View>
                <View style={styles.matchScorePill}>
                  <Ionicons name="sparkles" size={11} color={COLORS.cyan} />
                  <Text style={styles.matchScoreText}>
                    {topAIRecommended.matchScore || 96}% MATCH
                  </Text>
                </View>
              </View>

              <RecommendationCard
                item={topAIRecommended}
                type="driver"
                onPress={(item) => navigation.navigate('DriverDetails', { driver: item })}
                onBookPress={(item) =>
                  navigation.navigate('Booking', { serviceType: 'driver', driver: item })
                }
              />
            </View>
          )}

          {/* 6. Dynamic Trust & Safety Matrix */}
          <View style={styles.trustMatrixCard}>
            <LinearGradient
              colors={['rgba(16, 185, 129, 0.12)', 'rgba(9, 14, 28, 0.9)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.trustHeaderRow}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              <Text style={styles.trustHeaderTitle}>DRIVENEARBY TRUST MATRIX</Text>
            </View>
            <View style={styles.trustPointsRow}>
              <View style={styles.trustPoint}>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                <Text style={styles.trustPointText}>Police Verified IDs</Text>
              </View>
              <View style={styles.trustPoint}>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                <Text style={styles.trustPointText}>Live GPS Tracking</Text>
              </View>
              <View style={styles.trustPoint}>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                <Text style={styles.trustPointText}>Dynamic Trust Score</Text>
              </View>
            </View>
          </View>

          {/* Bottom spacing for Tab bar */}
          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Floating Quick Map Trigger (FAB) */}
        <TouchableOpacity
          style={styles.floatingMapFab}
          activeOpacity={0.88}
          onPress={() => {
            triggerHaptic('impactLight');
            setIsMapOpen(true);
          }}
        >
          <LinearGradient
            colors={['#00F2FE', '#0891B2']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Ionicons name="map" size={17} color="#050814" />
          <Text style={styles.floatingMapFabText}>Live Map</Text>
        </TouchableOpacity>

        {/* Trust Delta Celebration Modal */}
        <TrustDeltaCelebrationModal
          visible={!!latestTrustDelta}
          trustDelta={latestTrustDelta}
          onClose={() => setLatestTrustDelta(null)}
        />
      </SafeAreaView>
    </AnimatedSpatialBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050814',
    position: 'relative',
  },

  // Map Screen Styles
  mapWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  topSafeArea: {
    zIndex: 20,
    pointerEvents: 'box-none',
  },
  topOverlay: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 6 : 6,
    gap: 8,
    pointerEvents: 'box-none',
  },
  locationPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  backToHubBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.cyan,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  backToHubText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#050814',
    letterSpacing: 0.5,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(5, 8, 20, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    flex: 1,
    maxWidth: '55%',
  },
  locationPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
    flex: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeTripTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },
  liveTripDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  activeTripText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.6,
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(5, 8, 20, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 8, 20, 0.92)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 254, 0.45)',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 46,
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingVertical: 0,
  },
  searchFilterBtn: {
    padding: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(5, 8, 20, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  chipActive: {
    backgroundColor: 'rgba(0, 242, 254, 0.18)',
    borderColor: COLORS.cyan,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  chipTextActive: {
    color: COLORS.cyan,
  },
  chipCombo: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  chipComboText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F59E0B',
  },
  bottomCardWrap: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    right: 14,
    zIndex: 25,
  },
  aiCompactCard: {
    backgroundColor: 'rgba(5, 8, 20, 0.94)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 254, 0.5)',
    borderRadius: 18,
    padding: 12,
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  aiCompactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  aiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  robotEmoji: {
    fontSize: 13,
  },
  aiBadgeTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.8,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.cyan,
  },
  aiCompactBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactAvatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactDriverName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  compactMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  compactMetaText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  compactDot: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  compactPrice: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.cyan,
  },
  compactBookBtn: {
    backgroundColor: COLORS.cyan,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  compactBookText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#050814',
    letterSpacing: 0.6,
  },

  // --- HUB DASHBOARD STYLES ---
  hubSafeContainer: {
    flex: 1,
  },
  hubScrollView: {
    flex: 1,
  },
  hubContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 6 : 8,
    paddingBottom: 24,
    gap: 16,
  },
  activeTripBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#10B981',
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  activeTripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activePulseRing: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveTripDotLarge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
  },
  activeBannerTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.7,
  },
  activeBannerSub: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  hubSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 21, 37, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
  },
  hubSearchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingVertical: 0,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.8,
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 0.5,
  },
  activeCountTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.5,
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.cyan,
  },
  servicesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  servicesGridDesktop: {
    flexDirection: 'row',
    gap: 16,
  },
  comboServiceCard: {
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  serviceIconWrapGold: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceBadgeGold: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 8,
  },
  servicePriceTagGold: {
    fontSize: 11,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 0.3,
  },
  serviceCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 14,
    overflow: 'hidden',
    minHeight: 160,
    justifyContent: 'space-between',
  },
  serviceIconWrapCyan: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIconWrapViolet: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(129, 140, 248, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceBadgeCyan: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 242, 254, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 8,
  },
  serviceBadgeViolet: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(129, 140, 248, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 8,
  },
  serviceBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  serviceCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 6,
  },
  serviceCardDesc: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 15,
    marginTop: 2,
  },
  serviceFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  servicePriceTag: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.cyan,
  },
  servicePriceTagViolet: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.aiPurple,
  },
  comboBannerCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    overflow: 'hidden',
  },
  comboBannerContent: {
    padding: 16,
    gap: 6,
  },
  comboBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  comboSavePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  comboSaveText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#050814',
    letterSpacing: 0.5,
  },
  comboTierText: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.5,
  },
  comboTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  comboDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: 16,
  },
  comboActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  comboPriceHighlight: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F59E0B',
  },
  comboBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  comboBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#050814',
  },

  // Radar Preview Card
  radarCard: {
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 254, 0.35)',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  radarGridVisual: {
    height: 140,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(3, 7, 18, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 242, 254, 0.15)',
    overflow: 'hidden',
  },
  radarSweepLine: {
    position: 'absolute',
    width: 220,
    height: 2,
    backgroundColor: COLORS.cyan,
    shadowColor: COLORS.cyan,
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  radarPulseRingOuter: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
  },
  radarRingMiddle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.45)',
  },
  radarRingCenter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 242, 254, 0.2)',
    borderWidth: 1.5,
    borderColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  radarBlip: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 242, 254, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.cyan,
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  radarBlipCar: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.cyan,
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  radarOverlayContent: {
    padding: 16,
    gap: 8,
  },
  radarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radarLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  radarLiveText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.6,
  },
  radarCoordText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  radarHeadline: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  radarBodyText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: 17,
  },
  openMapPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 6,
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  openMapPrimaryText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#050814',
    letterSpacing: 0.8,
  },

  // AI Section
  aiSectionWrap: {
    gap: 10,
  },
  matchScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  matchScoreText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.cyan,
  },

  // Trust Matrix
  trustMatrixCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    padding: 14,
    overflow: 'hidden',
    gap: 10,
  },
  trustHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustHeaderTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#10B981',
    letterSpacing: 0.8,
  },
  trustPointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trustPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  trustPointText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
  },

  // Floating FAB for instant map access
  floatingMapFab: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 99,
  },
  floatingMapFabText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#050814',
    letterSpacing: 0.5,
  },
});

export default HomeScreen;
