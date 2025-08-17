# Guía para levantar el ambiente de desarrollo (Expo + API + impresora NIIBOT B1)

## Requisitos previos
- Node.js y npm instalados
- Android Studio (para emulador)
- Expo Go instalado en tu celular (Android/iOS)
- Impresora NIIBOT B1

## 1. Instalación de dependencias
```sh
npm install --force
```

## 2. Permisos Bluetooth (Expo)
Asegúrate de tener los permisos en `app.json`:
```json
"android": {
  "permissions": [
    "BLUETOOTH",
    "BLUETOOTH_ADMIN",
    "BLUETOOTH_CONNECT",
    "BLUETOOTH_SCAN",
    "ACCESS_FINE_LOCATION"
  ]
}
```

## 3. Levantar el API local
Si el puerto 3001 está libre:
```sh
npm run mock-api
```
Si el puerto 3001 está ocupado:
```sh
npx json-server --watch db.json --port 3002 --host 0.0.0.0
```

## 4. Levantar la app Expo
### En emulador Android:
1. Abre Android Studio y ejecuta un emulador desde el AVD Manager.
2. En la terminal del proyecto:
```sh
npx expo start --android
```

### En celular físico:
1. Conecta el celular por USB y activa la depuración USB.
2. En la terminal del proyecto:
```sh
npx expo start --android
```
3. O escanea el QR con Expo Go:
```sh
npx expo start
```

## 5. Impresión con NIIBOT B1
- Empareja la impresora por Bluetooth en el dispositivo.
- Usa el componente `PrintLabel` para imprimir etiquetas.

## 6. Solución de problemas
- Si hay errores de versiones, revisa que `react`, `react-native` y `react-test-renderer` tengan la misma versión.
- Si el API no inicia, cambia el puerto o detén el proceso que lo usa.
- Si Expo no detecta el emulador, verifica que esté corriendo en Android Studio.

---

¿Dudas? Contacta al equipo técnico.
