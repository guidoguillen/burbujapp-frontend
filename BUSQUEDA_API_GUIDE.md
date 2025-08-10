# 🔍 Guía de Prueba - Búsqueda con Mock API

## ✅ Problema Resuelto

**Problema anterior:** El `BusquedaAvanzadaService` no estaba usando la mock API, solo trabajaba con datos locales.

**Solución implementada:** Se agregaron métodos que se conectan directamente al JSON Server.

## 🚀 Nuevos Métodos Disponibles

### 1. `buscarClientesAPI(filtros)`
```typescript
// Busca clientes directamente desde JSON Server
const resultado = await BusquedaAvanzadaService.buscarClientesAPI({
  texto: 'María',
  ordenarPor: 'fecha',
  direccionOrden: 'desc'
});
```

### 2. `buscarOrdenesAPI(filtros)`
```typescript
// Busca órdenes directamente desde JSON Server
const resultado = await BusquedaAvanzadaService.buscarOrdenesAPI({
  texto: 'pendiente',
  estado: ['pendiente', 'en_proceso'],
  ordenarPor: 'fecha',
  direccionOrden: 'desc'
});
```

### 3. `busquedaGlobalAPI(texto)`
```typescript
// Búsqueda global en clientes y órdenes
const resultado = await BusquedaAvanzadaService.busquedaGlobalAPI('María');
console.log(resultado.totalResultados); // Total encontrado
```

## 🧪 Cómo Probar

### Paso 1: Asegúrate que JSON Server esté corriendo
```bash
npm run dev        # Inicia todo el entorno
# O solo el API:
npm run mock-api   # Solo JSON Server
```

### Paso 2: Verifica que la API responda
```bash
# Verificar clientes
curl http://localhost:3001/clientes

# Verificar órdenes
curl http://localhost:3001/ordenes
```

### Paso 3: Usa el componente de prueba
```typescript
// Importar en tu pantalla
import { TestBusquedaScreen } from '../screens';

// O usar directamente el componente
import BusquedaClientesAPIComponent from '../components/forms/BusquedaClientesAPIComponent';
```

## 📋 Datos de Prueba Disponibles

### Clientes en db.json:
- **María González** - 70123456
- **Carlos Mendoza** - 70987654
- **Ana Rodríguez** - 70456789
- **Luis Mamani** - 70111222
- **Sofia Quispe** - 70333444

### Términos de búsqueda que funcionan:
- `María` - Encuentra María González
- `701` - Encuentra números que empiecen con 701
- `@email.com` - Encuentra emails
- `La Paz` - Encuentra direcciones en La Paz

## 🔧 Configuración

### URLs actualizadas:
```typescript
// En constants/index.ts
export const API_URLS = {
  BASE_URL: JSON_SERVER_URL,  // Apunta a localhost:3001
  CLIENTS: '/clientes',       // Endpoint correcto
  ORDERS: '/ordenes',         // Endpoint correcto
  SERVICES: '/servicios',     // Endpoint correcto
}
```

### IP Configuration:
```typescript
// En services/config/IpConfig.ts
export const LOCAL_IP = '192.168.0.29';  // Tu IP local
export const JSON_SERVER_PORT = '3001';
export const JSON_SERVER_URL = `http://${LOCAL_IP}:${JSON_SERVER_PORT}`;
```

## ✨ Nuevas Funcionalidades

### 🔍 Búsqueda en Tiempo Real
- Conecta directamente con JSON Server
- Filtros avanzados aplicados localmente después de obtener datos
- Búsqueda por texto en múltiples campos
- Ordenamiento configurable

### 📊 Información de Resultados
- Total de resultados encontrados
- Número de coincidencias de texto
- Filtros aplicados
- Tiempo de respuesta de la API

### 🎯 Filtros Disponibles
- **Texto:** Busca en nombre, teléfono, email, dirección
- **Fechas:** Rango de fechas de registro
- **Ordenamiento:** Por fecha, nombre, etc.
- **Dirección:** Ascendente o descendente

## 🐛 Solución de Problemas

### API no responde:
```bash
# Verificar que JSON Server esté corriendo
curl http://localhost:3001/clientes

# Si no responde, reiniciar:
npm run dev:stop
npm run dev
```

### Error de CORS:
```bash
# JSON Server maneja CORS automáticamente
# Verificar que la IP sea correcta en IpConfig.ts
```

### Datos vacíos:
```bash
# Verificar que db.json tenga datos
cat db.json | grep clientes
```

## 📱 Uso en Componentes

```typescript
import React, { useState } from 'react';
import BusquedaAvanzadaService from '../services/BusquedaAvanzadaService';

const MiComponente = () => {
  const [clientes, setClientes] = useState([]);

  const buscar = async (texto: string) => {
    try {
      const resultado = await BusquedaAvanzadaService.buscarClientesAPI({
        texto,
        ordenarPor: 'fecha',
        direccionOrden: 'desc'
      });
      
      setClientes(resultado.items);
      console.log(`Encontrados: ${resultado.total} clientes`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    // Tu UI aquí
  );
};
```

---

**✅ Ahora el BusquedaAvanzadaService SÍ usa la Mock API y puede buscar clientes en tiempo real desde JSON Server!**
