# 🚀 BurbujaApp - Ambiente de Desarrollo Unificado

## ⚡ Inicio Rápido

### Primer uso
```powershell
npm run setup:dev
```

### Siguiente uso (rápido)
```powershell
npm run setup:dev -SkipInstall
```

**¡Listo!** En 10-15 segundos tu ambiente está completamente levantado con:
- ✅ Node.js validado
- ✅ Dependencias instaladas
- ✅ Mock API (json-server) en puerto 3001
- ✅ Expo iniciado
- ✅ Hot reload activo

---

## 📋 Requisitos Previos

- **Windows 10+** con PowerShell 5.1
- **Node.js 16+** (descargar de https://nodejs.org/)
- **Android Studio** (emulador, opcional)
- **Visual Studio Code** (recomendado)

Si Node.js no está instalado, el script te dará instrucciones automáticamente.

---

## 🎮 Comandos Principales

### Setup y Inicialización

```powershell
npm run setup:dev                    # Setup completo (primera vez)
npm run setup:dev -SkipInstall       # Setup sin reinstalar deps (rápido)
npm run setup:dev -ClearCache        # Setup limpiando cache (si hay problemas)
npm run setup:dev -SkipMock          # Setup sin mock API
npm run setup:dev -AndroidOnly       # Setup solo para Android
```

### Control de Servicios

```powershell
npm run dev:api:start                # Inicia json-server
npm run dev:api:stop                 # Detiene json-server
npm run dev:api:restart              # Reinicia json-server
npm run dev:api:status               # Ver estado

npm run dev:status                   # Ver estado de TODO
npm run dev:stop                     # Detener TODO
npm run dev:restart                  # Reiniciar TODO
```

### Diagnóstico

```powershell
npm run check-env                    # Verificar entorno
npm run clean-start                  # Limpiar cache y reiniciar
```

### Desarrollo

```powershell
npm test                             # Ejecutar tests
npm run lint                         # Linter
npm run type-check                   # TypeScript check
npm run build:dev                    # Build Android
npm run build:dev:ios                # Build iOS
```

---

## 📁 Estructura del Proyecto

```
burbujapp-frontend/
├── scripts/
│   ├── setup-full-dev-v2.ps1       ⭐ Script maestro
│   ├── dev-services.ps1             ⭐ Control de servicios
│   ├── check-environment.ps1        🔍 Verificación
│   ├── clean-start.ps1              🧹 Limpieza
│   └── README.md                    📖 Docs de scripts
│
├── src/
│   ├── components/
│   ├── screens/
│   ├── services/
│   │   ├── api.ts
│   │   ├── BurbujAppApiService.ts
│   │   └── BurbujAppApiService.example.ts  💡 EJEMPLOS DE USO
│   ├── context/
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── styles/
│
├── docs/
│   ├── Quick-Start.md               📖 LEER PRIMERO
│   ├── Arquitectura-Desarrollo.md   📖 Detalles técnicos
│   ├── API-Mock-Configuration.md    📖 Mock API
│   ├── Guia-Ambiente-Desarrollo.md  📖 Setup manual
│   └── Notificaciones-SDK53.md      📖 Push notifications
│
├── db.json                          📊 Datos del mock
├── app.json                         ⚙️ Config de Expo
├── package.json                     📦 Dependencias
├── metro.config.js                  ⚙️ Bundler
├── babel.config.js                  ⚙️ Babel
│
└── IMPLEMENTATION-SUMMARY.md        📄 Este resumen
```

---

## 🔌 Mock API (json-server)

El proyecto incluye un Mock API completo basado en JSON:

- **Puerto:** 3001 (o 3002-3010 si está ocupado)
- **Datos:** `db.json`
- **Endpoints:** `/clientes`, `/ordenes`, etc.

### Usar en la app

```typescript
import { clientesApi, ordenesApi } from './services/BurbujAppApiService';

// Obtener datos
const clientes = await clientesApi.getAll();
const cliente = await clientesApi.getById('cliente-001');

// Crear
const nuevo = await clientesApi.create({
  nombre: 'Juan',
  email: 'juan@email.com',
  // ...
});

// Ver ejemplo completo en:
// src/services/BurbujAppApiService.example.ts
```

### Editar datos

1. Abre `db.json`
2. Edita los datos
3. Los cambios se aplican automáticamente
4. Recarga la app (presiona 'r' en Expo)

---

## 🛠️ Troubleshooting

### "npm no se reconoce"
→ Instala Node.js desde https://nodejs.org/

### Puerto 3001 ocupado
→ El script detecta automáticamente y usa 3002-3010

### Cache corrupto
```powershell
npm run setup:dev -ClearCache
```

### Dependencias problemáticas
```powershell
rm -r node_modules
npm install
npm run setup:dev -SkipInstall
```

### Expo no refresca
```powershell
npm run clean-start
```

---

## 📚 Documentación

| Documento | Contenido |
|-----------|----------|
| `docs/Quick-Start.md` | **COMIENZA AQUÍ** - Comandos esenciales |
| `docs/Arquitectura-Desarrollo.md` | Detalles técnicos y flujos |
| `docs/API-Mock-Configuration.md` | Configuración de mock API |
| `docs/Guia-Ambiente-Desarrollo.md` | Setup manual paso a paso |
| `scripts/README.md` | Documentación de scripts |
| `IMPLEMENTATION-SUMMARY.md` | Resumen de la implementación |

---

## 💡 Tips Pro

1. **Abre dos PowerShell:**
   - Una para `npm run setup:dev`
   - Otra para comandos

2. **Monitorea el estado:**
   ```powershell
   npm run dev:status
   ```

3. **Edita `db.json` directamente** para cambiar datos

4. **Presiona 'r' en Expo** para hot reload

5. **Usa `-ClearCache`** si hay problemas

---

## 🔄 Flujo de Trabajo Recomendado

### Mañana siguiente
```powershell
npm run setup:dev -SkipInstall
# Espera 10-15 segundos
# ¡Listo para programar!
```

### Cambiar datos del API
```
Edita db.json
     ↓
Presiona 'r' en Expo
     ↓
App recarga con nuevos datos
```

### Si algo falla
```powershell
npm run setup:dev -SkipInstall -ClearCache
```

### Verificar que todo está bien
```powershell
npm run check-env
```

---

## 🎯 Tecnologías Usadas

- **React Native 0.79.5** - Framework principal
- **Expo 53** - Desarrollo y deployment
- **json-server 1.0** - Mock API
- **TypeScript** - Type safety
- **Jest** - Testing
- **ESLint** - Linting
- **Metro** - Bundler

---

## 📞 Ambiente

- **OS:** Windows 10/11
- **Shell:** PowerShell 5.1
- **Node:** 16+
- **npm:** 7+

---

## ✨ Resumen

Un solo comando para todo:

```powershell
npm run setup:dev
```

- Valida Node.js y npm ✅
- Instala dependencias ✅
- Inicia Mock API (json-server) ✅
- Inicia Expo con hot reload ✅
- Maneja puertos inteligentemente ✅

**Implementado:** Noviembre 2025  
**Versión:** 2.0 - Unified Development Environment  
**Estado:** ✅ PRODUCTIVO

---

## 🚀 ¡Listo para Desarrollar!

```powershell
npm run setup:dev
```

Luego presiona una opción en el menú de Expo:
- `a` - Android
- `i` - iOS  
- `w` - Web
- `j` - Debugger
- `o` - Abrir en navegador
- `r` - Recargar
- `m` - Menú
- `q` - Salir

---

**Documentación completa en:** `docs/Quick-Start.md`
