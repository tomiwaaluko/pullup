export const Colors = {
  primary: '#4361EE', // Electric Blue
  primaryLight: '#7B8DFF',
  primaryDark: '#3A0CA3',
  secondary: '#F72585', // Neon Pink
  accent: '#FEE440', // Sunny Yellow
  success: '#06D6A0', // Mint Green
  background: '#F8F9FA', // Off-white background
  surface: '#FFFFFF', // Pure white for cards
  text: '#2B2D42', // Deep dark blue/gray
  textMuted: '#8D99AE',
  textLight: '#EDF2F4',
  border: '#E2E8F0',
  error: '#EF233C',
  warning: '#FFB703',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
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
    xl: 26,
    xxl: 36,
    xxxl: 48,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '800' as const,
    black: '900' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  floating: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  }
};
