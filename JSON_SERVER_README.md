# 🗃️ JSON Server - API Mock para BurbujApp

JSON Server está configurado como un mock completo del backend de BurbujApp para desarrollo y testing.

## 🚀 Cómo Iniciar JSON Server

### Opción 1: Con delay (simula latencia real)
```bash
npm run mock-api
```

### Opción 2: Sin delay (respuesta inmediata)
```bash
npm run mock-api-fast
```

## 🌐 Endpoints Disponibles

### Base URL
- **Desarrollo**: `http://192.168.0.29:3001`
- **Localhost**: `http://localhost:3001`

### 👥 Clientes
- `GET /clientes` - Listar todos los clientes
- `GET /clientes/:id` - Obtener cliente específico
- `POST /clientes` - Crear cliente
- `PUT /clientes/:id` - Actualizar cliente
- `DELETE /clientes/:id` - Eliminar cliente

### 🧽 Servicios
- `GET /servicios` - Listar todos los servicios
- `GET /servicios/:id` - Obtener servicio específico
- `POST /servicios` - Crear servicio
- `PUT /servicios/:id` - Actualizar servicio
- `DELETE /servicios/:id` - Eliminar servicio

### 📋 Órdenes
- `GET /ordenes` - Listar todas las órdenes
- `GET /ordenes/:id` - Obtener orden específica
- `POST /ordenes` - Crear orden
- `PUT /ordenes/:id` - Actualizar orden
- `DELETE /ordenes/:id` - Eliminar orden

### 📊 Dashboard
- `GET /dashboard` - Datos del dashboard (métricas, resúmenes)

## 🔍 Filtros y Consultas

JSON Server soporta filtros automáticos:

### Paginación
```
GET /clientes?_page=1&_limit=10
```

### Búsqueda de texto
```
GET /clientes?q=Gabriel
```

### Filtros por campo
```
GET /servicios?categoria=lavado
GET /ordenes?estado=pendiente
```

### Ordenamiento
```
GET /ordenes?_sort=fecha&_order=desc
```

### Rangos
```
GET /ordenes?fecha_gte=2024-01-01&fecha_lte=2024-12-31
```

## 🧪 Pruebas de Integración

### Desde la consola del navegador:
```javascript
// Importar la función de prueba
import { testJsonServerEndpoints } from './src/utils/testJsonServer';

// Ejecutar pruebas completas
testJsonServerEndpoints();

// Prueba rápida de conexión
import { quickTest } from './src/utils/testJsonServer';
quickTest();
```

### Desde un componente React Native:
```typescript
import { apiService } from '../services';

// Probar conexión
const testConnection = async () => {
  const result = await apiService.getClientes({ limit: 1 });
  console.log('JSON Server:', result.success ? '✅' : '❌');
};
```

## ⚙️ Configuración de IP

Para cambiar la IP del servidor cuando cambies de red:

1. Edita `src/services/config/IpConfig.ts`
2. Cambia la variable `LOCAL_IP` por tu nueva IP
3. Reinicia JSON Server

```typescript
// src/services/config/IpConfig.ts
export const LOCAL_IP = '192.168.1.100'; // Tu nueva IP
```

## 📁 Datos de Prueba

El archivo `db.json` contiene datos realistas para Bolivia:

- **7 clientes** con nombres bolivianos, teléfonos reales, direcciones de Santa Cruz
- **10 servicios** de lavandería con precios en bolivianos
- **4 órdenes** con diferentes estados y fechas
- **Datos de dashboard** con métricas de ejemplo

## 🔄 Recarga Automática

JSON Server vigila cambios en `db.json` automáticamente. Si modificas los datos, se recargan sin reiniciar el servidor.

## 🚦 Estados de Respuesta

JSON Server simula respuestas HTTP reales:

- ✅ **200 OK** - Operación exitosa
- ❌ **404 Not Found** - Recurso no encontrado
- ❌ **400 Bad Request** - Datos inválidos
- ❌ **500 Server Error** - Error del servidor

## 🔧 Solución de Problemas

### Error de conexión
1. Verifica que JSON Server esté corriendo: `npm run mock-api`
2. Confirma la IP en `IpConfig.ts`
3. Asegúrate de que el puerto 3001 esté libre

### Datos no se actualizan
1. Verifica que `db.json` tenga formato JSON válido
2. Revisa la consola de JSON Server para errores
3. Reinicia el servidor si es necesario

### CORS issues
JSON Server ya está configurado con CORS habilitado para desarrollo.

## 📚 Más Información

- [JSON Server Documentation](https://github.com/typicode/json-server)
- [React Native Networking](https://reactnative.dev/docs/network)

---

**Nota**: JSON Server es solo para desarrollo. En producción se conectará al backend .NET Core en Koyeb.
