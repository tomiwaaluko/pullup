// PullUp Design System — "Night Bloom"
// A vibrant, modern aesthetic with violet-to-pink gradient accents,
// dark hero sections, and clean light content areas.

export const Colors = {
  // Brand gradient endpoints
  gradientStart: '#8B5CF6',
  gradientMid: '#A855F7',
  gradientEnd: '#EC4899',

  // Core brand
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  primaryDark: '#7C3AED',
  primaryMuted: 'rgba(139, 92, 246, 0.12)',

  secondary: '#EC4899',
  secondaryLight: '#F472B6',
  secondaryMuted: 'rgba(236, 72, 153, 0.12)',

  accent: '#F59E0B',
  accentLight: '#FBBF24',
  accentMuted: 'rgba(245, 158, 11, 0.12)',

  // Semantic
  success: '#10B981',
  successLight: '#34D399',
  successMuted: 'rgba(16, 185, 129, 0.12)',
  error: '#EF4444',
  errorLight: '#F87171',
  errorMuted: 'rgba(239, 68, 68, 0.10)',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Dark surfaces (for hero areas, tab bar)
  ink: '#0B0B14',
  charcoal: '#1C1C28',
  slate: '#2A2A3C',

  // Light surfaces
  background: '#F5F5F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F0EFED',
  surfaceElevated: '#FFFFFF',

  // Text
  text: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textLight: '#D1D5DB',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: 'rgba(255, 255, 255, 0.60)',

  // Borders
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: 'rgba(255, 255, 255, 0.08)',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(11, 11, 20, 0.5)',
  overlayLight: 'rgba(11, 11, 20, 0.25)',
};

export const Gradients = {
  brand: [Colors.gradientStart, Colors.gradientEnd] as const,
  brandVibrant: [Colors.gradientStart, Colors.gradientMid, Colors.gradientEnd] as const,
  dark: [Colors.ink, Colors.charcoal] as const,
  darkFade: ['rgba(11, 11, 20, 0.95)', 'rgba(11, 11, 20, 0)'] as const,
  warmSunset: ['#F97316', '#EC4899'] as const,
  electric: ['#3B82F6', '#8B5CF6'] as const,
};

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    micro: 11,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 34,
    display: 42,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '800' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  xxxxl: 64,
};

export const Radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  glowPink: {
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 12,
    elevation: 8,
  },
  dark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
};

// Event type color mapping
export const EventTypeColors: Record<string, { bg: string; text: string; dot: string }> = {
  academic: { bg: 'rgba(59, 130, 246, 0.12)', text: '#3B82F6', dot: '#3B82F6' },
  sports: { bg: 'rgba(239, 68, 68, 0.12)', text: '#EF4444', dot: '#EF4444' },
  social: { bg: 'rgba(236, 72, 153, 0.12)', text: '#EC4899', dot: '#EC4899' },
  career: { bg: 'rgba(16, 185, 129, 0.12)', text: '#10B981', dot: '#10B981' },
  club: { bg: 'rgba(245, 158, 11, 0.12)', text: '#F59E0B', dot: '#F59E0B' },
  greek: { bg: 'rgba(139, 92, 246, 0.12)', text: '#8B5CF6', dot: '#8B5CF6' },
  other: { bg: 'rgba(107, 114, 128, 0.12)', text: '#6B7280', dot: '#6B7280' },
};

// Animation configs
export const AnimationConfig = {
  springFast: { damping: 15, stiffness: 300, mass: 0.8 },
  springBouncy: { damping: 10, stiffness: 200, mass: 0.6 },
  springGentle: { damping: 20, stiffness: 150, mass: 1 },
  duration: {
    fast: 150,
    normal: 250,
    slow: 400,
    entrance: 600,
  },
};
