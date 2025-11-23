# 🚀 Guía Rápida de Desarrollo - BurbujaApp

## Setup Inicial (Una sola vez)

### Opción 1: Setup Completo Automático ⭐ RECOMENDADO
```powershell
npm run setup:dev
```
Este comando hace TODO automáticamente:
- ✅ Valida Node.js y npm
- ✅ Instala dependencias
- ✅ Verifica configuración
- ✅ Inicia json-server (Mock API)
- ✅ Inicia Expo

### Opción 2: Setup Manual Paso a Paso
```powershell
# 1. Verificar entorno
npm run check-env

# 2. Instalar dependencias
npm install

# 3. Luego usar los comandos de desarrollo
```

---

## 📱 Desarrollo Diario

### Iniciar Todo (json-server + Expo)
```powershell
npm run setup:dev -SkipInstall
```

### Iniciar Sin Mock API
```powershell
npm run setup:dev -SkipInstall -SkipMock
```

### Iniciar Solo para Android
```powershell
npm run setup:dev -SkipInstall -AndroidOnly
```

### Limpiar Cache y Reiniciar
```powershell
npm run setup:dev -SkipInstall -ClearCache
```

---

## 🛠️ Control Manual de Servicios

### JSON-Server (Mock API en puerto 3001)

**Iniciar:**
```powershell
npm run dev:api:start
```

**Ver estado:**
```powershell
npm run dev:api:status
```

**Detener:**
```powershell
npm run dev:api:stop
```

**Reiniciar:**
```powershell
npm run dev:api:restart
```

### Expo

**Ver estado de todos los servicios:**
```powershell
npm run dev:status
```

**Detener todos:**
```powershell
npm run dev:stop
```

---

## 🐛 Troubleshooting

### Error: "npm no se reconoce"
**Solución:** Instala Node.js desde https://nodejs.org/

### Puerto 3001 en uso
El script detectará automáticamente puertos alternativos (3002-3010)

### Cache corrupto
```powershell
npm run setup:dev -ClearCache
```

### Dependencias problemáticas
```powershell
# Elimina y reinstala
rm -r node_modules
npm install
```

---

## 📦 API Mock (json-server)

- **Archivo de datos:** `db.json`
- **Endpoint base:** `http://localhost:3001`
- **Recursos disponibles:**
  - `GET /clientes` - Lista de clientes
  - `GET /ordenes` - Lista de órdenes
  - `POST /clientes` - Crear cliente
  - etc.

Edita `db.json` para agregar/modificar datos. Los cambios se aplican automáticamente.

---

## 🔗 Configurar App para Mock API

En `src/services/api.ts` o similar:

```typescript
const API_BASE_URL = process.env.MOCK_API_PORT 
  ? `http://localhost:${process.env.MOCK_API_PORT}`
  : 'https://api.produccion.com';
```

---

## 📚 Otros Comandos Útiles

```powershell
npm start              # Inicia Expo sin Mock API
npm run android        # Abre en emulador Android
npm run web            # Abre en navegador web
npm run test           # Ejecuta tests
npm run lint           # Verifica código
npm run type-check     # Verifica tipos TypeScript
npm run build:dev      # Build de desarrollo Android
npm run build:dev:ios  # Build de desarrollo iOS
```

---

## 🎯 Flujo de Trabajo Recomendado

### Primer uso:
```powershell
npm run setup:dev
```

### Cada que inicies sesión de desarrollo:
```powershell
npm run setup:dev -SkipInstall
```

### Si algo falla:
```powershell
npm run setup:dev -SkipInstall -ClearCache
```

### Para cambiar datos del API:
1. Edita `db.json`
2. Los cambios se aplican automáticamente en json-server
3. Recarga la app en Expo (presiona 'r')

---

## 📖 Documentación Completa

- `docs/Guia-Ambiente-Desarrollo.md` - Setup detallado
- `docs/Notificaciones-SDK53.md` - Notificaciones push
- `docs/Plan-Unit-Tests.md` - Testing
- `https://docs.expo.dev/` - Documentación oficial Expo

---

## 🆘 ¿Necesitas ayuda?

Ejecuta:
```powershell
npm run check-env
```

Este comando verifica toda tu configuración y sugiere soluciones.
