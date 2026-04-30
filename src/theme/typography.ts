export const typography = {
  fonts: {
    // We will use standard system fonts for now to avoid custom font loading issues,
    // but structure it so we can easily swap to Inter or Poppins later.
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 12,
    s: 14,
    m: 16, // Body text
    l: 18,
    xl: 20,
    xxl: 24, // H3
    xxxl: 32, // H2
    huge: 40, // H1
  },
  lineHeights: {
    xs: 16,
    s: 20,
    m: 24,
    l: 28,
    xl: 32,
    xxl: 40,
    xxxl: 42,
    huge: 50,
  }
};
