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
import { triggerHaptic } from '../../utils/haptics';

export const CarDriverScreen = ({ navigation }) => {
  const { combos } = useBookings();

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
            <Text style={styles.headerTitle}>CAR + DRIVER SYNERGY</Text>
            <Text style={styles.headerSubtitle}>BUNDLED MOBILITY SOLUTION</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <FlatList
          data={combos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
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
          )}
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
    color: COLORS.aiPurple,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  listContent: {
    padding: 20,
    paddingBottom: 32,
  },
  bannerWrap: {
    borderRadius: SIZES.radiusLg,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(129, 140, 248, 0.3)',
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.aiGlow,
  },
  bannerRim: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: COLORS.aiPurple,
  },
  aiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.aiPurple,
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: '#C7D2FE',
  },
});

export default CarDriverScreen;
