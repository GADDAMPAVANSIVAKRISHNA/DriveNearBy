import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import AnimatedSpatialBackground from '../../components/AnimatedSpatialBackground';
import CarCard from '../../components/CarCard';
import SearchBar from '../../components/SearchBar';
import FilterModal from '../../components/FilterModal';
import { EmptyState } from '../../components/LoadingState';
import { useBookings } from '../../context/BookingContext';
import { useLocation } from '../../context/LocationContext';
import { triggerHaptic } from '../../utils/haptics';

export const NearbyCarsScreen = ({ navigation }) => {
  const { cars } = useBookings();
  const { location } = useLocation();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'ai_recommended',
    minRating: null,
    maxPrice: null,
  });

  const categories = ['All', 'SUV', 'Compact SUV', 'Sedan', 'Electric'];

  let filteredCars = [...cars];

  if (selectedCategory !== 'All') {
    filteredCars = filteredCars.filter((c) =>
      c.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredCars = filteredCars.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.fuelType.toLowerCase().includes(q)
    );
  }

  if (filters.minRating) {
    filteredCars = filteredCars.filter((c) => c.rating >= filters.minRating);
  }
  if (filters.maxPrice) {
    filteredCars = filteredCars.filter((c) => c.pricePerDay <= filters.maxPrice);
  }

  if (filters.sortBy === 'ai_recommended') {
    filteredCars.sort((a, b) => (b.aiMatchScore || 85) - (a.aiMatchScore || 85));
  } else if (filters.sortBy === 'distance') {
    filteredCars.sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (filters.sortBy === 'rating') {
    filteredCars.sort((a, b) => b.rating - a.rating);
  } else if (filters.sortBy === 'price_asc') {
    filteredCars.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (filters.sortBy === 'price_desc') {
    filteredCars.sort((a, b) => b.pricePerDay - a.pricePerDay);
  }

  return (
    <AnimatedSpatialBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
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
            <Text style={styles.headerTitle}>FLEET TELEMETRY</Text>
            <Text style={styles.headerSubtitle}>
              Self-Drive • {location.city?.toUpperCase() || 'BENGALURU'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              triggerHaptic('light');
              setFilterModalVisible(true);
            }}
            style={styles.filterHeaderBtn}
          >
            <Ionicons name="options-outline" size={18} color={COLORS.cyan} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBarWrap}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search fleet (Creta, Nexon, Brezza...)"
            style={{ marginBottom: 0 }}
          />
        </View>

        {/* Category Pills */}
        <View style={styles.categoryScrollWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  activeOpacity={0.8}
                  onPress={() => {
                    triggerHaptic('selection');
                    setSelectedCategory(cat);
                  }}
                  style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                >
                  <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Cars List */}
        <FlatList
          data={filteredCars}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.metaRow}>
              <Text style={styles.metaCount}>
                <Text style={{ fontWeight: '900', color: COLORS.cyan }}>{filteredCars.length}</Text> VEHICLES AVAILABLE
              </Text>
              <Text style={styles.metaSort}>
                {filters.sortBy === 'ai_recommended' ? 'AI RECOMMENDED' : filters.sortBy.toUpperCase()}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <CarCard
              car={item}
              onViewDetails={(c) => navigation.navigate('CarDetails', { car: c })}
              onRent={(c) => navigation.navigate('Booking', { serviceType: 'car', car: c })}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="car-outline"
              title="No Vehicles in this Category"
              subtitle="Try switching categories or expanding your daily rate."
              buttonTitle="Show All Fleet"
              onButtonPress={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            />
          }
        />

        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          filters={filters}
          onApply={(newFilters) => setFilters(newFilters)}
          type="car"
        />
      </SafeAreaView>
    </AnimatedSpatialBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  filterHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
  },
  searchBarWrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  categoryScrollWrap: {
    marginVertical: 10,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: SIZES.radiusFull,
    backgroundColor: 'rgba(14, 21, 37, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  categoryPillActive: {
    backgroundColor: 'rgba(0, 242, 254, 0.18)',
    borderColor: COLORS.cyan,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
  },
  categoryTextActive: {
    color: COLORS.cyan,
    fontWeight: '900',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaCount: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  metaSort: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 0.5,
  },
});

export default NearbyCarsScreen;
