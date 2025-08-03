import { StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

// Estilos globales reutilizables
export const globalStyles = StyleSheet.create({
  // Contenedores
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  containerPadded: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  
  // Textos
  heading1: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    lineHeight: Typography.fontSize.xxxl * Typography.lineHeight.tight,
  },
  
  heading2: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    lineHeight: Typography.fontSize.xxl * Typography.lineHeight.tight,
  },
  
  heading3: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    lineHeight: Typography.fontSize.xl * Typography.lineHeight.normal,
  },
  
  bodyText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.text,
    lineHeight: Typography.fontSize.md * Typography.lineHeight.normal,
  },
  
  captionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.textSecondary,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  
  // Botones
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  
  buttonText: {
    color: 'white',
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  
  buttonSecondaryText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  // Inputs
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    backgroundColor: Colors.background,
    minHeight: 48,
  },
  
  inputFocused: {
    borderColor: Colors.primary,
  },
  
  inputError: {
    borderColor: Colors.error,
  },
  
  // Cards
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  // Separadores
  separator: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm,
  },
  
  // Flex utilities
  row: {
    flexDirection: 'row',
  },
  
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  // Spacing utilities
  marginTop: {
    marginTop: Spacing.md,
  },
  
  marginBottom: {
    marginBottom: Spacing.md,
  },
  
  marginHorizontal: {
    marginHorizontal: Spacing.md,
  },
  
  marginVertical: {
    marginVertical: Spacing.md,
  },
  
  paddingTop: {
    paddingTop: Spacing.md,
  },
  
  paddingBottom: {
    paddingBottom: Spacing.md,
  },
  
  paddingHorizontal: {
    paddingHorizontal: Spacing.md,
  },
  
  paddingVertical: {
    paddingVertical: Spacing.md,
  },
  
  // Estados
  loading: {
    opacity: 0.7,
  },
  
  disabled: {
    opacity: 0.5,
  },
  
  // Posicionamiento
  absolute: {
    position: 'absolute',
  },
  
  relative: {
    position: 'relative',
  },
  
  // Errores
  errorText: {
    color: Colors.error,
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.xs,
  },
  
  // Éxito
  successText: {
    color: Colors.success,
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.xs,
  },
});
