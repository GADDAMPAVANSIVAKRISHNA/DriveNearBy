import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';

/**
 * ResponsiveContainer - Automatically adapts layout to viewport without manual selection
 * On mobile/tablet: 100% full fluid width
 * On desktop/laptop: Centered with maxContentWidth and responsive margins
 */
export const ResponsiveContainer = ({ children, style, maxWidth }) => {
  const { maxContentWidth, gutter, isMobile } = useResponsive();

  return (
    <View style={styles.rootWrapper}>
      <View
        style={[
          styles.contentWrapper,
          {
            maxWidth: maxWidth || maxContentWidth,
            paddingHorizontal: isMobile ? 0 : gutter,
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#050814',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
});

export default ResponsiveContainer;
