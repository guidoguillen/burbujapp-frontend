import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface ThemeSettingsProps {
  visible: boolean;
  onClose: () => void;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ visible, onClose }) => {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();

  const themeOptions = [
    {
      key: 'light' as const,
      label: 'Claro',
      icon: 'white-balance-sunny',
      description: 'Tema claro para el día',
    },
    {
      key: 'dark' as const,
      label: 'Oscuro',
      icon: 'moon-waning-crescent',
      description: 'Tema oscuro para la noche',
    },
    {
      key: 'auto' as const,
      label: 'Automático',
      icon: 'theme-light-dark',
      description: 'Sigue el tema del sistema',
    },
  ];

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      width: '100%',
      maxWidth: 400,
      ...theme.shadows.large,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    optionContainer: {
      marginBottom: theme.spacing.sm,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    optionActive: {
      backgroundColor: isDark ? '#374151' : '#EFF6FF',
      borderColor: theme.colors.primary,
    },
    optionIcon: {
      marginRight: theme.spacing.md,
    },
    optionContent: {
      flex: 1,
    },
    optionLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
    },
    optionDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    checkIcon: {
      marginLeft: theme.spacing.sm,
    },
    preview: {
      marginTop: theme.spacing.lg,
      padding: theme.spacing.md,
      backgroundColor: isDark ? '#1F2937' : '#F8FAFC',
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    previewTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    previewColors: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    colorSample: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🎨 Configurar Tema</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons 
                name="close" 
                size={24} 
                color={theme.colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>

          {/* Contenido */}
          <View style={styles.content}>
            {themeOptions.map((option) => {
              const isActive = themeMode === option.key;
              
              return (
                <View key={option.key} style={styles.optionContainer}>
                  <TouchableOpacity
                    style={[styles.option, isActive && styles.optionActive]}
                    onPress={() => setThemeMode(option.key)}
                  >
                    <MaterialCommunityIcons
                      name={option.icon as any}
                      size={24}
                      color={isActive ? theme.colors.primary : theme.colors.textSecondary}
                      style={styles.optionIcon}
                    />
                    <View style={styles.optionContent}>
                      <Text style={styles.optionLabel}>{option.label}</Text>
                      <Text style={styles.optionDescription}>{option.description}</Text>
                    </View>
                    {isActive && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color={theme.colors.primary}
                        style={styles.checkIcon}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}

            {/* Vista previa de colores */}
            <View style={styles.preview}>
              <Text style={styles.previewTitle}>Vista previa de colores:</Text>
              <View style={styles.previewColors}>
                <View style={[styles.colorSample, { backgroundColor: theme.colors.primary }]} />
                <View style={[styles.colorSample, { backgroundColor: theme.colors.secondary }]} />
                <View style={[styles.colorSample, { backgroundColor: theme.colors.success }]} />
                <View style={[styles.colorSample, { backgroundColor: theme.colors.warning }]} />
                <View style={[styles.colorSample, { backgroundColor: theme.colors.error }]} />
                <View style={[styles.colorSample, { backgroundColor: theme.colors.text }]} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
