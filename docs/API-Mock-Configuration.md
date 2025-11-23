# 🔌 Configuración de API Mock - BurbujaApp

## Overview

El proyecto usa **json-server** como API mock en desarrollo. Se integra automáticamente con Expo y proporciona endpoints REST completos basados en `db.json`.

---

## 📍 Endpoints Disponibles

### Clientes

```
GET    /clientes              - Obtener todos los clientes
GET    /clientes/{id}         - Obtener cliente específico
POST   /clientes              - Crear nuevo cliente
PUT    /clientes/{id}         - Actualizar cliente
DELETE /clientes/{id}         - Eliminar cliente
```

**Ejemplo:**
```bash
curl http://localhost:3001/clientes
curl http://localhost:3001/clientes/cliente-001
curl -X POST http://localhost:3001/clientes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","apellido":"Pérez",...}'
```

### Órdenes

```
GET    /ordenes               - Obtener todas las órdenes
GET    /ordenes/{id}          - Obtener orden específica
POST   /ordenes               - Crear nueva orden
PUT    /ordenes/{id}          - Actualizar orden
DELETE /ordenes/{id}          - Eliminar orden
```

### Otros recursos

json-server detecta automáticamente todos los arrays en `db.json`:

```
GET    /endpoint              - Obtener todos
GET    /endpoint/{id}         - Obtener uno
POST   /endpoint              - Crear
PUT    /endpoint/{id}         - Actualizar
DELETE /endpoint/{id}         - Eliminar
```

---

## 📄 Estructura de db.json

```json
{
  "clientes": [
    {
      "id": "cliente-001",
      "nombre": "Gabriela",
      "apellido": "Molina",
      "email": "gabriel.molina@email.com",
      "telefono": "+591 79954303",
      "direccion": "Av. Banzer 3er anillo, zona norte",
      "telefonoSecundario": "+591 78123456",
      "estado": "Activo",
      "fechaCreacion": "2024-01-15T10:30:00Z",
      "totalOrdenes": 15,
      "ultimaOrden": "2024-08-05T14:20:00Z"
    }
  ],
  "ordenes": [
    {
      "id": "orden-001",
      "clienteId": "cliente-001",
      "descripcion": "Impresión de tarjetas",
      "total": 5000,
      "estado": "Completada",
      "fecha": "2024-08-05T14:20:00Z",
      "detalles": "100 tarjetas a color"
    }
  ]
}
```

---

## 🚀 Iniciar json-server

### Método 1: Setup completo (Recomendado)

```powershell
npm run setup:dev
```

Inicia todo: Node validation, npm install, json-server, Expo.

### Método 2: Solo json-server

```powershell
npm run dev:api:start
```

Solo inicia json-server en background.

### Método 3: Comando directo

```bash
npx json-server --watch db.json --port 3001 --host 0.0.0.0
```

---

## 🔧 Integración en la App

### Configuración en `src/services/api.ts`

```typescript
// Detectar si estamos en desarrollo
const MOCK_PORT = process.env.MOCK_API_PORT || 3001;

const API_BASE_URL = __DEV__
  ? `http://localhost:${MOCK_PORT}`  // Mock en desarrollo
  : 'https://api.produccion.com';    // Real en producción

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});
```

### Uso en componentes

```typescript
import { clientesApi } from './services/BurbujAppApiService';

// En un hook o función
const clientes = await clientesApi.getAll();
const cliente = await clientesApi.getById('cliente-001');
const nuevo = await clientesApi.create({...});
```

**Ver:** `src/services/BurbujAppApiService.example.ts` para ejemplos completos.

---

## 📝 Editar Datos

### Agregar cliente manualmente

1. Abre `db.json`
2. Agrega objeto a array `clientes`:

```json
{
  "id": "cliente-NNN",
  "nombre": "...",
  "apellido": "...",
  "email": "...",
  ...
}
```

3. Guarda el archivo
4. json-server detecta cambio automáticamente
5. Recarga app en Expo (presiona 'r')

### Agregar nueva sección (p.ej. "productos")

```json
{
  "clientes": [...],
  "ordenes": [...],
  "productos": [
    {
      "id": "prod-001",
      "nombre": "Tarjetas de visita",
      "precio": 50,
      "stock": 100
    }
  ]
}
```

Automáticamente disponible en:
```
GET    /productos
POST   /productos
PUT    /productos/{id}
DELETE /productos/{id}
```

---

## 🔄 Hot Reload

json-server detecta cambios automáticamente:

```
db.json (modificado)
   ↓
json-server detecta (en watch mode)
   ↓
Nueva data disponible en endpoints
   ↓
App recarga en Expo (presiona 'r')
   ↓
Usa data nueva
```

---

## 🌐 Acceso desde Dispositivo/Emulador

### Android (Emulador)

```
localhost:3001  →  10.0.2.2:3001
```

Configure así:

```typescript
const API_URL = __DEV__
  ? 'http://10.0.2.2:3001'   // Android emulator
  : 'http://localhost:3001';  // iOS / físico
```

O use variable de entorno:

```typescript
const API_URL = process.env.MOCK_API_URL;
```

### iOS (Emulador)

```
localhost:3001  ↔  localhost:3001
```

Funciona directo.

### Dispositivo Físico

```
localhost:3001  →  {IP_DE_MAQUINA_HOST}:3001
```

Configure:

```typescript
const HOST_IP = '192.168.1.100'; // IP de tu máquina
const API_URL = `http://${HOST_IP}:3001`;
```

---

## 📊 Monitoreo

### Ver requests a json-server

```powershell
npm run dev:api:status
```

### Logs en tiempo real

El output de json-server muestra todos los requests:

```
> json-server --watch db.json --port 3001

  ⌐ http://localhost:3001

GET /clientes 200 - - 2.345 ms
POST /clientes 201 - - 1.234 ms
PUT /clientes/cliente-001 200 - - 0.876 ms
DELETE /clientes/cliente-001 200 - - 0.543 ms
```

---

## 🔍 Filtros y Búsqueda

json-server soporta query parameters:

```
GET /clientes?estado=Activo              # Filtrar por estado
GET /clientes?nombre=Juan                # Buscar por nombre
GET /ordenes?clienteId=cliente-001       # Órdenes de cliente
GET /clientes?_sort=nombre&_order=asc    # Ordenar
GET /clientes?_limit=10&_page=1          # Paginación
```

---

## ⚙️ Puertos y Configuración

### Puerto Predeterminado: 3001

Si está ocupado, el script busca:
- 3002, 3003, 3004, ... hasta 3010

### Cambiar puerto manualmente

```powershell
# Especificar en el comando
npx json-server --watch db.json --port 3005 --host 0.0.0.0
```

### Host

```
--host 0.0.0.0   → Accesible desde cualquier máquina
--host localhost → Solo local
```

---

## 🧪 Testing

### Probar endpoints con curl

```bash
# Obtener todos
curl http://localhost:3001/clientes

# Obtener uno
curl http://localhost:3001/clientes/cliente-001

# Crear
curl -X POST http://localhost:3001/clientes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","apellido":"User","email":"test@test.com",...}'

# Actualizar
curl -X PUT http://localhost:3001/clientes/cliente-001 \
  -H "Content-Type: application/json" \
  -d '{"estado":"Inactivo"}'

# Eliminar
curl -X DELETE http://localhost:3001/clientes/cliente-001
```

### Probar desde Postman

1. Abre Postman
2. URL: `http://localhost:3001/clientes`
3. Método: GET, POST, PUT, DELETE
4. Headers: `Content-Type: application/json`
5. Body (JSON): datos

---

## 🔐 Seguridad en Desarrollo

⚠️ **json-server NO es seguro para producción:**

- No valida datos
- No autentifica
- No autoriza
- No encripta

**SOLO usar en desarrollo.**

Para producción: API real con seguridad.

---

## 📦 Sincronización con API Real

### Opción 1: Migrar datos

```typescript
// Exportar de json-server
const clientes = await fetch('http://localhost:3001/clientes').then(r => r.json());

// Importar a API real
await fetch('https://api.produccion.com/clientes/bulk', {
  method: 'POST',
  body: JSON.stringify(clientes),
});
```

### Opción 2: Usar configuración

```typescript
const API_URL = process.env.API_MODE === 'mock'
  ? 'http://localhost:3001'
  : 'https://api.produccion.com';
```

### Opción 3: Script de migración

```bash
# Exportar
npm run export-mock-data

# Importar
npm run import-to-production
```

---

## 📚 Recursos

- **JSON Server Docs:** https://github.com/typicode/json-server
- **REST API Guide:** https://restfulapi.net/
- **Axios Docs:** https://axios-http.com/

---

## 💡 Tips

1. **Siempre guardar `db.json` antes de editar** para evitar conflictos
2. **Usar IDs consistentes** (formato: `resource-NNN`)
3. **Mantener estructura consistente** en objetos
4. **Hacer backup de `db.json`** si tiene datos importantes
5. **Usar variables de entorno** para URLs del API

---

**Última actualización:** Noviembre 2025
