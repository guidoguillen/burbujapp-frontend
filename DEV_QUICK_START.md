# 🎯 BURBUJAPP - Guía Rápida de Desarrollo

## 🚀 Comando Principal (Recomendado)

```bash
# Iniciar todo el entorno de desarrollo
npm run dev
```

**¿Qué hace?**
- ✅ Inicia JSON Server en puerto 3001 (Mock API)
- ✅ Inicia Expo Dev Server para React Native
- ✅ Verifica dependencias automáticamente
- ✅ Instala json-server si no está disponible
- ✅ Muestra logs en tiempo real

## ⚡ Variantes del Comando

```bash
# Sin delay en la API (respuestas instantáneas)
npm run dev:fast

# Solo Android (no abre navegador)
npm run dev:android

# Detener todos los servicios
npm run dev:stop

# Detener forzadamente (si algo se cuelga)
npm run dev:stop-force
```

## 🗃️ Solo JSON Server (API Mock)

```bash
# Con delay simulado
npm run mock-api

# Sin delay
npm run mock-api-fast
```

## 📱 Solo React Native

```bash
# Expo general
npm start

# Solo Android
npm run android

# Solo iOS (macOS únicamente)
npm run ios
```

## 🌐 URLs Importantes

### 🗃️ JSON Server (Mock API)
- **Base URL:** http://localhost:3001
- **Clientes:** http://localhost:3001/clientes
- **Servicios:** http://localhost:3001/servicios
- **Órdenes:** http://localhost:3001/ordenes
- **Dashboard:** http://localhost:3001/dashboard

### 📱 Expo Dev Server
- **Metro Bundler:** http://localhost:8081
- **DevTools:** Se abre automáticamente

## 🛠️ Configuración de Red

Si usas un dispositivo físico, actualiza la IP en:
```
src/services/config/IpConfig.ts
```

Cambia `LOCAL_IP` por la IP de tu máquina:
```typescript
export const LOCAL_IP = '192.168.1.XXX'; // Tu IP local
```

## 🎯 Workflow Diario

1. **Abrir terminal en la carpeta del proyecto**
2. **Ejecutar:** `npm run dev`
3. **Esperar a que aparezcan los mensajes de confirmación**
4. **Desarrollar tu código** 🎨
5. **Al terminar:** `npm run dev:stop`

## 🚨 Solución de Problemas

### ❌ Puerto ocupado
```bash
npm run dev:stop-force
```

### ❌ JSON Server no funciona
```bash
npm install -D json-server --legacy-peer-deps
npm run mock-api
```

### ❌ Expo no inicia
```bash
npx expo install --fix
npm start
```

### ❌ Cambio de red WiFi
1. Obtener nueva IP: `ipconfig` (Windows) o `ifconfig` (Mac/Linux)
2. Actualizar `src/services/config/IpConfig.ts`
3. Reiniciar: `npm run dev:stop && npm run dev`

## 📝 Logs y Debugging

Los logs se guardan automáticamente en:
- `logs/json-server.log`
- `logs/expo.log`

## 🆘 Comando de Emergencia

Si nada funciona:
```bash
npm run dev:stop-force
rm -rf node_modules
npm install
npm run dev
```

---

**💡 Tip:** `npm run dev` es todo lo que necesitas el 99% del tiempo.
