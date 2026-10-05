import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import PrimaryButton, { SecondaryButton } from './PrimaryButton';

export const FilterModal = ({
  visible,
  onClose,
  filters,
  onApply,
  type = 'driver', // 'driver' | 'car'
}) => {
  const [selectedSort, setSelectedSort] = useState(filters?.sortBy || 'ai_recommended');
  const [selectedMinRating, setSelectedMinRating] = useState(filters?.minRating || null);
  const [selectedPriceLimit, setSelectedPriceLimit] = useState(filters?.maxPrice || null);

  const sortOptions = [
    { id: 'ai_recommended', label: '🤖 AI Recommended Match', icon: 'sparkles' },
    { id: 'distance', label: '📍 Closest Distance', icon: 'location' },
    { id: 'rating', label: '⭐ Highest Rating', icon: 'star' },
    { id: 'price_asc', label: '💰 Lowest Price First', icon: 'trending-down' },
    { id: 'price_desc', label: '💎 Premium / High to Low', icon: 'trending-up' },
  ];

  const ratingOptions = [4.5, 4.7, 4.8, 4.9];
  const priceOptions = type === 'driver' ? [700, 800, 900, 1000] : [1500, 1800, 2200, 3000];

  const handleReset = () => {
    setSelectedSort('ai_recommended');
    setSelectedMinRating(null);
    setSelectedPriceLimit(null);
    onApply({
      sortBy: 'ai_recommended',
      minRating: null,
      maxPrice: null,
    });
    onClose();
  };

  const handleApply = () => {
    onApply({
      sortBy: selectedSort,
      minRating: selectedMinRating,
      maxPrice: selectedPriceLimit,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Filter & Sort Mobility</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Sort By Section */}
            <Text style={styles.sectionHeader}>Sort Order</Text>
            <View style={styles.sortList}>
              {sortOptions.map((opt) => {
                const isSelected = selectedSort === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    activeOpacity={0.7}
                    onPress={() => setSelectedSort(opt.id)}
                    style={[styles.sortItem, isSelected && styles.sortItemActive]}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={18}
                      color={isSelected ? COLORS.primary : COLORS.textSecondary}
                    />
                    <Text style={[styles.sortLabel, isSelected && styles.sortLabelActive]}>
                      {opt.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} style={{ marginLeft: 'auto' }} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Min Rating Section */}
            <Text style={styles.sectionHeader}>Minimum Customer Rating</Text>
            <View style={styles.pillRow}>
              {ratingOptions.map((r) => {
                const isSelected = selectedMinRating === r;
                return (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setSelectedMinRating(isSelected ? null : r)}
                    style={[styles.filterPill, isSelected && styles.filterPillActive]}
                  >
                    <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                      ⭐ {r}+
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Max Daily Price */}
            <Text style={styles.sectionHeader}>Max Daily Rate (₹)</Text>
            <View style={styles.pillRow}>
              {priceOptions.map((p) => {
                const isSelected = selectedPriceLimit === p;
                return (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setSelectedPriceLimit(isSelected ? null : p)}
                    style={[styles.filterPill, isSelected && styles.filterPillActive]}
                  >
                    <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                      Under ₹{p}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <SecondaryButton
              title="Reset"
              onPress={handleReset}
              style={{ flex: 1 }}
            />
            <PrimaryButton
              title="Apply Filters"
              onPress={handleApply}
              style={{ flex: 2 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: COLORS.cardBg,
    borderTopLeftRadius: SIZES.radiusLg,
    borderTopRightRadius: SIZES.radiusLg,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: '80%',
    ...SHADOWS.hover,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 12,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sortList: {
    gap: 8,
  },
  sortItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.surfaceLight,
    gap: 10,
  },
  sortItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  sortLabel: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  sortLabelActive: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.surfaceLight,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
});

export default FilterModal;
