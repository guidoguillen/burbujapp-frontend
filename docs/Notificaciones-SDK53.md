# 📱 Guía de Notificaciones - Expo SDK 53

## 🚨 Cambio Importante en SDK 53

**Expo removió el soporte para notificaciones push de Android en Expo Go a partir del SDK 53.**

### ❌ Lo que NO funciona en Expo Go:
- Notificaciones push remotas (desde servidor)
- Push tokens para servicios externos
- Firebase Cloud Messaging en Expo Go

### ✅ Lo que SÍ funciona en Expo Go:
- Notificaciones locales
- Notificaciones programadas
- Alertas dentro de la app

## 🔧 Soluciones Disponibles

### 1. **Continuar con Expo Go (Recomendado para desarrollo)**
```bash
# Las notificaciones locales funcionan perfectamente
# Solo usar para recordatorios y alertas locales
npm run start
```

### 2. **Crear Development Build (Para notificaciones push)**
```bash
# Instalar EAS CLI
npm install -g @expo/eas-cli

# Login en Expo
eas login

# Configurar proyecto
eas build:configure

# Crear development build para Android
eas build --platform android --profile development

# Crear development build para iOS
eas build --platform ios --profile development
```

### 3. **Usar Expo Dev Client**
```bash
# Instalar expo-dev-client
expo install expo-dev-client

# Crear build con dev client
eas build --platform android --profile development
```

## 📋 Configuración Actual del Proyecto

### Notificaciones Implementadas:
- ✅ **Cambio de estado de órdenes** (local)
- ✅ **Nueva orden registrada** (local)  
- ✅ **Turno iniciado** (local)
- ✅ **Turno finalizado** (local)
- ✅ **Recordatorios programados** (local)

### Servicios en `NotificationService.ts`:
```typescript
// Funciona en Expo Go
NotificationService.scheduleNotification()
NotificationService.notificarCambioEstado()
NotificationService.notificarNuevaOrden()
NotificationService.notificarTurnoIniciado()
NotificationService.notificarTurnoFinalizado()
NotificationService.programarRecordatorio()
```

## 🛠️ Implementación Actual

El proyecto está configurado para:
1. **Detectar automáticamente** si está corriendo en Expo Go
2. **Mostrar warnings** cuando funcionalidades no están disponibles
3. **Usar solo notificaciones locales** en Expo Go
4. **Estar listo** para notificaciones push en development build

## 🚀 Cómo Proceder

### Para Desarrollo Normal:
1. Usar Expo Go normalmente
2. Las notificaciones locales funcionan perfectamente
3. Ignorar el warning de expo-notifications

### Para Probar Notificaciones Push:
1. Crear un development build con EAS
2. Instalar el APK/IPA en el dispositivo
3. Implementar lógica de push tokens

## 📝 Archivos Modificados

- `src/services/NotificationService.ts` - Detecta Expo Go
- `src/config/DevelopmentBuildConfig.ts` - Configuración de funcionalidades
- Esta guía para documentación

## 🔍 Debugging

Si ves el error:
```
expo-notifications: Android Push notifications functionality was removed from Expo Go
```

**Es normal y esperado.** Solo significa que no puedes probar notificaciones push en Expo Go. Las notificaciones locales siguen funcionando.

## 📞 Próximos Pasos Recomendados

1. **Continuar desarrollo** con notificaciones locales
2. **Crear development build** cuando necesites probar push
3. **Implementar backend** para envío de notificaciones push
4. **Configurar Firebase** o servicio de push notifications

---

💡 **Tip**: Para la mayoría del desarrollo, las notificaciones locales son suficientes. Solo necesitas development build para testing con usuarios reales.
