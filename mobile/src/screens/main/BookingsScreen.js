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
import BookingCard from '../../components/BookingCard';
import { EmptyState } from '../../components/LoadingState';
import { useBookings } from '../../context/BookingContext';
import { useResponsive } from '../../hooks/useResponsive';
import { triggerHaptic } from '../../utils/haptics';

export const BookingsScreen = ({ navigation }) => {
  const { bookings } = useBookings();
  const { isMobile, isTablet, isDesktop, maxContentWidth, gutter } = useResponsive();
  const [filterTab, setFilterTab] = useState('All');

  const tabs = ['All', 'Active', 'Completed', 'Cancelled'];
  const columns = isDesktop || isTablet ? 2 : 1;

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 'All') return true;
    if (filterTab === 'Active') {
      return ['confirmed', 'driver_arriving', 'driver_arrived', 'trip_started', 'in_progress'].includes(b.status);
    }
    if (filterTab === 'Completed') {
      return b.status === 'trip_completed';
    }
    if (filterTab === 'Cancelled') {
      return b.status === 'cancelled';
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <AnimatedSpatialBackground />

      <SafeAreaView style={styles.safeArea}>
        {/* Responsive Centered Shell */}
        <View style={[styles.responsiveShell, { maxWidth: maxContentWidth, paddingHorizontal: isMobile ? 12 : gutter }]}>
          {/* Top Telemetry Header */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.headerTitle}>MISSION LOGS</Text>
                <Text style={styles.headerSubtitle}>MOBILITY JOURNEY TELEMETRY & BOOKINGS</Text>
              </View>
              <View style={styles.counterBadge}>
                <Text style={styles.counterText}>{filteredBookings.length} MISSIONS</Text>
              </View>
            </View>

            {/* Futuristic Segmented Tabs */}
            <View style={styles.tabBar}>
              {tabs.map((tab) => {
                const isSelected = filterTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => {
                      triggerHaptic('impactLight');
                      setFilterTab(tab);
                    }}
                    style={[styles.tabItem, isSelected && styles.tabItemActive]}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                      {tab.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <FlatList
            key={`bookings-grid-${columns}`}
            data={filteredBookings}
            keyExtractor={(item) => item.id || item.bookingId}
            numColumns={columns}
            columnWrapperStyle={columns > 1 ? styles.gridRow : null}
            contentContainerStyle={[styles.listContent, { paddingBottom: isMobile ? 80 : 96 }]}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={columns > 1 ? styles.gridColItem : styles.singleColItem}>
                <BookingCard
                  booking={item}
                  onPress={() => {
                    if (['confirmed', 'driver_arriving', 'driver_arrived', 'trip_started', 'in_progress'].includes(item.status)) {
                      navigation.navigate('ActiveTrip', { booking: item });
                    } else {
                      navigation.navigate('TripCompleted', { booking: item });
                    }
                  }}
                  onTrackPress={() => navigation.navigate('ActiveTrip', { booking: item })}
                  onRatePress={() => navigation.navigate('RatingReview', { booking: item })}
                />
              </View>
            )}
            ListEmptyComponent={
              <EmptyState
                icon="calendar-outline"
                title="No Missions in this Stream"
                subtitle="Explore available chauffeurs or vehicles in the Hub to initiate a dispatch."
              />
            }
          />
        </View>
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
  responsiveShell: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  counterBadge: {
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  counterText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: SIZES.radiusMd,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: SIZES.radiusSm,
  },
  tabItemActive: {
    backgroundColor: COLORS.cyan,
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
  },
  tabTextActive: {
    color: '#050814',
    fontWeight: '900',
  },
  listContent: {
    paddingVertical: 14,
    gap: 12,
  },
  gridRow: {
    gap: 14,
    justifyContent: 'flex-start',
  },
  gridColItem: {
    flex: 1,
    minWidth: 300,
  },
  singleColItem: {
    width: '100%',
  },
});

export default BookingsScreen;
