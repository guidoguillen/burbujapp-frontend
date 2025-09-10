/**
 * Configuración para Development Build
 * Usar cuando necesites funcionalidades no disponibles en Expo Go
 */

export const DEVELOPMENT_BUILD_FEATURES = {
  // Notificaciones push (no disponibles en Expo Go desde SDK 53)
  PUSH_NOTIFICATIONS: {
    available: false, // Cambiar a true en development build
    reason: 'Removido de Expo Go en SDK 53',
    workaround: 'Usar notificaciones locales o crear development build'
  },
  
  // Otras funcionalidades que podrían requerir development build
  BLUETOOTH_PRINTER: {
    available: true, // react-native-bluetooth-escpos-printer
    reason: 'Funciona con custom development build',
    workaround: 'Crear development build personalizado'
  },
  
  FILE_SYSTEM: {
    available: true, // expo-file-system funciona en Expo Go
    reason: 'Soportado en Expo Go',
    workaround: 'No necesario'
  }
};

export const isExpoGo = __DEV__ && !process.env.EXPO_IS_DEVELOPMENT_BUILD;

export const showFeatureLimitation = (feature: keyof typeof DEVELOPMENT_BUILD_FEATURES) => {
  const featureInfo = DEVELOPMENT_BUILD_FEATURES[feature];
  
  if (!featureInfo.available && isExpoGo) {
    console.warn(`⚠️  Funcionalidad limitada en Expo Go: ${feature}`);
    console.log(`Razón: ${featureInfo.reason}`);
    console.log(`Solución: ${featureInfo.workaround || 'Crear development build'}`);
  }
};
