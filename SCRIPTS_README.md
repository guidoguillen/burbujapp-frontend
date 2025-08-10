# 🚀 Scripts de Desarrollo - BurbujApp

Scripts automatizados para levantar el entorno completo de desarrollo con un solo comando.

## 📋 Scripts Disponibles

### 🎯 Comandos Principales

```bash
# Iniciar entorno completo (JSON Server + Expo)
npm run dev

# Iniciar con API rápida (sin delay)
npm run dev:fast

# Solo Android (no abre navegador)
npm run dev:android

# Detener todos los servicios
npm run dev:stop

# Detener forzadamente
npm run dev:stop-force
```

### 🔧 Scripts Individuales

```bash
# Solo JSON Server
npm run mock-api

# JSON Server rápido
npm run mock-api-fast

# Solo Expo
npm start
npm run android
```

## 📁 Archivos de Scripts

### 🚀 Scripts de Inicio

#### `scripts/start-dev.ps1` (PowerShell - Recomendado)
```powershell
# Uso básico
.\scripts\start-dev.ps1

# Con opciones
.\scripts\start-dev.ps1 -Fast -AndroidOnly

# Ver ayuda
.\scripts\start-dev.ps1 -Help
```

**Características:**
- ✅ Verificación automática de dependencias
- ✅ Instalación automática de json-server si no existe
- ✅ Verificación de estado de servicios
- ✅ Logs en tiempo real
- ✅ Gestión de errores
- ✅ Cleanup automático al salir

#### `scripts/start-dev.bat` (Batch - Compatibilidad)
```cmd
.\scripts\start-dev.bat
```

**Características:**
- ✅ Compatibilidad con sistemas antiguos
- ✅ Creación de ventanas separadas
- ✅ Logs guardados en archivos

### 🛑 Scripts de Detención

#### `scripts/stop-dev.ps1` (PowerShell - Recomendado)
```powershell
# Detener normalmente
.\scripts\stop-dev.ps1

# Forzar cierre
.\scripts\stop-dev.ps1 -Force

# Ver ayuda
.\scripts\stop-dev.ps1 -Help
```

**Características:**
- ✅ Detección inteligente de procesos
- ✅ Cierre limpio de servicios
- ✅ Verificación de puertos libres
- ✅ Limpieza de cache y logs
- ✅ Modo forzado para procesos colgados

#### `scripts/stop-dev.bat` (Batch - Compatibilidad)
```cmd
.\scripts\stop-dev.bat
```

## 🎛️ Opciones Avanzadas

### PowerShell con Parámetros

```powershell
# Script completo con todas las opciones
.\scripts\start-dev.ps1 -Fast -AndroidOnly

# Ver procesos corriendo
.\scripts\stop-dev.ps1 -Force
```

### Variables de Entorno (Opcional)

```cmd
# Configurar puerto personalizado para JSON Server
set JSON_SERVER_PORT=3002
npm run mock-api

# Configurar IP personalizada
set JSON_SERVER_HOST=192.168.1.100
npm run mock-api
```

## 📊 Servicios que se Inician

### 🗃️ JSON Server (Mock API)
- **Puerto:** 3001
- **URL:** http://localhost:3001
- **Endpoints:**
  - `/clientes` - Gestión de clientes
  - `/servicios` - Catálogo de servicios
  - `/ordenes` - Órdenes de trabajo
  - `/dashboard` - Métricas y estadísticas

### 📱 Expo Dev Server
- **Puerto:** 8081 (principal), 19000-19002 (túneles)
- **Funciones:**
  - Hot reload automático
  - Debugging en tiempo real
  - Conexión con emulador/dispositivo físico

## 🔍 Solución de Problemas

### ❌ Error: "json-server no encontrado"
```bash
# Instalar manualmente
npm install -D json-server --legacy-peer-deps
```

### ❌ Error: "Puerto 3001 ocupado"
```bash
# Detener servicios forzadamente
npm run dev:stop-force

# O manualmente
netstat -ano | findstr :3001
taskkill /f /pid <PID>
```

### ❌ Error: "Expo no inicia"
```bash
# Limpiar cache de Expo
npx expo install --fix
npx expo start --clear

# Reinstalar Expo CLI
npm install -g @expo/cli
```

### ❌ Error: "No se puede ejecutar PowerShell"
```cmd
# Habilitar ejecución de scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# O usar archivos .bat
.\scripts\start-dev.bat
```

### ❌ Error: "IP no accesible desde dispositivo"
1. Verificar IP en `src/services/config/IpConfig.ts`
2. Asegurar que el firewall permita puerto 3001
3. Conectar dispositivo a la misma red WiFi

## 📝 Logs y Debugging

### 📁 Ubicación de Logs
```
logs/
├── json-server.log    # Logs de la API mock
├── expo.log          # Logs de Expo Dev Server
└── error.log         # Errores generales
```

### 🔍 Ver Logs en Tiempo Real
```powershell
# PowerShell (integrado en script)
.\scripts\start-dev.ps1

# Manualmente
Get-Content logs\json-server.log -Wait
Get-Content logs\expo.log -Wait
```

## 🔄 Workflow Recomendado

### 💻 Desarrollo Diario
```bash
# 1. Iniciar entorno
npm run dev

# 2. Desarrollar código...

# 3. Al terminar
npm run dev:stop
```

### 🚀 Testing Rápido
```bash
# Para pruebas rápidas sin delay en API
npm run dev:fast

# Solo Android para testing específico
npm run dev:android
```

### 🧹 Limpieza Profunda
```bash
# Detener todo forzadamente
npm run dev:stop-force

# Limpiar node_modules (si es necesario)
rm -rf node_modules
npm install
```

## 📚 Scripts Relacionados

- 📖 `JSON_SERVER_README.md` - Documentación completa de JSON Server
- 🧪 `src/utils/testJsonServer.ts` - Herramientas de testing
- ⚙️ `src/services/config/IpConfig.ts` - Configuración de red

---

**💡 Tip:** Usa `npm run dev` para el 99% de casos. Los otros scripts son para situaciones específicas.
