import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import NeonButton from './NeonButton';
import { triggerHaptic } from '../utils/haptics';

export const TrustScoreBadge = ({
  score = 92,
  size = 'medium',
  showInfoButton = false,
  breakdown = null,
  entityName = 'Driver',
  style,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const getScoreColor = () => {
    if (score >= 93) return COLORS.cyan;
    if (score >= 85) return '#818CF8';
    return COLORS.accent;
  };

  const scoreColor = getScoreColor();
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          triggerHaptic('light');
          setModalVisible(true);
        }}
        style={[
          styles.badgeContainer,
          isSmall && styles.smallBadge,
          isLarge && styles.largeBadge,
          { borderColor: scoreColor + '40', backgroundColor: scoreColor + '12' },
          style,
        ]}
      >
        <Ionicons
          name="shield-checkmark"
          size={isSmall ? 11 : isLarge ? 16 : 13}
          color={scoreColor}
        />
        <Text
          style={[
            styles.scoreText,
            { color: scoreColor },
            isSmall && styles.smallText,
            isLarge && styles.largeText,
          ]}
        >
          TRUST SCORE: {score}/100
        </Text>
        {showInfoButton && (
          <Ionicons
            name="information-circle-outline"
            size={12}
            color={scoreColor}
            style={{ marginLeft: 3 }}
          />
        )}
      </TouchableOpacity>

      {/* Holographic Trust Breakdown Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <LinearGradient
              colors={['rgba(24, 34, 62, 0.95)', 'rgba(8, 12, 26, 0.98)']}
              style={StyleSheet.absoluteFillObject}
            />
            {/* Top Cyan Rim */}
            <View style={styles.modalRimGlow} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={[styles.modalIconWrap, { backgroundColor: scoreColor + '20', borderColor: scoreColor }]}>
                <Ionicons name="shield-checkmark" size={28} color={scoreColor} />
              </View>
              <Text style={styles.modalTitle}>AI Trust & Reliability Matrix</Text>
              <Text style={styles.modalSubtitle}>Transparent verification model for {entityName}</Text>
            </View>

            {/* Big Holographic Score */}
            <View style={styles.bigScoreBox}>
              <Text style={[styles.bigScoreNumber, { color: scoreColor }]}>{score}</Text>
              <Text style={styles.bigScoreTotal}>/ 100</Text>
            </View>
            <View style={styles.tierTagWrap}>
              <Text style={[styles.tierTag, { color: scoreColor }]}>
                {score >= 93 ? '⭐ ELITE PRO TIER' : score >= 85 ? '🛡️ HIGHLY TRUSTED' : '✓ VERIFIED PARTNER'}
              </Text>
            </View>

            {/* Transparent Explanation */}
            <View style={styles.explanationBox}>
              <Text style={styles.explanationText}>
                "Evaluated from verified trip telemetry, police background check, 0.8% zero-cancellation reliability and authentic customer safety reviews."
              </Text>
            </View>

            {/* Holographic Metric Progress Bars */}
            <View style={styles.metricsContainer}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Verified Identity & RTO License</Text>
                <Text style={styles.metricVal}>100%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '100%', backgroundColor: COLORS.cyan }]} />
              </View>

              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Safety & Incident-Free Driving</Text>
                <Text style={styles.metricVal}>98%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '98%', backgroundColor: COLORS.success }]} />
              </View>

              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Punctuality & Schedule Accuracy</Text>
                <Text style={styles.metricVal}>96%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '96%', backgroundColor: COLORS.aiPurple }]} />
              </View>

              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Low Cancellation Reliability</Text>
                <Text style={styles.metricVal}>99%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '99%', backgroundColor: COLORS.cyan }]} />
              </View>
            </View>

            <NeonButton
              title="Close Telemetry"
              variant="cyan"
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 20 }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  smallBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  largeBadge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  scoreText: {
    fontWeight: '900',
    fontSize: 10,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  smallText: {
    fontSize: 9,
  },
  largeText: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 5, 12, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    borderRadius: SIZES.radiusLg,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 254, 0.35)',
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.hover,
  },
  modalRimGlow: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: COLORS.cyan,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  modalIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  bigScoreBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginVertical: 4,
  },
  bigScoreNumber: {
    fontSize: 44,
    fontWeight: '900',
  },
  bigScoreTotal: {
    fontSize: 18,
    color: COLORS.textMuted,
    fontWeight: '700',
    marginLeft: 4,
  },
  tierTagWrap: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 242, 254, 0.08)',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 12,
  },
  tierTag: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  explanationBox: {
    backgroundColor: 'rgba(10, 16, 32, 0.65)',
    padding: 10,
    borderRadius: SIZES.radiusSm,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  explanationText: {
    fontSize: 11,
    lineHeight: 16,
    color: '#CBD5E1',
    textAlign: 'center',
  },
  metricsContainer: {
    gap: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  metricVal: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  progressBarBg: {
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2.5,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2.5,
  },
});

export default TrustScoreBadge;
