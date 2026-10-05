import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { triggerHaptic } from '../utils/haptics';

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search by name, area or vehicle...',
  onFilterPress,
  activeFilterCount = 0,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputWrap}>
        <Ionicons name="search" size={17} color={COLORS.cyan} style={styles.searchIcon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.35)"
          style={styles.input}
        />
        {value ? (
          <TouchableOpacity
            onPress={() => {
              triggerHaptic('impactLight');
              onChangeText('');
            }}
            style={{ padding: 4 }}
          >
            <Ionicons name="close-circle" size={16} color="rgba(255, 255, 255, 0.4)" />
          </TouchableOpacity>
        ) : null}
      </View>

      {onFilterPress && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            triggerHaptic('impactLight');
            onFilterPress();
          }}
          style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={activeFilterCount > 0 ? '#050814' : COLORS.cyan}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: SIZES.radiusMd,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: COLORS.cyan,
    borderColor: COLORS.cyan,
    shadowColor: COLORS.cyan,
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
});

export default SearchBar;
