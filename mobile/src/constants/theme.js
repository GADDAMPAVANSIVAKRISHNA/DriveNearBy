export const COLORS = {
  // Deep Futuristic Dark Backgrounds
  background: '#050814',      // Deep space obsidian
  backgroundSecondary: '#090E1D',
  cardBg: 'rgba(14, 21, 37, 0.78)',  // Frosted dark glass
  cardBgSolid: '#0E1525',
  surfaceLight: 'rgba(25, 36, 62, 0.55)',
  surfaceLighter: 'rgba(38, 52, 86, 0.45)',
  
  // Neon Futuristic Accents
  cyan: '#00F2FE',            // Electric Cyan (energy & tech)
  cyanLight: '#A5F3FC',
  cyanDark: '#0891B2',
  cyanGlow: 'rgba(0, 242, 254, 0.35)',

  primary: '#00F2FE',         // High-tech primary cyan
  primaryDark: '#0284C7',
  primaryLight: '#E0F2FE',

  aiPurple: '#818CF8',        // Electric AI Violet
  aiPurpleDark: '#4F46E5',
  aiPurpleLight: 'rgba(99, 102, 241, 0.18)',
  aiPink: '#F43F5E',          // Hyperdrive Pink
  aiPinkGlow: 'rgba(244, 63, 94, 0.35)',

  secondary: '#0F172A',
  accent: '#F59E0B',          // Star Amber
  accentGlow: 'rgba(245, 158, 11, 0.3)',

  success: '#10B981',         // Verified Emerald
  successGlow: 'rgba(16, 185, 129, 0.3)',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#38BDF8',

  // Borders & Glass
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  cardBorderHover: 'rgba(0, 242, 254, 0.35)',
  cardBorderViolet: 'rgba(129, 140, 248, 0.35)',
  borderSubtle: 'rgba(148, 163, 184, 0.12)',

  // Typography
  textPrimary: '#F8FAFC',     // Crisp White
  textSecondary: '#94A3B8',   // Futuristic Silver
  textMuted: '#64748B',       // Muted slate
  textInverse: '#050814',
  textCyan: '#00F2FE',
  textViolet: '#A5B4FC',
};

export const GRADIENTS = {
  cyanEnergy: ['#00F2FE', '#4FACFE'],
  aiVibe: ['#818CF8', '#C084FC', '#F43F5E'],
  emeraldTrust: ['#10B981', '#059669'],
  darkGlass: ['rgba(20, 29, 52, 0.85)', 'rgba(10, 15, 29, 0.95)'],
  radarPulse: ['rgba(0, 242, 254, 0.25)', 'rgba(99, 102, 241, 0.02)'],
  borderEnergy: ['#00F2FE', '#818CF8', 'transparent'],
};

export const SIZES = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  radiusSm: 8,
  radiusMd: 14,
  radiusLg: 22,
  radiusFull: 999,
};

export const SHADOWS = {
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  },
  hover: {
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  cyanGlow: {
    shadowColor: '#00F2FE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 7,
  },
  aiGlow: {
    shadowColor: '#818CF8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 8,
  },
};
