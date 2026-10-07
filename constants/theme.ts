export const colors = {
  background: '#FFF8EC',
  surface: '#FFFFFF',
  surfaceSoft: '#FFF1C9',
  surfaceMuted: '#F6EEDD',
  primary: '#FF7A59',
  primaryDark: '#E6633F',
  primarySoft: '#FFE4DB',
  secondary: '#4ECDC4',
  secondarySoft: '#D7F4F1',
  accent: '#FFD93D',
  accentSoft: '#FFF3B0',
  success: '#6BCB77',
  danger: '#E5484D',
  text: '#2D3142',
  textStrong: '#1F2235',
  textSubtle: '#6B6F80',
  textOnPrimary: '#FFFFFF',
  border: '#F0E6D2',
  divider: '#EFE6D1',
  shadow: 'rgba(45, 49, 66, 0.1)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const typography = {
  display: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
  title: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  heading: { fontSize: 18, fontWeight: '700' as const },
  body: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  button: { fontSize: 16, fontWeight: '700' as const },
  label: { fontSize: 13, fontWeight: '600' as const, letterSpacing: 0.3 },
  caption: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 0.5 },
};

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
};
