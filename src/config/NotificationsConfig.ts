/**
 * Configuración de notificaciones adaptativa
 * Maneja las diferencias entre Expo Go y Development Build
 */

import { Platform } from 'react-native';

// Detectar si estamos en Expo Go
const isExpoGo = __DEV__ && !process.env.EXPO_IS_DEVELOPMENT_BUILD;

// Importación condicional de expo-notifications
let Notifications: any = null;

try {
  if (!isExpoGo || Platform.OS === 'ios') {
    // En iOS o development build, importar normalmente
    Notifications = require('expo-notifications');
  } else {
    // En Android + Expo Go, usar un mock para evitar el error
    Notifications = {
      setNotificationHandler: () => {},
      getPermissionsAsync: () => Promise.resolve({ status: 'granted' }),
      requestPermissionsAsync: () => Promise.resolve({ status: 'granted' }),
      scheduleNotificationAsync: () => Promise.resolve('mock-id'),
      setNotificationChannelAsync: () => Promise.resolve(),
    };
  }
} catch (error) {
  console.log('⚠️  expo-notifications no disponible, usando mock');
  Notifications = {
    setNotificationHandler: () => {},
    getPermissionsAsync: () => Promise.resolve({ status: 'denied' }),
    requestPermissionsAsync: () => Promise.resolve({ status: 'denied' }),
    scheduleNotificationAsync: () => Promise.resolve(null),
    setNotificationChannelAsync: () => Promise.resolve(),
  };
}

export { Notifications };
export const isNotificationsAvailable = !!Notifications && !isExpoGo;
export const isPushNotificationsAvailable = !isExpoGo;
