export const Colors = {
  primary: '#6C63FF',
  primaryLight: '#8B85FF',
  primaryDark: '#4A42DB',
  secondary: '#FF6584',
  background: '#FFFFFF',
  surface: '#F5F5F7',
  text: '#1A1A2E',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  white: '#FFFFFF',
  black: '#000000',
};

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};
