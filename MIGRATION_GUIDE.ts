/**
 * GUÍA RÁPIDA: Cómo Usar el Nuevo Sistema de APIs
 * 
 * Este archivo te explica exactamente cómo migrar de OrderApiService
 * al nuevo sistema unificado BurbujAppApiService
 */

// =================== ANTES (OrderApiService) ===================
/*
import { OrderApiService } from '../services/OrderApiService';

// Crear instancia
const orderApi = new OrderApiService();

// Usar métodos
const clientes = await orderApi.getClientes();
const orden = await orderApi.createOrden(datos);
*/

// =================== AHORA (BurbujAppApiService) ===================

import { apiService } from '../services';
// Solo esta línea cambió ☝️

// Usar exactamente los mismos métodos
const clientes = await apiService.getClientes();
const orden = await apiService.createOrden(datos);

// =================== MIGRACIÓN PASO A PASO ===================

/**
 * 1. REEMPLAZAR IMPORTS
 */

// ❌ Antes:
// import { OrderApiService } from '../services/OrderApiService';

// ✅ Ahora:
import { apiService } from '../services';

/**
 * 2. REEMPLAZAR INSTANCIACIÓN
 */

// ❌ Antes:
// const orderApi = new OrderApiService();

// ✅ Ahora:
// Usar directamente apiService (ya es singleton)

/**
 * 3. REEMPLAZAR LLAMADAS A MÉTODOS
 */

// ❌ Antes:
// await orderApi.getClientes();
// await orderApi.createCliente(datos);

// ✅ Ahora:
await apiService.getClientes();
await apiService.createCliente(datos);

// =================== EJEMPLOS PRÁCTICOS ===================

/**
 * Ejemplo 1: Cargar clientes en SelectClienteScreen
 */
export const ejemploSelectCliente = async () => {
  try {
    // Antes tenías que crear instancia
    // const orderApi = new OrderApiService();
    
    // Ahora usas directamente
    const response = await apiService.getClientes({
      page: 1,
      limit: 20,
      search: busqueda,
      estado: 'Activo'
    });

    if (response.success) {
      setClientes(response.data);
      setPagination(response.pagination);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Ejemplo 2: Crear orden en NuevaOrdenScreen
 */
export const ejemploCrearOrden = async (ordenData: any) => {
  try {
    // ✅ Misma interfaz, funciona con mock o API real
    const response = await apiService.createOrden({
      clienteId: ordenData.clienteId,
      articulos: ordenData.articulos,
      subtotal: ordenData.subtotal,
      total: ordenData.total,
      usuarioCreacion: 'App Mobile'
    });

    if (response.success) {
      console.log('✅ Orden creada:', response.data.numeroOrden);
      return response.data;
    }
  } catch (error) {
    console.error('❌ Error creando orden:', error);
  }
};

/**
 * Ejemplo 3: Actualizar estado en DetalleOrdenScreen
 */
export const ejemploActualizarEstado = async (ordenId: string, nuevoEstado: string) => {
  try {
    const response = await apiService.updateEstadoOrden(ordenId, {
      nuevoEstado: nuevoEstado as any,
      observaciones: 'Actualizado desde app mobile',
      usuarioId: 'user-001'
    });

    if (response.success) {
      console.log('✅ Estado actualizado');
      return response.data;
    }
  } catch (error) {
    console.error('❌ Error actualizando estado:', error);
  }
};

// =================== CONFIGURACIÓN AUTOMÁTICA ===================

/**
 * El sistema detecta automáticamente si usar mocks o API real
 * según la configuración en src/services/config/ApiConfig.ts
 */

// Para DESARROLLO (usar mocks):
// export const CURRENT_ENVIRONMENT = 'development';

// Para PRODUCCIÓN (usar .NET Core):
// export const CURRENT_ENVIRONMENT = 'production';

// =================== VERIFICAR CONFIGURACIÓN ===================

import { getEnvironmentInfo, checkServiceHealth } from '../services';

/**
 * Verificar qué entorno estás usando
 */
export const verificarConfiguracion = async () => {
  const info = getEnvironmentInfo();
  console.log('🔧 Entorno actual:', info.environment);
  console.log('🌐 URL base:', info.baseUrl);
  console.log('🎭 Usando mocks:', info.useMock ? 'SÍ' : 'NO');
  
  const isHealthy = await checkServiceHealth();
  console.log('💚 Servicio disponible:', isHealthy ? 'SÍ' : 'NO');
  
  return { info, isHealthy };
};

// =================== MIGRACIÓN DE PANTALLAS ===================

/**
 * Lista de pantallas que necesitan migración:
 * 
 * ✅ SelectClienteScreen.tsx - Ya migrada
 * ✅ SelectArticulosScreen.tsx - Ya migrada  
 * ✅ MisOrdenesScreen.tsx - Ya migrada
 * ✅ DetalleOrdenScreen.tsx - Ya migrada
 * ✅ NuevaOrdenScreen.tsx - Ya migrada
 * 
 * Para otras pantallas, simplemente:
 * 1. Cambiar import: import { apiService } from '../services'
 * 2. Reemplazar: orderApi.metodo() → apiService.metodo()
 * 3. Mantener: Mismo manejo de errores y respuestas
 */

// =================== BENEFICIOS DEL NUEVO SISTEMA ===================

/**
 * ✅ Desarrollo sin backend
 * - Datos realistas con 55 clientes, 102 órdenes, 10 servicios
 * - Operaciones CRUD completas funcionando
 * - Latencia simulada para testing realista
 * 
 * ✅ Migración transparente
 * - Un solo cambio de configuración
 * - Misma interfaz de métodos
 * - Tipos TypeScript consistentes
 * 
 * ✅ Configuración flexible
 * - Múltiples entornos (dev, staging, prod)
 * - URLs configurables
 * - Headers automáticos
 * 
 * ✅ Monitoreo incluido
 * - Verificación de conectividad
 * - Información de entorno
 * - Estadísticas de uso
 */

// =================== SOLUCIÓN DE PROBLEMAS ===================

/**
 * Problema: "Cannot find module '../services'"
 * Solución: Verificar que exports estén en src/services/index.ts
 */

/**
 * Problema: "apiService is undefined"
 * Solución: Verificar import correcto:
 * import { apiService } from '../services';
 */

/**
 * Problema: "Métodos no funcionan"
 * Solución: Verificar configuración de entorno en ApiConfig.ts
 */

/**
 * Problema: "Datos no aparecen"
 * Solución: Verificar que useMock: true para desarrollo
 */

export default {
  ejemploSelectCliente,
  ejemploCrearOrden,
  ejemploActualizarEstado,
  verificarConfiguracion
};
