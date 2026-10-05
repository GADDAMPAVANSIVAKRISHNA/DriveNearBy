import { useWindowDimensions, Platform } from 'react-native';

/**
 * Universal Responsive Layout Hook
 * Automatically calculates breakpoints and dynamic dimensions based on viewport width
 * Breakpoints:
 * - Mobile: < 640px
 * - Tablet: 640px - 1023px
 * - Desktop / Laptop: 1024px - 1439px
 * - Ultra-wide: >= 1440px
 */
export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024 && width < 1440;
  const isWide = width >= 1440;
  const isLargeScreen = width >= 1024;

  // Layout container constraints
  const maxContentWidth = isWide ? 1400 : isDesktop ? 1200 : isTablet ? 840 : '100%';
  const gutter = isWide ? 40 : isDesktop ? 32 : isTablet ? 24 : 16;

  // Grid column counts
  const gridColumns = isWide ? 4 : isDesktop ? 3 : isTablet ? 2 : 1;
  const cardGap = isMobile ? 12 : 18;

  // Dynamic card width calculation for flex-wrap grids
  const getCardWidth = (columns = gridColumns, gap = cardGap) => {
    if (columns <= 1) return '100%';
    const totalGaps = (columns - 1) * gap;
    return `calc((100% - ${totalGaps}px) / ${columns})`;
  };

  return {
    width,
    height,
    isWeb,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    isLargeScreen,
    maxContentWidth,
    gutter,
    gridColumns,
    cardGap,
    getCardWidth,
  };
};

export default useResponsive;
