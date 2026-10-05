import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import RatingStars from './RatingStars';

export const ReviewCard = ({ review, style }) => {
  if (!review) return null;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View style={styles.userWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>
              {review.userName ? review.userName[0].toUpperCase() : 'U'}
            </Text>
          </View>
          <View>
            <Text style={styles.userName}>{review.userName || 'Verified Rider'}</Text>
            <Text style={styles.dateText}>{review.date || 'Recent trip'}</Text>
          </View>
        </View>
        <RatingStars rating={review.rating || 5} size={13} />
      </View>

      <Text style={styles.commentText}>"{review.comment}"</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: SIZES.radiusMd,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: COLORS.primaryDark,
    fontWeight: '800',
    fontSize: 14,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  dateText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  commentText: {
    fontSize: 12,
    lineHeight: 17,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});

export default ReviewCard;
