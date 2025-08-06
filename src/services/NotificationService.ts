import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configurar el comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
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
