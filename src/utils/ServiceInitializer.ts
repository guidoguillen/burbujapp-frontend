/**
 * Inicializador de servicios
 * Configura servicios y maneja limitaciones de Expo Go
 */

import { NotificationService } from '../services/NotificationService';
import { showFeatureLimitation } from '../config/DevelopmentBuildConfig';

export const initializeServices = async () => {
  try {
    // Suprimir warnings conocidos de Expo Go
    NotificationService.suppressExpoGoWarnings();
    
    // Inicializar permisos de notificaciones
    const hasNotificationPermissions = await NotificationService.requestPermissions();
    
    if (hasNotificationPermissions) {
      console.log('✅ Servicio de notificaciones inicializado');
    } else {
      console.log('⚠️  Permisos de notificación no otorgados');
    }
    
    // Verificar funcionalidades disponibles
    if (!NotificationService.isPushNotificationAvailable()) {
      showFeatureLimitation('PUSH_NOTIFICATIONS');
    }
    
    return {
      notifications: hasNotificationPermissions,
      pushNotifications: NotificationService.isPushNotificationAvailable()
    };
    
  } catch (error) {
    console.error('Error inicializando servicios:', error);
    return {
      notifications: false,
      pushNotifications: false
    };
  }
};

// Función para mostrar información sobre el entorno actual
export const showEnvironmentInfo = () => {
  const isExpoGo = __DEV__ && !process.env.EXPO_IS_DEVELOPMENT_BUILD;
  
  console.log('\n🔧 Información del Entorno:');
  console.log(`📱 Plataforma: ${isExpoGo ? 'Expo Go' : 'Development Build'}`);
  console.log(`🔔 Push Notifications: ${NotificationService.isPushNotificationAvailable() ? '✅' : '❌'}`);
  console.log(`📲 Local Notifications: ✅`);
  
  if (isExpoGo) {
    console.log('\n💡 Tips para Expo Go:');
    console.log('   • Notificaciones locales funcionan normalmente');
    console.log('   • Para push notifications: crear development build');
    console.log('   • Ver: docs/Notificaciones-SDK53.md');
  }
  console.log('');
};
