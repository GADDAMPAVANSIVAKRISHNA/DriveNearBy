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
import { triggerHaptic } from '../../utils/haptics';

export const BookingsScreen = ({ navigation }) => {
  const { bookings } = useBookings();
  const [filterTab, setFilterTab] = useState('All');

  const tabs = ['All', 'Active', 'Completed', 'Cancelled'];

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
          data={filteredBookings}
          keyExtractor={(item) => item.id || item.bookingId}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
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
          )}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-outline"
              title="No Missions in this Stream"
              subtitle="Deploy a nearby chauffeur pilot or reserve a rental unit from the Orbit HUD."
              buttonTitle="Explore Mobility Fleet"
              onButtonPress={() => navigation.navigate('HomeTab')}
            />
          }
        />
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
  },
  counterText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1,
  },
  tabBar: {
    flexDirection: 'row',
    gap: 8,
  },
  tabItem: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: SIZES.radiusMd,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabItemActive: {
    backgroundColor: COLORS.cyan,
    borderColor: COLORS.cyan,
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.7,
    shadowRadius: 8,
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
    padding: 16,
    paddingBottom: 32,
  },
});

export default BookingsScreen;
