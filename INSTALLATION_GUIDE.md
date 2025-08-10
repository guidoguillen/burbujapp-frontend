# 🚀 BURBUJAPP - Guía de Instalación Completa

Esta guía te permitirá configurar el entorno de desarrollo de BurbujApp en cualquier computadora nueva desde cero.

## 📋 Métodos de Instalación

### 🎯 Método 1: Instalación Automática (Recomendado)

#### Para Windows:
```powershell
# Descargar y ejecutar el script de instalación
irm https://raw.githubusercontent.com/guidoguillen/burbujapp-frontend/master/install-burbujapp.sh | iex
```

#### Para Linux/macOS:
```bash
# Descargar y ejecutar el script universal
curl -fsSL https://raw.githubusercontent.com/guidoguillen/burbujapp-frontend/master/install-burbujapp.sh | bash
```

### 🛠️ Método 2: Instalación Manual

#### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/guidoguillen/burbujapp-frontend.git
cd burbujapp-frontend
```

#### Paso 2: Ejecutar Script de Configuración

**Windows (PowerShell):**
```powershell
.\scripts\setup-dev-environment.ps1
```

**Windows (Batch):**
```cmd
.\scripts\setup-dev-environment.bat
```

**Linux/macOS:**
```bash
chmod +x scripts/setup-dev-environment.sh
./scripts/setup-dev-environment.sh
```

#### Paso 3: Iniciar el Entorno
```bash
npm run dev
```

### 🎮 Método 3: Usando npm (Si ya tienes el proyecto)

```bash
# Configurar entorno en proyecto existente
npm run setup

# Con extensiones de VS Code
npm run setup:extensions
```

## 📋 Prerequisitos del Sistema

### ✅ Herramientas Requeridas

1. **Node.js** (versión 18 o superior)
   - **Windows/macOS:** https://nodejs.org/
   - **Linux Ubuntu/Debian:** `sudo apt install nodejs npm`
   - **Linux CentOS/RHEL:** `sudo yum install nodejs npm`
   - **macOS (Homebrew):** `brew install node`

2. **Git** (para clonar el repositorio)
   - **Windows:** https://git-scm.com/
   - **Linux Ubuntu/Debian:** `sudo apt install git`
   - **Linux CentOS/RHEL:** `sudo yum install git`
   - **macOS (Homebrew):** `brew install git`

### ⚡ Herramientas Opcionales

- **VS Code** (recomendado): https://code.visualstudio.com/
- **Android Studio** (para emulador): https://developer.android.com/studio
- **Expo Go** (app móvil): Descargar desde App Store/Google Play

## 🔧 Configuración Detallada

### 1. Verificación de Prerequisitos

```bash
# Verificar versiones instaladas
node --version    # Debe ser v18 o superior
npm --version     # Incluido con Node.js
git --version     # Para clonar repositorio
```

### 2. Configuración de Red

El script detecta automáticamente tu IP local, pero puedes configurarla manualmente:

```typescript
// src/services/config/IpConfig.ts
export const LOCAL_IP = '192.168.1.XXX'; // Tu IP local
```

### 3. Configuración Manual de Dependencias

Si los scripts automáticos fallan:

```bash
# Limpiar instalaciones previas
rm -rf node_modules package-lock.json

# Instalar dependencias principales
npm install --legacy-peer-deps

# Instalar herramientas de desarrollo
npm install -D json-server @types/node --legacy-peer-deps

# Crear directorios necesarios
mkdir -p logs temp .expo
```

## 🎯 Scripts Disponibles Después de la Instalación

### 🚀 Desarrollo Diario
```bash
npm run dev          # Iniciar entorno completo (JSON Server + Expo)
npm run dev:fast     # Iniciar con API rápida (sin delay)
npm run dev:android  # Solo Android, no abre navegador
npm run dev:stop     # Detener todos los servicios
```

### 🗃️ Solo API Mock
```bash
npm run mock-api     # JSON Server con delay
npm run mock-api-fast # JSON Server sin delay
```

### 📱 Solo React Native
```bash
npm start            # Expo Dev Server general
npm run android      # Solo Android
npm run ios          # Solo iOS (macOS únicamente)
```

### ⚙️ Configuración
```bash
npm run setup                # Configurar entorno
npm run setup:extensions     # + extensiones VS Code
npm run clone-setup          # Clonar y configurar desde cero
```

## 🌐 URLs del Entorno

### 🗃️ JSON Server (Mock API)
- **Base:** http://localhost:3001
- **Clientes:** http://localhost:3001/clientes
- **Servicios:** http://localhost:3001/servicios
- **Órdenes:** http://localhost:3001/ordenes
- **Dashboard:** http://localhost:3001/dashboard

### 📱 Expo Dev Server
- **Metro Bundler:** http://localhost:8081
- **DevTools:** Se abre automáticamente

## 🔍 Solución de Problemas

### ❌ Error: "Node.js no encontrado"
```bash
# Verificar instalación
node --version

# Si no está instalado, descargar desde:
# https://nodejs.org/ (recomendado: versión LTS)
```

### ❌ Error: "Git no encontrado"
```bash
# Windows: Descargar desde https://git-scm.com/
# Linux: sudo apt install git
# macOS: brew install git
```

### ❌ Error: "Puerto 3001 ocupado"
```bash
# Detener servicios
npm run dev:stop-force

# O manualmente
netstat -ano | findstr :3001  # Windows
lsof -ti:3001 | xargs kill   # Linux/macOS
```

### ❌ Error: "EACCES permissions"
```bash
# Linux/macOS: Configurar npm para usuario actual
npm config set prefix ~/.npm-global
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### ❌ Error: "Cannot resolve dependency tree"
```bash
# Usar flag de legacy peer deps
npm install --legacy-peer-deps --force

# O limpiar cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### ❌ Error: "Expo CLI not found"
```bash
# Instalar Expo CLI globalmente
npm install -g @expo/cli

# O usar npx (recomendado)
npx expo start
```

## 📁 Estructura del Proyecto Después de la Instalación

```
burbujapp-frontend/
├── scripts/                     # Scripts de desarrollo
│   ├── setup-dev-environment.ps1   # Configuración Windows
│   ├── setup-dev-environment.sh    # Configuración Linux/macOS
│   ├── start-dev.ps1               # Inicio Windows
│   ├── stop-dev.ps1                # Detener Windows
│   └── clone-and-setup.ps1         # Clonado completo
├── src/                         # Código fuente
│   ├── services/config/         # Configuración API
│   ├── components/              # Componentes React Native
│   └── screens/                 # Pantallas
├── logs/                        # Logs de desarrollo
├── db.json                      # Base de datos mock
├── package.json                 # Dependencias y scripts
├── DEV_QUICK_START.md          # Guía rápida
├── JSON_SERVER_README.md       # Documentación API
└── INSTALLATION_GUIDE.md       # Esta guía
```

## 🆘 Comandos de Emergencia

### Reinicio Completo del Entorno
```bash
# Detener todo
npm run dev:stop-force

# Limpiar completamente
rm -rf node_modules package-lock.json logs/* temp/*

# Reinstalar
npm install --legacy-peer-deps

# Reiniciar
npm run dev
```

### Actualizar IP Local (Cambio de Red)
```bash
# 1. Obtener nueva IP
ipconfig          # Windows
ifconfig          # Linux/macOS

# 2. Actualizar configuración
# Editar: src/services/config/IpConfig.ts

# 3. Reiniciar servicios
npm run dev:stop && npm run dev
```

## 📚 Recursos Adicionales

- **Documentación Expo:** https://docs.expo.dev/
- **React Native:** https://reactnative.dev/
- **JSON Server:** https://github.com/typicode/json-server
- **Node.js:** https://nodejs.org/docs/
- **Git:** https://git-scm.com/docs

## 🤝 Ayuda y Soporte

Si tienes problemas con la instalación:

1. Verifica que cumples todos los prerequisitos
2. Revisa los logs en la carpeta `logs/`
3. Ejecuta los comandos de emergencia
4. Consulta la documentación específica de cada herramienta

---

**💡 Tip:** Para el 99% de los casos, simplemente ejecuta el script de instalación automática y luego `npm run dev`.
