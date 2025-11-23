# 🏗️ Arquitectura de Desarrollo - BurbujaApp

## Resumen General

El ambiente de desarrollo está optimizado para ejecutarse con **UN SOLO COMANDO**. Todos los servicios se inician de forma coordinada:

```
┌─────────────────────────────────────────────────────┐
│        npm run setup:dev                            │
│         (UN SOLO COMANDO)                           │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
   ┌─────────────┐      ┌─────────────┐
   │ json-server │      │    Expo     │
   │ (Mock API)  │      │  (App Dev)  │
   │ :3001       │      │  :19000     │
   └─────────────┘      └─────────────┘
        │                     │
        ├─ GET /clientes      ├─ Hot reload
        ├─ GET /ordenes       ├─ Emulator
        ├─ POST /clientes     └─ Device
        └─ ... CRUD ops
```

---

## 📁 Estructura de Scripts

```
scripts/
├── setup-full-dev.ps1      ⭐ Script maestro (nuevo)
│   └─ Orquesta todo
│   └─ Manejo inteligente de puertos
│   └─ Validación del entorno
│
├── dev-services.ps1        ⭐ Control de servicios (nuevo)
│   └─ Start/Stop/Restart
│   └─ API y Expo independientes
│   └─ Ver estado
│
├── check-environment.ps1   ✏️ Mejorado
│   └─ Diagnóstico completo
│   └─ Guía de comandos
│   └─ Validación de Node.js
│
└── clean-start.ps1         ⏱️ Mantenido
    └─ Limpiar caché
    └─ Reiniciar Expo
```

---

## 🔄 Flujo de Ejecución

### 1. Setup Completo (`npm run setup:dev`)

```powershell
setup-full-dev.ps1
│
├─ [PASO 1] Verificar Node.js & npm
│  └─ Si no están: ERROR + instrucciones
│
├─ [PASO 2] Validar archivos de configuración
│  ├─ app.json
│  ├─ package.json
│  ├─ db.json
│  └─ metro.config.js
│
├─ [PASO 3] Limpiar caché (si -ClearCache)
│  ├─ node_modules\.cache
│  └─ Expo cache
│
├─ [PASO 4] Instalar dependencias (si -SkipInstall no)
│  └─ npm install
│
├─ [PASO 5] Detectar puerto disponible
│  ├─ Verificar :3001
│  └─ Si ocupado → buscar :3002-3010
│
├─ [PASO 6] Iniciar json-server en background
│  ├─ PowerShell Background Job
│  ├─ Escucha datos desde db.json
│  └─ Expone endpoints REST
│
└─ [PASO 7] Iniciar Expo
   ├─ Hot reload habilitado
   ├─ Metro bundler
   └─ Espera a emulador o dispositivo
```

---

## 🎛️ Servicios Independientes

### JSON-Server (Mock API)

**Características:**
- ✅ RESTful API automático desde JSON
- ✅ Cambios en `db.json` → actualizaciones en vivo
- ✅ Soporte completo CRUD
- ✅ Detección automática de puertos

**Archivo de datos:** `db.json`

**Estructura actual:**
```json
{
  "clientes": [
    {
      "id": "cliente-001",
      "nombre": "...",
      "email": "...",
      "telefono": "...",
      "estado": "Activo",
      "totalOrdenes": 15,
      "ultimaOrden": "2024-08-05T14:20:00Z"
    }
  ],
  "ordenes": [
    {
      "id": "orden-001",
      "clienteId": "cliente-001",
      "descripcion": "...",
      "total": 1500,
      "estado": "Completada"
    }
  ]
}
```

**Endpoints disponibles:**
```
GET    /clientes              # Obtener todos
GET    /clientes/cliente-001  # Obtener uno
POST   /clientes              # Crear
PUT    /clientes/cliente-001  # Actualizar
DELETE /clientes/cliente-001  # Eliminar

# Igual para /ordenes y otros recursos
```

---

### Expo (Desarrollo de App)

**Características:**
- ✅ Hot reload en cambios de código
- ✅ Error overlay en tiempo real
- ✅ Metro bundler automático
- ✅ Acceso desde emulador o dispositivo

**Puertos:**
- `:19000` - Servidor Metro
- `:19001` - Expo DevTools

---

## 🔌 Integración API Mock en la App

### En `src/services/api.ts`:

```typescript
// Detectar puerto del mock desde variable de entorno
const MOCK_PORT = process.env.MOCK_API_PORT || 3001;

const API_BASE_URL = __DEV__ 
  ? `http://localhost:${MOCK_PORT}`
  : 'https://api.produccion.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

// Ejemplo de uso
export async function getClientes() {
  const { data } = await apiClient.get('/clientes');
  return data;
}

export async function createCliente(cliente: Cliente) {
  const { data } = await apiClient.post('/clientes', cliente);
  return data;
}
```

### En `src/services/BurbujAppApiService.ts`:

```typescript
import { API_BASE_URL } from './api';

// Usar la URL configurada
const endpoint = `${API_BASE_URL}/clientes`;
```

---

## ⚙️ Parámetros Opcionales

```powershell
npm run setup:dev [options]
```

| Parámetro | Función |
|-----------|---------|
| `-SkipInstall` | No instala `npm install` (más rápido) |
| `-SkipMock` | No inicia json-server (solo Expo) |
| `-AndroidOnly` | Solo inicializa emulador Android |
| `-ClearCache` | Limpia caché de Metro y Expo |

**Ejemplos:**
```powershell
# Rápido (sin reinstalar deps)
npm run setup:dev -SkipInstall

# Solo Expo
npm run setup:dev -SkipInstall -SkipMock

# Android únicamente
npm run setup:dev -SkipInstall -AndroidOnly

# Limpiar todo
npm run setup:dev -ClearCache
```

---

## 🎯 Manejo de Puertos

El sistema detecta automáticamente puertos en uso:

```
Puerto 3001 ← Preferido para Mock API
   ├─ Libre → USAR
   └─ En uso ↓
     
Buscar alternativo:
├─ Puerto 3002 → Libre? USAR
├─ Puerto 3003 → Libre? USAR
├─ ...
└─ Puerto 3010 → Último intento
```

La variable `$env:MOCK_API_PORT` se configura automáticamente para que el código de la app pueda usarla.

---

## 🚨 Validación y Errores

### Validaciones Pre-requisito:

1. **Node.js & npm presentes**
   - ✅ Si: Continuar
   - ❌ Si no: ERROR + links de instalación

2. **Archivos de configuración**
   - Verifica: `app.json`, `package.json`, `db.json`, `metro.config.js`
   - ❌ Si faltan: ERROR

3. **Puerto disponible**
   - Intenta :3001 → :3010
   - ⚠️ Si nada disponible: Advertencia

### Manejo de Errores:

- **npm install falla**: Sugiere `rm node_modules && npm install`
- **Expo no responde**: Presiona 'q' para exit, intenta `npm run clean-start`
- **json-server crash**: Script detecta y reinicia

---

## 📊 Monitoreo de Servicios

```powershell
# Ver estado de TODOS
npm run dev:status

# Ver solo API
npm run dev:api:status

# Ver en vivo (reintentar):
npm run dev:status
npm run dev:status
npm run dev:status
```

---

## 🔄 Trabajo Diario

### Mañana siguiente (rápido):
```powershell
npm run setup:dev -SkipInstall
```

### Si algo se daña:
```powershell
npm run setup:dev -SkipInstall -ClearCache
```

### Cambiar datos del mock:
1. Edita `db.json`
2. Recarga la app (presiona 'r' en Expo)
3. Listo

### Agregar nuevos recursos al API:
1. Agrega nueva sección en `db.json`
2. Reinicia json-server: `npm run dev:api:restart`
3. Úsalo en la app

---

## 🛠️ Troubleshooting Común

| Problema | Solución |
|----------|----------|
| "npm no reconocido" | Instala Node.js |
| Puerto 3001 ocupado | Script busca 3002-3010 automáticamente |
| Cache corrupto | `npm run setup:dev -ClearCache` |
| Expo no refresca | Presiona 'q' + `npm run clean-start` |
| json-server offline | `npm run dev:api:restart` |
| Cambios no aplican | Presiona 'r' en Expo |

---

## 🎓 Extensiones Futuras

Posibles mejoras:

- [ ] Agregar script para sincronizar `db.json` con DB real
- [ ] Webhooks para cambios de datos
- [ ] Modo offline con sincronización
- [ ] Database seeding automático
- [ ] Fixtures para testing
- [ ] Proxy para APIs reales

---

## 📚 Referencias

- **Expo Docs:** https://docs.expo.dev/
- **JSON Server:** https://github.com/typicode/json-server
- **React Native:** https://reactnative.dev/
- **Metro Bundler:** https://metrobundler.dev/
