import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import AnimatedSpatialBackground from '../../components/AnimatedSpatialBackground';
import DriverCard from '../../components/DriverCard';
import CarCard from '../../components/CarCard';
import ComboCard from '../../components/ComboCard';
import SearchBar from '../../components/SearchBar';
import { useBookings } from '../../context/BookingContext';
import { useResponsive } from '../../hooks/useResponsive';
import { triggerHaptic } from '../../utils/haptics';

export const ExploreScreen = ({ navigation }) => {
  const { drivers, cars, combos } = useBookings();
  const { isMobile, isTablet, isDesktop, gridColumns, maxContentWidth, gutter } = useResponsive();
  const [activeTab, setActiveTab] = useState('drivers');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { key: 'drivers', label: '👨‍✈️ CHAUFFEURS', count: drivers.length },
    { key: 'cars', label: '🚗 FLEET', count: cars.length },
    { key: 'combos', label: '🚘 SYNERGY', count: combos.length },
  ];

  return (
    <AnimatedSpatialBackground>
      <SafeAreaView style={styles.safeArea}>
        {/* Responsive Centered Content Container */}
        <View style={[styles.responsiveShell, { maxWidth: maxContentWidth, paddingHorizontal: isMobile ? 12 : gutter }]}>
          {/* Top Header */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>MOBILITY FLEET</Text>
                <Text style={styles.headerSubtitle}>GLOBAL DISPATCH MATRIX • BENGALURU SECTOR</Text>
              </View>
              <View style={styles.activePill}>
                <View style={styles.pulseDot} />
                <Text style={styles.activePillText}>ONLINE</Text>
              </View>
            </View>

            {/* Search Field */}
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={`Search ${activeTab} by name or location...`}
              style={{ marginBottom: 0, marginTop: 4 }}
            />
          </View>

          {/* Segmented Switcher */}
          <View style={styles.tabsRow}>
            {tabs.map((tab) => {
              const isSelected = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  activeOpacity={0.8}
                  onPress={() => {
                    triggerHaptic('impactLight');
                    setActiveTab(tab.key);
                  }}
                  style={[styles.tabBtn, isSelected && styles.tabBtnActive]}
                >
                  <Text style={[styles.tabBtnText, isSelected && styles.tabBtnTextActive]}>
                    {tab.label} ({tab.count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tab Content List with Responsive Auto-Grid */}
          <View style={styles.contentWrap}>
            {activeTab === 'drivers' && (
              <FlatList
                key={`grid-drivers-${gridColumns}`}
                data={drivers.filter((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()))}
                keyExtractor={(item) => item.id}
                numColumns={gridColumns}
                columnWrapperStyle={gridColumns > 1 ? styles.gridRow : null}
                contentContainerStyle={[styles.listPadding, { paddingBottom: isMobile ? 80 : 96 }]}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={gridColumns > 1 ? styles.gridColItem : styles.singleColItem}>
                    <DriverCard
                      driver={item}
                      onViewDetails={(drv) => navigation.navigate('DriverDetails', { driver: drv })}
                      onBook={(drv) => navigation.navigate('Booking', { serviceType: 'driver', driver: drv })}
                    />
                  </View>
                )}
              />
            )}

            {activeTab === 'cars' && (
              <FlatList
                key={`grid-cars-${gridColumns}`}
                data={cars.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))}
                keyExtractor={(item) => item.id}
                numColumns={gridColumns}
                columnWrapperStyle={gridColumns > 1 ? styles.gridRow : null}
                contentContainerStyle={[styles.listPadding, { paddingBottom: isMobile ? 80 : 96 }]}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={gridColumns > 1 ? styles.gridColItem : styles.singleColItem}>
                    <CarCard
                      car={item}
                      onViewDetails={(c) => navigation.navigate('CarDetails', { car: c })}
                      onRent={(c) => navigation.navigate('Booking', { serviceType: 'car', car: c })}
                    />
                  </View>
                )}
              />
            )}

            {activeTab === 'combos' && (
              <FlatList
                key={`grid-combos-${gridColumns}`}
                data={combos.filter((cmb) =>
                  cmb.driver?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  cmb.car?.name?.toLowerCase().includes(searchQuery.toLowerCase())
                )}
                keyExtractor={(item) => item.id}
                numColumns={gridColumns}
                columnWrapperStyle={gridColumns > 1 ? styles.gridRow : null}
                contentContainerStyle={[styles.listPadding, { paddingBottom: isMobile ? 80 : 96 }]}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={gridColumns > 1 ? styles.gridColItem : styles.singleColItem}>
                    <ComboCard
                      combo={item}
                      onBook={(cmb) =>
                        navigation.navigate('Booking', {
                          serviceType: 'combo',
                          driver: cmb.driver,
                          car: cmb.car,
                        })
                      }
                    />
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
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
  responsiveShell: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 1.2,
  },
  headerSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.cyan,
    letterSpacing: 1,
    marginTop: 2,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.neonGreen,
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.neonGreen,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.neonGreen,
    letterSpacing: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: SIZES.radiusMd,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabBtnActive: {
    backgroundColor: COLORS.cyan,
    borderColor: COLORS.cyan,
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  tabBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
  },
  tabBtnTextActive: {
    color: '#050814',
    fontWeight: '900',
  },
  contentWrap: {
    flex: 1,
  },
  listPadding: {
    paddingVertical: 14,
  },
  gridRow: {
    gap: 16,
    justifyContent: 'flex-start',
  },
  gridColItem: {
    flex: 1,
    minWidth: 260,
  },
  singleColItem: {
    width: '100%',
  },
});

export default ExploreScreen;
