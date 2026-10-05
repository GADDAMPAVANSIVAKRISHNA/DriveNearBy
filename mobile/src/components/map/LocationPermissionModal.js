import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants/theme';
import NeonButton from '../NeonButton';
import { triggerHaptic } from '../../utils/haptics';

export const LocationPermissionModal = ({
  visible,
  onAllowLocation,
  onUseDemoLocation,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onUseDemoLocation}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <LinearGradient
            colors={['rgba(24, 32, 60, 0.98)', 'rgba(5, 8, 20, 0.98)']}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.iconCircle}>
            <Ionicons name="location" size={32} color={COLORS.cyan} />
          </View>

          <Text style={styles.title}>LOCATION ACCESS</Text>
          <Text style={styles.subtitle}>
            Location access helps us find nearby drivers and cars.
          </Text>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={15} color={COLORS.cyan} />
              <Text style={styles.featureText}>Real-time satellite & hybrid geographic map</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={15} color={COLORS.cyan} />
              <Text style={styles.featureText}>Live nearby chauffeur & rental fleet tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={15} color={COLORS.cyan} />
              <Text style={styles.featureText}>Instant AI driver matching & road navigation</Text>
            </View>
          </View>

          <NeonButton
            title="ALLOW LOCATION"
            icon="locate"
            variant="cyan"
            onPress={() => {
              triggerHaptic('impactMedium');
              onAllowLocation();
            }}
            style={{ width: '100%', marginBottom: 12 }}
          />

          <TouchableOpacity
            style={styles.demoBtn}
            onPress={() => {
              triggerHaptic('impactLight');
              onUseDemoLocation();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.demoBtnText}>USE DEMO LOCATION (TIRUPATI, AP)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 5, 12, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: SIZES.radiusLg,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 254, 0.4)',
    padding: 24,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 242, 254, 0.12)',
    borderWidth: 1.5,
    borderColor: COLORS.cyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.cyan,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  featureList: {
    width: '100%',
    gap: 8,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  demoBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  demoBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
});

export default LocationPermissionModal;
