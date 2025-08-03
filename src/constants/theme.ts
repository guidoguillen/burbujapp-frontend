// Colores del tema
export const Colors = {
  // Colores primarios
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#66B3FF',
  
  // Colores secundarios
  secondary: '#FF9500',
  secondaryDark: '#CC7700',
  secondaryLight: '#FFBF66',
  
  // Colores de estado
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
  
  // Colores de fondo
  background: '#FFFFFF',
  backgroundSecondary: '#F2F2F7',
  surface: '#FFFFFF',
  
  // Colores de texto
  text: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  
  // Colores de borde
  border: '#C6C6C8',
  borderLight: '#E5E5EA',
  
  // Transparencias
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Espaciado
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Tipografía
export const Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

// Bordes y radios
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

// Sombras
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Dimensiones
export const Layout = {
  window: {
    width: 375, // iPhone base width
    height: 812, // iPhone base height
  },
  header: {
    height: 88,
  },
  tabBar: {
    height: 83,
  },
  button: {
    height: 48,
  },
  input: {
    height: 48,
  },
};

// Z-Index
export const ZIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
};

// Tema principal que combina todo
export const theme = {
  colors: {
    primary: Colors.primary,
    primaryDark: Colors.primaryDark,
    primaryLight: Colors.primaryLight,
    secondary: Colors.secondary,
    success: Colors.success,
    warning: Colors.warning,
    error: Colors.error,
    info: Colors.info,
    background: Colors.background,
    backgroundSecondary: Colors.backgroundSecondary,
    surface: Colors.surface,
    text: Colors.text,
    textSecondary: Colors.textSecondary,
    textTertiary: Colors.textTertiary,
    border: Colors.border,
    borderLight: Colors.borderLight,
    overlay: Colors.overlay,
    shadow: Colors.shadow,
    white: '#FFFFFF',
    black: '#000000',
  },
  spacing: {
    xs: Spacing.xs,
    small: Spacing.sm,
    medium: Spacing.md,
    large: Spacing.lg,
    xlarge: Spacing.xl,
    xxlarge: Spacing.xxl,
  },
  typography: Typography,
  borderRadius: BorderRadius,
  shadows: Shadows,
  layout: Layout,
  zIndex: ZIndex,
};
