import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Verificar si estamos en Expo Go para ajustar funcionalidad
const isExpoGo = __DEV__ && !Platform.select({
  native: process.env.EXPO_IS_DEVELOPMENT_BUILD === 'true',
  default: false,
});

// Configurar el comportamiento de las notificaciones
// En Expo Go, esto puede mostrar un warning que podemos ignorar
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (error) {
  if (isExpoGo) {
    console.log('ℹ️  Notificaciones configuradas para Expo Go (funcionalidad limitada)');
  } else {
    console.error('Error configurando notificaciones:', error);
  }
}

export class NotificationService {
  // Verificar si las notificaciones push están disponibles
  static isPushNotificationAvailable(): boolean {
    return !isExpoGo;
  }

  // Mostrar warning sobre limitaciones en Expo Go
  static showExpoGoLimitation() {
    if (isExpoGo) {
      console.warn('⚠️  Notificaciones Push no disponibles en Expo Go (SDK 53+)');
      console.log('ℹ️  Las notificaciones locales funcionan normalmente');
      console.log('🛠️  Para push notifications, usar: eas build --profile development');
      
      Alert.alert(
        'Limitación de Expo Go',
        'Las notificaciones push no están disponibles en Expo Go desde SDK 53.\n\n✅ Notificaciones locales: Funcionan\n❌ Notificaciones push: Requieren development build\n\nPara desarrollo normal, puedes ignorar este mensaje.',
        [
          { text: 'Más info', onPress: () => console.log('Ver: docs/Notificaciones-SDK53.md') },
          { text: 'Entendido', style: 'default' }
        ]
      );
    }
  }

  // Método para suprimir warnings de expo-notifications en Expo Go
  static suppressExpoGoWarnings() {
    if (isExpoGo) {
      // Suprimir console.warn específico de expo-notifications
      const originalWarn = console.warn;
      console.warn = (...args) => {
        const message = args.join(' ');
        if (message.includes('expo-notifications') && message.includes('removed from Expo Go')) {
          // Suprimir este warning específico
          return;
        }
        originalWarn.apply(console, args);
      };
    }
  }

  static async requestPermissions() {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permisos de notificación',
          'Las notificaciones están deshabilitadas. Puedes habilitarlas en la configuración de la app.',
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error al solicitar permisos de notificación:', error);
      return false;
    }
  }

  static async scheduleNotification(
    title: string,
    body: string,
    data?: any,
    triggerSeconds: number = 1
  ) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: { 
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: triggerSeconds 
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error al programar notificación:', error);
      return null;
    }
  }

  // Notificaciones específicas para cambios de estado
  static async notificarCambioEstado(
    ordenId: string,
    estadoAnterior: string,
    estadoNuevo: string,
    clienteNombre: string
  ) {
    const title = '📋 Estado de orden actualizado';
    const body = `Orden de ${clienteNombre}: ${estadoAnterior} → ${estadoNuevo}`;
    
    await this.scheduleNotification(title, body, {
      type: 'estado_orden',
      ordenId,
      estadoNuevo,
    });
  }

  static async notificarNuevaOrden(ordenId: string, clienteNombre: string, total: number) {
    const title = '🆕 Nueva orden registrada';
    const body = `Cliente: ${clienteNombre} - Total: $${total.toFixed(2)}`;
    
    await this.scheduleNotification(title, body, {
      type: 'nueva_orden',
      ordenId,
    });
  }

  static async notificarTurnoIniciado(fecha: string, hora: string) {
    const title = '⏰ Turno iniciado';
    const body = `Turno del ${fecha} comenzado a las ${hora}`;
    
    await this.scheduleNotification(title, body, {
      type: 'turno_iniciado',
      fecha,
      hora,
    });
  }

  static async notificarTurnoFinalizado(totalVentas: number, horasTrabajas: string) {
    const title = '✅ Turno finalizado';
    const body = `Ventas: $${totalVentas} - Horas: ${horasTrabajas}`;
    
    await this.scheduleNotification(title, body, {
      type: 'turno_finalizado',
      totalVentas,
    });
  }

  // Programar recordatorios
  static async programarRecordatorio(
    titulo: string,
    mensaje: string,
    fechaHora: Date,
    data?: any
  ) {
    const trigger = {
      type: Notifications.SchedulableTriggerInputTypes.DATE as Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(fechaHora)
    };
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🔔 ${titulo}`,
        body: mensaje,
        data: data || {},
      },
      trigger,
    });
  }

  // Cancelar todas las notificaciones pendientes
  static async cancelarTodasLasNotificaciones() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Obtener notificaciones pendientes
  static async obtenerNotificacionesPendientes() {
    return await Notifications.getAllScheduledNotificationsAsync();
  }
}
