import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import AnimatedSpatialBackground from '../../components/AnimatedSpatialBackground';
import ComboCard from '../../components/ComboCard';
import { useBookings } from '../../context/BookingContext';
import { useResponsive } from '../../hooks/useResponsive';
import { triggerHaptic } from '../../utils/haptics';

export const CarDriverScreen = ({ navigation }) => {
  const { combos } = useBookings();
  const { isMobile, isTablet, isDesktop, gridColumns, maxContentWidth, gutter } = useResponsive();

  return (
    <AnimatedSpatialBackground>
      <SafeAreaView style={styles.container}>
        <View style={[styles.responsiveShell, { maxWidth: maxContentWidth, paddingHorizontal: isMobile ? 12 : gutter }]}>
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
              <Text style={styles.headerTitle}>CAR + DRIVER SYNERGY</Text>
              <Text style={styles.headerSubtitle}>BUNDLED MOBILITY SOLUTION</Text>
            </View>
            <View style={{ width: 36 }} />
          </View>

          <FlatList
            key={`combos-grid-${gridColumns}`}
            data={combos}
            keyExtractor={(item) => item.id}
            numColumns={gridColumns}
            columnWrapperStyle={gridColumns > 1 ? { gap: 16 } : null}
            contentContainerStyle={[styles.listContent, { paddingBottom: isMobile ? 80 : 100 }]}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.bannerWrap}>
                <LinearGradient
                  colors={['rgba(30, 24, 60, 0.9)', 'rgba(12, 10, 32, 0.95)']}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.bannerRim} />

                <View style={styles.aiBadgeRow}>
                  <Ionicons name="sparkles" size={14} color={COLORS.aiPurple} />
                  <Text style={styles.aiBadgeText}>AI COMPATIBILITY MATCHING</Text>
                </View>
                <Text style={styles.bannerTitle}>
                  Save 15% on Dual Vehicle & Chauffeur
                </Text>
                <Text style={styles.bannerSubtitle}>
                  Our AI pairs verified drivers with specific cars they have recorded 40+ prior accident-free trips navigating. Zero stress, full comfort.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View style={gridColumns > 1 ? { flex: 1, minWidth: 280 } : { width: '100%' }}>
                <ComboCard
                  combo={item}
                  onBook={(combo) =>
                    navigation.navigate('Booking', {
                      serviceType: 'combo',
                      driver: combo.driver,
                      car: combo.car,
                      estimatedPrice: combo.comboPricePerDay,
                    })
                  }
                />
              </View>
            )}
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
  responsiveShell: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 8.5,
    fontWeight: '800',
    color: COLORS.aiPurple,
    letterSpacing: 1,
    marginTop: 2,
  },
  listContent: {
    paddingVertical: 14,
  },
  bannerWrap: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.25)',
    overflow: 'hidden',
    position: 'relative',
  },
  bannerRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.aiPurple,
  },
  aiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  aiBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.aiPurple,
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
    lineHeight: 16,
  },
});

export default CarDriverScreen;
