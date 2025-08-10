# 📋 Documentación Completa de APIs - Asistencia y Caja

## 🔍 Resumen de APIs Implementadas

### ✅ APIs Completadas:
1. **Clientes** - CRUD completo ✅
2. **Órdenes** - CRUD completo ✅  
3. **Usuarios** - CRUD completo ✅
4. **Registro de Asistencia** - Funcionalidad completa ✅
5. **Movimientos de Caja** - Funcionalidad completa ✅
6. **Arqueo de Caja** - Funcionalidad completa ✅

---

## 👥 APIs de Usuarios

### 1. Obtener Usuarios
```typescript
await busquedaService.obtenerUsuariosAPI()
```
**Respuesta:**
```json
{
  "success": true,
  "usuarios": [
    {
      "id": "usuario-001",
      "nombre": "Gabriel",
      "apellido": "Molina",
      "email": "gabriel.molina@admin.com",
      "telefono": "+591 79954303",
      "rol": "administrador",
      "estado": "Activo",
      "fechaCreacion": "2024-01-01T08:00:00Z",
      "ultimoAcceso": "2025-08-09T08:30:00Z"
    }
  ]
}
```

### 2. Crear Usuario
```typescript
await busquedaService.crearUsuarioAPI({
  nombre: "Ana",
  apellido: "García",
  email: "ana.garcia@operador.com",
  telefono: "+591 76543210",
  rol: "operador"
})
```

### 3. Actualizar Usuario (EDIT)
```typescript
await busquedaService.actualizarUsuarioAPI("usuario-001", {
  telefono: "+591 79954304",
  ultimoAcceso: new Date().toISOString()
})
```

### 4. Eliminar Usuario
```typescript
await busquedaService.eliminarUsuarioAPI("usuario-001")
```

---

## ⏰ APIs de Registro de Asistencia

### 1. Registrar Ingreso
```typescript
await busquedaService.registrarIngresoAPI("usuario-001", "Ingreso desde la app")
```
**Funcionalidad:**
- ✅ Registro automático de fecha y hora
- ✅ Geolocalización (coordenadas ejemplo)
- ✅ Estado "Trabajando"
- ✅ Observaciones personalizadas

### 2. Registrar Salida
```typescript
await busquedaService.registrarSalidaAPI("asistencia-123", "Salida desde la app")
```
**Funcionalidad:**
- ✅ Cálculo automático de horas trabajadas
- ✅ Actualización de estado a "Completado"
- ✅ Registro de hora de salida

### 3. Obtener Registros de Asistencia
```typescript
await busquedaService.obtenerRegistrosAsistenciaAPI()
```
**Respuesta:**
```json
{
  "success": true,
  "registros": [
    {
      "id": "asistencia-001",
      "usuarioId": "usuario-001",
      "usuario": {
        "id": "usuario-001",
        "nombre": "Gabriel",
        "apellido": "Molina",
        "rol": "administrador"
      },
      "fecha": "2025-08-09",
      "horaIngreso": "2025-08-09T08:00:00Z",
      "horaSalida": "2025-08-09T17:00:00Z",
      "horasTrabajadasPrevistas": 8,
      "horasTrabajadas": 9,
      "estado": "Completado",
      "observaciones": "Jornada normal",
      "ubicacion": {
        "latitud": -17.783327,
        "longitud": -63.182129,
        "direccion": "Oficina Principal, Santa Cruz"
      }
    }
  ]
}
```

---

## 💰 APIs de Movimientos de Caja

### 1. Registrar Movimiento de Caja
```typescript
await busquedaService.registrarMovimientoCajaAPI({
  tipo: "ingreso", // o "egreso"
  concepto: "Venta de servicios",
  monto: 250.75,
  metodoPago: "efectivo",
  usuarioId: "usuario-001",
  ordenId: "orden-001", // opcional
  numeroOrden: "ORD-001", // opcional
  cliente: "María López", // opcional
  descripcion: "Pago por servicios de burbuja",
  comprobante: "COMP-001" // opcional
})
```

**Tipos de movimiento:**
- ✅ `ingreso` - Entradas de dinero
- ✅ `egreso` - Salidas de dinero

**Métodos de pago soportados:**
- ✅ efectivo
- ✅ tarjeta
- ✅ transferencia
- ✅ qr

### 2. Obtener Movimientos de Caja
```typescript
await busquedaService.obtenerMovimientosCajaAPI()
```

---

## 📊 APIs de Arqueo de Caja

### 1. Crear Arqueo de Caja
```typescript
await busquedaService.crearArqueoCajaAPI({
  usuarioId: "usuario-001",
  turno: "mañana", // "mañana", "tarde", "noche"
  saldoInicial: 1000.00,
  saldoReal: 1250.75,
  detalleEfectivo: {
    billetes200: 5,
    billetes100: 2,
    billetes50: 1,
    billetes20: 2,
    billetes10: 0,
    monedas5: 0,
    monedas2: 1,
    monedas1: 0,
    centavos50: 1
  },
  observaciones: "Arqueo de turno mañana"
})
```

**Funcionalidad automática:**
- ✅ Cálculo de saldo teórico basado en movimientos del día
- ✅ Cálculo de diferencia (saldoReal - saldoTeorico)
- ✅ Estado automático: "cuadrado" o "descuadrado"
- ✅ Totales de ingresos y egresos del día

### 2. Obtener Arqueos de Caja
```typescript
await busquedaService.obtenerArqueosCajaAPI()
```

---

## 🧪 Pruebas con PowerShell

### Verificar todas las APIs:
```powershell
# Usuarios
Invoke-RestMethod -Uri "http://localhost:3001/usuarios" -Method GET

# Asistencia
Invoke-RestMethod -Uri "http://localhost:3001/registroAsistencia" -Method GET

# Movimientos de Caja
Invoke-RestMethod -Uri "http://localhost:3001/movimientosCaja" -Method GET

# Arqueos de Caja
Invoke-RestMethod -Uri "http://localhost:3001/arqueoCaja" -Method GET
```

### Crear datos de prueba:
```powershell
# Crear usuario
$nuevoUsuario = @{
    "nombre" = "Ana";
    "apellido" = "García";
    "email" = "ana.garcia@operador.com";
    "telefono" = "+591 76543210";
    "rol" = "operador"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/usuarios" -Method POST -Body $nuevoUsuario -ContentType "application/json"
```

---

## 🔧 Funcionalidades de Edición (EDIT)

### Todas las entidades soportan operaciones CRUD:

**Clientes:**
- ✅ `crearClienteAPI()`
- ✅ `buscarClientesAPI()`
- ✅ `actualizarClienteAPI()` ← EDIT
- ✅ `eliminarClienteAPI()`

**Órdenes:**
- ✅ `crearOrdenAPI()`
- ✅ `buscarOrdenesAPI()`
- ✅ `obtenerTodasLasOrdenesAPI()`
- ✅ `actualizarOrdenAPI()` ← EDIT
- ✅ `eliminarOrdenAPI()`
- ✅ `obtenerOrdenAPI()`

**Usuarios:**
- ✅ `crearUsuarioAPI()`
- ✅ `obtenerUsuariosAPI()`
- ✅ `actualizarUsuarioAPI()` ← EDIT
- ✅ `eliminarUsuarioAPI()`

---

## 📱 Componente de Prueba

**Ubicación:** `src/components/forms/TestAsistenciayCajaComponent.tsx`

**Funcionalidades incluidas:**
- ✅ Interfaz completa para todas las APIs
- ✅ Formularios para crear usuarios, movimientos y arqueos
- ✅ Botones para registrar ingreso/salida de asistencia
- ✅ Visualización de datos en tiempo real
- ✅ Estados de carga y manejo de errores
- ✅ Modales para formularios
- ✅ Actualización automática de datos

---

## 🎯 Estado Actual del Proyecto

### ✅ COMPLETADO:
1. **Base de Datos (db.json)** - Estructura completa con 6 entidades
2. **APIs de Clientes** - CRUD completo
3. **APIs de Órdenes** - CRUD completo
4. **APIs de Usuarios** - CRUD completo
5. **APIs de Asistencia** - Ingreso/salida con cálculo de horas
6. **APIs de Caja** - Movimientos y arqueos con cálculos automáticos
7. **Funciones de Edición** - Todas las entidades soportan UPDATE
8. **Componentes de Prueba** - Interfaces completas para testing
9. **Documentación** - Guías completas de uso

### 🔥 CARACTERÍSTICAS DESTACADAS:
- ✅ **JSON Server integrado** - Base de datos completa
- ✅ **Cálculos automáticos** - Horas trabajadas, saldos teóricos, diferencias
- ✅ **Geolocalización** - Tracking de ubicación en asistencia
- ✅ **Validaciones** - Control de errores y estados
- ✅ **UI/UX completa** - Interfaces intuitivas para todas las funciones
- ✅ **Testing con PowerShell** - Verificación completa de APIs

### 📋 RESUMEN DE PETICIÓN ORIGINAL:
**Solicitud:** "ahora apis para regisreo de ingreso y salida mas caja, tambien hacer la opcion del edit para todos los apis"

**✅ IMPLEMENTADO:**
1. ✅ APIs para registro de ingreso y salida de empleados
2. ✅ APIs para manejo de caja (movimientos y arqueos)
3. ✅ Opción de edición (EDIT) para TODAS las APIs existentes
4. ✅ Componentes de prueba funcionales
5. ✅ Documentación completa

---

## 🚀 ¿Cómo usar las nuevas funcionalidades?

1. **Asegurar JSON Server funcionando:**
   ```bash
   npm run json-server
   ```

2. **Importar el componente de prueba:**
   ```typescript
   import { TestAsistenciayCajaComponent } from '../components/forms';
   ```

3. **Usar las APIs en tu código:**
   ```typescript
   const busquedaService = BusquedaAvanzadaService.getInstance();
   
   // Registrar ingreso
   const ingreso = await busquedaService.registrarIngresoAPI("usuario-001");
   
   // Crear movimiento de caja
   const movimiento = await busquedaService.registrarMovimientoCajaAPI({
     tipo: "ingreso",
     concepto: "Venta",
     monto: 100,
     metodoPago: "efectivo",
     usuarioId: "usuario-001",
     descripcion: "Pago de cliente"
   });
   ```

¡Todas las APIs están listas y funcionando! 🎉
