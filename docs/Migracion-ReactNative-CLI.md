# Migración de Expo a React Native CLI

## 🎯 Ventajas de React Native CLI
- ✅ Generar APK/AAB directamente
- ✅ Control total sobre la configuración nativa
- ✅ Acceso completo a APIs nativas
- ✅ Sin limitaciones de funcionalidades
- ✅ Tamaño de app más pequeño
- ✅ Performance mejor

## 📋 Plan de Migración

### Paso 1: Crear proyecto React Native CLI nuevo
```bash
npx react-native@latest init BurbujaAppRN --template react-native-template-typescript
cd BurbujaAppRN
```

### Paso 2: Migrar dependencias compatibles
- ✅ @react-navigation/* (compatible)
- ✅ react-native-screens (compatible)
- ✅ react-native-gesture-handler (compatible)
- ✅ @react-native-async-storage/async-storage (compatible)
- ❌ expo-* packages (necesitan alternativas)

### Paso 3: Reemplazar dependencias de Expo

| Expo Package | React Native CLI Alternative |
|--------------|------------------------------|
| expo-notifications | @react-native-community/push-notification-ios + react-native-push-notification |
| expo-file-system | react-native-fs |
| expo-document-picker | react-native-document-picker |
| expo-sharing | react-native-share |
| expo-linear-gradient | react-native-linear-gradient |
| expo-status-bar | StatusBar de react-native |

### Paso 4: Migrar código
- Remover imports de 'expo'
- Actualizar imports de packages
- Configurar Android/iOS específicos

## 🚀 Comandos para generar APK en React Native CLI

```bash
# Debug APK
cd android
./gradlew assembleDebug

# Release APK
./gradlew assembleRelease

# Bundle (para Play Store)
./gradlew bundleRelease
```

## ⚡ Alternativa rápida: Expo Prebuild (Híbrido)

Si quieres mantener algunas ventajas de Expo pero tener control nativo:

```bash
# Generar carpetas android/ios
npx expo prebuild

# Ahora puedes usar comandos de React Native CLI
npx react-native run-android
```
