# 🚀 Sistema de APIs Mock/Real para BurbujApp

## 📋 Resumen

Este sistema permite a BurbujApp funcionar completamente durante el desarrollo usando datos simulados (mocks), y luego cambiar fácilmente al microservicio real en .NET Core 8 cuando esté listo.

## 🎯 Características Principales

### ✅ **Desarrollo sin Backend**
- **Datos realistas**: +50 clientes, +100 órdenes, 10 servicios
- **Operaciones completas**: CRUD completo para clientes, servicios y órdenes
- **Latencia simulada**: Delays realistas para simular red
- **Errores controlados**: Simulación de errores de red y validación

### ✅ **Transición Sin Código**
- **Un solo cambio**: Modificar `CURRENT_ENVIRONMENT` en `ApiConfig.ts`
- **Misma interfaz**: Los mismos métodos para mock y API real
- **Tipos consistentes**: TypeScript garantiza compatibilidad

### ✅ **Configuración Flexible**
- **Múltiples entornos**: development, staging, production
- **URLs configurables**: Fácil cambio entre servicios
- **Headers automáticos**: Autenticación y metadatos incluidos

## 📁 Estructura del Sistema

```
src/services/
├── config/
│   └── ApiConfig.ts          # Configuración centralizada
├── types/
│   └── ApiTypes.ts           # Tipos TypeScript completos
├── mock/
│   ├── MockData.ts           # Datos de prueba realistas
│   └── MockApiService.ts     # Servicio mock completo
├── examples/
│   └── ApiUsageExamples.ts   # Ejemplos de uso
├── BurbujAppApiService.ts    # Servicio principal unificado
└── index.ts                  # Exportaciones principales
```

## 🔧 Configuración Rápida

### 1. **Configurar Entorno**

```typescript
// src/services/config/ApiConfig.ts
export const CURRENT_ENVIRONMENT = 'development'; // Mock
// export const CURRENT_ENVIRONMENT = 'production'; // API Real
```

### 2. **Usar en Componentes**

```typescript
import { apiService } from '../services';

// Cargar clientes (funciona igual con mock o API real)
const clientes = await apiService.getClientes({
  page: 1,
  limit: 20,
  search: 'Gabriel'
});
```

## 🌐 Entornos Disponibles

| Entorno | Descripción | Base URL | Mock |
|---------|-------------|----------|------|
| `development` | Desarrollo local | `http://localhost:3000/api` | ✅ Si |
| `staging` | Testing en Koyeb | `https://burbujapp-staging.koyeb.app/api` | ❌ No |
| `production` | Producción | `https://burbujapp.koyeb.app/api` | ❌ No |

## 📊 APIs Disponibles

### 👥 **Clientes**
```typescript
// Listar con filtros
await apiService.getClientes({ search: 'Gabriel', estado: 'Activo' });

// Crear nuevo
await apiService.createCliente({
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan@email.com',
  telefono: '+591 78123456',
  direccion: 'Av. Principal #123'
});

// Actualizar
await apiService.updateCliente('cliente-001', { telefono: '+591 78999999' });
```

### 🧽 **Servicios**
```typescript
// Listar por categoría
await apiService.getServicios({ categoria: 'lavado', activo: true });

// Crear nuevo
await apiService.createServicio({
  nombre: 'Lavado Express',
  descripcion: 'Lavado rápido en 6 horas',
  categoria: 'lavado',
  precio: 12.00,
  unidad: 'kilo',
  tiempoEstimado: 6
});
```

### 📦 **Órdenes**
```typescript
// Buscar con filtros avanzados
await apiService.getOrdenes({
  estado: 'En proceso',
  urgente: true,
  fechaDesde: '2024-08-01',
  ordenarPor: 'fecha'
});

// Crear nueva
await apiService.createOrden({
  clienteId: 'cliente-001',
  articulos: [{
    servicioId: 'servicio-001',
    cantidad: 3,
    precioUnitario: 8.50,
    subtotal: 25.50
  }],
  total: 25.50,
  usuarioCreacion: 'App Mobile'
});

// Cambiar estado
await apiService.updateEstadoOrden('orden-001', {
  nuevoEstado: 'Listo',
  observaciones: 'Lavado completado',
  usuarioId: 'user-001'
});
```

### 📊 **Reportes**
```typescript
// Dashboard completo
const dashboard = await apiService.getDashboard();
console.log('Órdenes hoy:', dashboard.data.resumenHoy.ordenesNuevas);
```

### 📧 **Notificaciones**
```typescript
// Email
await apiService.sendNotification({
  destinatario: 'cliente@email.com',
  tipo: 'email',
  asunto: 'Su orden está lista',
  mensaje: 'Puede recoger su pedido'
});

// WhatsApp
await apiService.sendWhatsApp({
  numero: '+591 78123456',
  mensaje: 'Su orden ORD-20240809-0001 está lista para recoger'
});
```

## 🔄 Migración a .NET Core

### **Paso 1: Desplegar Microservicio**
```bash
# Desplegar en Koyeb
koyeb service create burbujapp-api \
  --docker-image your-registry/burbujapp-api:latest \
  --env DATABASE_URL=postgresql://... \
  --port 80
```

### **Paso 2: Cambiar Configuración**
```typescript
// ApiConfig.ts - Solo cambiar esta línea
export const CURRENT_ENVIRONMENT = 'production';
```

### **Paso 3: Verificar Conectividad**
```typescript
import { checkServiceHealth } from '../services';

const isReady = await checkServiceHealth();
if (isReady) {
  console.log('✅ Microservicio .NET Core conectado');
} else {
  console.log('❌ Problema de conectividad');
}
```

## 🧪 Testing y Desarrollo

### **Probar Sistema Completo**
```typescript
import { probarSistemaCompleto } from '../services/examples/ApiUsageExamples';

// Ejecuta todos los ejemplos
await probarSistemaCompleto();
```

### **Estadísticas Mock**
```typescript
import { mockApiService } from '../services';

const stats = mockApiService.getStats();
console.log('Datos mock:', stats);
// { clientes: 55, servicios: 10, ordenes: 102, ingresoTotal: 15420.50 }
```

## 🎨 Datos Mock Incluidos

### **55 Clientes Realistas**
- Nombres bolivianos auténticos
- Teléfonos con formato +591
- Direcciones de Santa Cruz
- Estados y fechas coherentes

### **102 Órdenes Variadas**
- Estados distribuidos realísticamente
- Montos coherentes con servicios
- Fechas de los últimos 2 meses
- Métodos de pago variados

### **10 Servicios Completos**
- 4 categorías: lavado, planchado, limpieza_seco, especiales
- Precios reales del mercado boliviano
- Tiempos estimados realistas
- Instrucciones detalladas

## 🚨 Manejo de Errores

### **Errores Simulados (Mock)**
```typescript
// 5% errores de red
// 2% errores de servidor  
// 8% errores de validación

try {
  await apiService.createCliente(datos);
} catch (error) {
  console.error('Error simulado:', error.message);
}
```

### **Errores Reales (API)**
```typescript
try {
  await apiService.getOrdenes();
} catch (error) {
  if (error.message.includes('404')) {
    console.log('Endpoint no encontrado');
  } else if (error.message.includes('500')) {
    console.log('Error del servidor');
  }
}
```

## 🔒 Autenticación

### **Configurar Token**
```typescript
import { setAuthToken } from '../services';

// Después del login exitoso
setAuthToken('jwt-token-from-backend');

// Las siguientes requests incluyen automáticamente:
// Authorization: Bearer jwt-token-from-backend
```

### **Limpiar Sesión**
```typescript
import { clearAuthToken } from '../services';

// Al logout
clearAuthToken();
```

## 📈 Monitoreo y Debug

### **Información del Entorno**
```typescript
import { getEnvironmentInfo } from '../services';

const info = getEnvironmentInfo();
console.log('Entorno actual:', info);
// {
//   environment: 'Desarrollo (Mock)',
//   baseUrl: 'http://localhost:3000/api',  
//   useMock: true,
//   version: 'v1'
// }
```

### **Verificar Conectividad**
```typescript
import { checkServiceHealth } from '../services';

const isHealthy = await checkServiceHealth();
console.log(isHealthy ? '🟢 Conectado' : '🔴 Sin conexión');
```

## 💡 Mejores Prácticas

### ✅ **Recomendado**
- Usar siempre `apiService` para requests
- Manejar errores con try/catch
- Verificar `response.success` antes de usar datos
- Usar TypeScript types para autocompletado

### ❌ **Evitar**
- Hacer requests directos con fetch()
- Hardcodear URLs en componentes
- Ignorar manejo de errores
- Usar `any` en lugar de tipos específicos

## 🚀 Próximos Pasos

1. **✅ Sistema Mock Completo** - Listo
2. **🔄 Desarrollo Frontend** - En progreso  
3. **⏳ Microservicio .NET Core** - Pendiente
4. **⏳ Deploy en Koyeb** - Pendiente
5. **⏳ Cambio a Producción** - Un solo cambio de configuración

---

## 🎉 Conclusión

Este sistema te permite:
- **Desarrollar sin esperar el backend**
- **Probar todas las funcionalidades**
- **Migrar sin cambios de código**
- **Mantener un solo punto de configuración**

**Resultado**: Una aplicación completamente funcional que se conectará al microservicio .NET Core con un solo cambio de configuración. 🚀
