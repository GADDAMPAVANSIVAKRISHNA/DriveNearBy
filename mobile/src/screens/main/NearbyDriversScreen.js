import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import AnimatedSpatialBackground from '../../components/AnimatedSpatialBackground';
import DriverCard from '../../components/DriverCard';
import InteractiveMap from '../../components/InteractiveMap';
import SearchBar from '../../components/SearchBar';
import FilterModal from '../../components/FilterModal';
import { EmptyState } from '../../components/LoadingState';
import { useBookings } from '../../context/BookingContext';
import { useLocation } from '../../context/LocationContext';
import { useNearbyMobility } from '../../hooks/useNearbyMobility';
import { useResponsive } from '../../hooks/useResponsive';
import { triggerHaptic } from '../../utils/haptics';

export const NearbyDriversScreen = ({ navigation }) => {
  const { drivers } = useBookings();
  const { location } = useLocation();
  const { allUnits, isScanning } = useNearbyMobility(location);
  const { isMobile, isTablet, isDesktop, gridColumns, maxContentWidth, gutter } = useResponsive();

  const [viewMode, setViewMode] = useState('both');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [filters, setFilters] = useState({
    sortBy: 'ai_recommended',
    minRating: null,
    maxPrice: null,
  });

  // Merge live mobility coordinates if available
  const liveDrivers = drivers.map((d) => {
    const liveUnit = (allUnits || []).find((u) => u.id === d.id);
    if (liveUnit) {
      return {
        ...d,
        coordinates: {
          latitude: liveUnit.latitude,
          longitude: liveUnit.longitude,
        },
        distanceKm: liveUnit.distanceKm || d.distanceKm,
      };
    }
    return d;
  });

  let filteredDrivers = [...liveDrivers];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredDrivers = filteredDrivers.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.address?.toLowerCase().includes(q) ||
        d.vehicleSkills?.some((v) => v.toLowerCase().includes(q))
    );
  }

  if (filters.minRating) {
    filteredDrivers = filteredDrivers.filter((d) => d.rating >= filters.minRating);
  }
  if (filters.maxPrice) {
    filteredDrivers = filteredDrivers.filter((d) => (d.pricing?.perDay || 800) <= filters.maxPrice);
  }

  if (filters.sortBy === 'ai_recommended') {
    filteredDrivers.sort((a, b) => (b.aiMatchScore || 85) - (a.aiMatchScore || 85));
  } else if (filters.sortBy === 'distance') {
    filteredDrivers.sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (filters.sortBy === 'rating') {
    filteredDrivers.sort((a, b) => b.rating - a.rating);
  } else if (filters.sortBy === 'price_asc') {
    filteredDrivers.sort((a, b) => (a.pricing?.perDay || 800) - (b.pricing?.perDay || 800));
  } else if (filters.sortBy === 'price_desc') {
    filteredDrivers.sort((a, b) => (b.pricing?.perDay || 800) - (a.pricing?.perDay || 800));
  }

  const mapMarkers = filteredDrivers.map((d) => ({
    id: d.id,
    name: d.name,
    title: d.name,
    type: 'driver',
    latitude: d.coordinates?.latitude || (location.latitude + 0.005),
    longitude: d.coordinates?.longitude || (location.longitude + 0.005),
    rating: d.rating,
    avatar: d.profileImage,
    trustScore: d.trustScore || 94,
    isAIMatch: (d.aiMatchScore || 85) >= 90,
    matchScore: d.aiMatchScore || 96,
    trips: d.completedTrips || 128,
    hourlyRate: d.pricing?.perHour || 150,
    dailyPrice: d.pricing?.perDay || 800,
    status: d.availability ? 'AVAILABLE' : 'BUSY',
    distanceKm: d.distanceKm || 1.6,
  }));

  const activeFilterCount =
    (filters.sortBy !== 'ai_recommended' ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.maxPrice ? 1 : 0);

  return (
    <AnimatedSpatialBackground>
      <SafeAreaView style={styles.container}>
        <View style={[styles.responsiveShell, { maxWidth: maxContentWidth, paddingHorizontal: isMobile ? 12 : gutter }]}>
          {/* HUD Top Bar */}
          <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              triggerHaptic('light');
              navigation.goBack();
            }}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>CHAUFFEUR TELEMETRY</Text>
            <Text style={styles.headerSubtitle}>
              📍 RADAR: {location.address?.split(',')[0] || 'Indiranagar'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => {
              triggerHaptic('selection');
              setViewMode((prev) => (prev === 'both' ? 'list' : prev === 'list' ? 'map' : 'both'));
            }}
          >
            <Ionicons
              name={viewMode === 'map' ? 'list' : viewMode === 'list' ? 'scan-outline' : 'apps'}
              size={18}
              color={COLORS.cyan}
            />
          </TouchableOpacity>
        </View>

        {/* Search & Filter Bar */}
        <View style={styles.filterBar}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search driver by name, vehicle skills..."
            onFilterPress={() => {
              triggerHaptic('light');
              setFilterModalVisible(true);
            }}
            activeFilterCount={activeFilterCount}
            style={{ marginBottom: 0 }}
          />
        </View>

        {/* 3D Radar Map Section */}
        {(viewMode === 'both' || viewMode === 'map') && (
          <View style={[styles.mapContainer, viewMode === 'map' && { flex: 1, maxHeight: undefined }]}>
            <InteractiveMap
              userLocation={location}
              markers={mapMarkers}
              selectedMarkerId={selectedDriverId}
              onSelectMarker={(m) => {
                setSelectedDriverId(m.id);
              }}
              onBookUnit={(drv) => {
                const fullDrv = drivers.find((d) => d.id === drv.id) || drv;
                navigation.navigate('Booking', { serviceType: 'driver', driver: fullDrv });
              }}
              onViewDetails={(drv) => {
                const fullDrv = drivers.find((d) => d.id === drv.id) || drv;
                navigation.navigate('DriverDetails', { driver: fullDrv });
              }}
              height={viewMode === 'map' ? 520 : 220}
            />
          </View>
        )}

        {/* Driver List */}
        {viewMode !== 'map' && (
          <FlatList
            key={`drivers-grid-${gridColumns}`}
            data={filteredDrivers}
            keyExtractor={(item) => item.id}
            numColumns={gridColumns}
            columnWrapperStyle={gridColumns > 1 ? { gap: 16 } : null}
            contentContainerStyle={[styles.listContent, { paddingBottom: isMobile ? 80 : 100 }]}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.listMetaRow}>
                <Text style={styles.resultsCount}>
                  <Text style={{ fontWeight: '900', color: COLORS.cyan }}>{filteredDrivers.length}</Text> VERIFIED UNITS IN RANGE
                </Text>
                <Text style={styles.sortIndicator}>
                  {filters.sortBy === 'ai_recommended' ? '🤖 AI OPTIMIZED' : filters.sortBy.toUpperCase()}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={gridColumns > 1 ? { flex: 1, minWidth: 280 } : { width: '100%' }}>
                <DriverCard
                  driver={item}
                  onViewDetails={(drv) => navigation.navigate('DriverDetails', { driver: drv })}
                  onBook={(drv) => navigation.navigate('Booking', { serviceType: 'driver', driver: drv })}
                />
              </View>
            )}
            ListEmptyComponent={
              <EmptyState
                icon="person-remove-outline"
                title="No Drivers Matching Query"
                subtitle="Try resetting filter limits or expanding your radar range."
                buttonTitle="Reset Filters"
                onButtonPress={() =>
                  setFilters({ sortBy: 'ai_recommended', minRating: null, maxPrice: null })
                }
              />
            }
          />
        )}
        </View>

        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          filters={filters}
          onApply={(newFilters) => setFilters(newFilters)}
          type="driver"
        />
      </SafeAreaView>
    </AnimatedSpatialBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  responsiveShell: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
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
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontSize: 10,
    color: COLORS.cyan,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  toggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
  },
  filterBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  mapContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
    maxHeight: 190,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  listMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  sortIndicator: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.5,
  },
});

export default NearbyDriversScreen;
