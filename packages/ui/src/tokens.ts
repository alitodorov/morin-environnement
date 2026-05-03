export const colors = {
  brand: '#E82500',
  onyx: '#0A0A0A',
  surface: '#F4F4F5',
  gridline: '#E4E4E7',
  white: '#FFFFFF',
} as const

export const fonts = {
  sans: ['Manrope', 'sans-serif'],
} as const

export const tailwindTokens = {
  colors: {
    brand: colors.brand,
    onyx: colors.onyx,
    surface: colors.surface,
    gridline: colors.gridline,
  },
  fontFamily: { sans: fonts.sans },
} as const
