/**
 * Guía de Uso del Sistema de APIs Mock/Real
 * 
 * Este archivo contiene ejemplos de cómo usar el nuevo sistema unificado
 * que automáticamente cambia entre mocks y API real según configuración.
 */

import { 
  apiService, 
  setAuthToken, 
  getEnvironmentInfo,
  checkServiceHealth,
  API_CONFIG 
} from '../index';

import type { 
  CreateClienteRequest,
  CreateOrdenRequest,
  OrdenesQueryParams
} from '../types/ApiTypes';

// =================== CONFIGURACIÓN INICIAL ===================

/**
 * Verificar qué entorno estamos usando
 */
export const verificarEntorno = () => {
  const info = getEnvironmentInfo();
  console.log('🔧 Configuración actual:', info);
  
  if (info.useMock) {
    console.log('✅ Usando datos mock - Perfecto para desarrollo');
  } else {
    console.log('🌐 Usando API real - Conectando al microservicio .NET Core');
  }
  
  return info;
};

/**
 * Verificar conectividad
 */
export const verificarConectividad = async () => {
  console.log('🔍 Verificando conectividad...');
  
  const isHealthy = await checkServiceHealth();
  
  if (isHealthy) {
    console.log('✅ Servicio disponible');
  } else {
    console.log('❌ Servicio no disponible');
  }
  
  return isHealthy;
};

// =================== EJEMPLOS DE USO ===================

/**
 * Ejemplo: Cargar clientes con filtros
 */
export const ejemploCargarClientes = async () => {
  try {
    console.log('📋 Cargando clientes...');
    
    const response = await apiService.getClientes({
      page: 1,
      limit: 10,
      search: 'Gabriel',
      estado: 'Activo'
    });
    
    if (response.success) {
      console.log('✅ Clientes cargados:', response.data.length);
      console.log('📊 Paginación:', response.pagination);
      return response.data;
    }
  } catch (error) {
    console.error('❌ Error cargando clientes:', error);
  }
};

/**
 * Ejemplo: Crear nuevo cliente
 */
export const ejemploCrearCliente = async () => {
  try {
    const nuevoCliente: CreateClienteRequest = {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@email.com',
      telefono: '+591 78123456',
      direccion: 'Av. Principal #123, zona centro',
      estado: 'Activo'
    };
    
    console.log('👤 Creando cliente...');
    
    const response = await apiService.createCliente(nuevoCliente);
    
    if (response.success) {
      console.log('✅ Cliente creado:', response.data);
      return response.data;
    }
  } catch (error) {
    console.error('❌ Error creando cliente:', error);
  }
};

/**
 * Ejemplo: Cargar servicios por categoría
 */
export const ejemploCargarServicios = async () => {
  try {
    console.log('🧽 Cargando servicios de lavado...');
    
    const response = await apiService.getServicios({
      categoria: 'lavado',
      activo: true
    });
    
    if (response.success) {
      console.log('✅ Servicios cargados:', response.data.length);
      return response.data;
    }
  } catch (error) {
    console.error('❌ Error cargando servicios:', error);
  }
};

/**
 * Ejemplo: Crear nueva orden
 */
export const ejemploCrearOrden = async () => {
  try {
    const nuevaOrden: CreateOrdenRequest = {
      clienteId: 'cliente-001',
      articulos: [
        {
          servicioId: 'servicio-001',
          cantidad: 3,
          precioUnitario: 8.50,
          subtotal: 25.50,
          instrucciones: 'Separar colores claros'
        }
      ],
      subtotal: 25.50,
      descuento: 2.50,
      total: 23.00,
      metodoPago: 'efectivo',
      urgente: false,
      usuarioCreacion: 'Usuario App'
    };
    
    console.log('📦 Creando orden...');
    
    const response = await apiService.createOrden(nuevaOrden);
    
    if (response.success) {
      console.log('✅ Orden creada:', response.data.numeroOrden);
      return response.data;
    }
  } catch (error) {
    console.error('❌ Error creando orden:', error);
  }
};

/**
 * Ejemplo: Buscar órdenes con filtros avanzados
 */
export const ejemploBuscarOrdenes = async () => {
  try {
    const filtros: OrdenesQueryParams = {
      page: 1,
      limit: 20,
      estado: 'En proceso',
      urgente: true,
      fechaDesde: '2024-08-01',
      fechaHasta: '2024-08-31',
      ordenarPor: 'fecha',
      direccion: 'desc'
    };
    
    console.log('🔍 Buscando órdenes...');
    
    const response = await apiService.getOrdenes(filtros);
    
    if (response.success) {
      console.log('✅ Órdenes encontradas:', response.data.length);
      console.log('📊 Total:', response.pagination?.totalItems);
      return response.data;
    }
  } catch (error) {
    console.error('❌ Error buscando órdenes:', error);
  }
};

/**
 * Ejemplo: Actualizar estado de orden
 */
export const ejemploActualizarEstado = async (ordenId: string) => {
  try {
    console.log('⏫ Actualizando estado de orden...');
    
    const response = await apiService.updateEstadoOrden(ordenId, {
      nuevoEstado: 'Listo',
      observaciones: 'Lavado completado, listo para entrega',
      usuarioId: 'user-001'
    });
    
    if (response.success) {
      console.log('✅ Estado actualizado:', response.data.estado);
      return response.data;
    }
  } catch (error) {
    console.error('❌ Error actualizando estado:', error);
  }
};

/**
 * Ejemplo: Cargar dashboard con estadísticas
 */
export const ejemploCargarDashboard = async () => {
  try {
    console.log('📊 Cargando dashboard...');
    
    const response = await apiService.getDashboard();
    
    if (response.success) {
      console.log('✅ Dashboard cargado:');
      console.log('  - Órdenes hoy:', response.data.resumenHoy.ordenesNuevas);
      console.log('  - Ingresos hoy:', response.data.resumenHoy.ingresosDia);
      console.log('  - Clientes activos:', response.data.resumenSemana.clientesActivos);
      return response.data;
    }
  } catch (error) {
    console.error('❌ Error cargando dashboard:', error);
  }
};

/**
 * Ejemplo: Enviar notificación
 */
export const ejemploEnviarNotificacion = async () => {
  try {
    console.log('📧 Enviando notificación...');
    
    const response = await apiService.sendNotification({
      destinatario: 'gabriel.molina@email.com',
      tipo: 'email',
      asunto: 'Su orden está lista',
      mensaje: 'Estimado cliente, su orden ORD-20240809-0001 está lista para recoger.',
      plantilla: 'orden_lista'
    });
    
    if (response.success) {
      console.log('✅ Notificación enviada');
      return true;
    }
  } catch (error) {
    console.error('❌ Error enviando notificación:', error);
  }
};

// =================== FUNCIÓN DE TESTING COMPLETO ===================

/**
 * Ejecutar todos los ejemplos para probar el sistema
 */
export const probarSistemaCompleto = async () => {
  console.log('🧪 === INICIANDO PRUEBAS DEL SISTEMA API ===');
  
  // 1. Verificar configuración
  verificarEntorno();
  await verificarConectividad();
  
  // 2. Configurar autenticación (simulada)
  setAuthToken('mock-jwt-token-12345');
  
  // 3. Probar operaciones básicas
  console.log('\n📋 === PROBANDO CLIENTES ===');
  await ejemploCargarClientes();
  await ejemploCrearCliente();
  
  console.log('\n🧽 === PROBANDO SERVICIOS ===');
  await ejemploCargarServicios();
  
  console.log('\n📦 === PROBANDO ÓRDENES ===');
  await ejemploCrearOrden();
  await ejemploBuscarOrdenes();
  
  console.log('\n📊 === PROBANDO REPORTES ===');
  await ejemploCargarDashboard();
  
  console.log('\n📧 === PROBANDO NOTIFICACIONES ===');
  await ejemploEnviarNotificacion();
  
  console.log('\n✅ === PRUEBAS COMPLETADAS ===');
};

// =================== UTILITIES PARA DESARROLLO ===================

/**
 * Cambiar entorno en tiempo de ejecución (solo desarrollo)
 */
export const cambiarEntorno = (nuevoEntorno: string) => {
  console.log(`🔄 Cambiando entorno a: ${nuevoEntorno}`);
  console.log('⚠️  Nota: Esto requiere reiniciar la aplicación para que surta efecto');
  
  // En el archivo de configuración real, cambiarías CURRENT_ENVIRONMENT
  // Esto es solo para referencia durante desarrollo
};

/**
 * Obtener estadísticas del mock service
 */
export const obtenerEstadisticasMock = () => {
  if (API_CONFIG.useMock) {
    const stats = (global as any).mockApiService?.getStats?.();
    console.log('📊 Estadísticas del Mock Service:', stats);
    return stats;
  } else {
    console.log('ℹ️  No estás usando mocks actualmente');
    return null;
  }
};

export default {
  verificarEntorno,
  verificarConectividad,
  ejemploCargarClientes,
  ejemploCrearCliente,
  ejemploCargarServicios,
  ejemploCrearOrden,
  ejemploBuscarOrdenes,
  ejemploActualizarEstado,
  ejemploCargarDashboard,
  ejemploEnviarNotificacion,
  probarSistemaCompleto,
  cambiarEntorno,
  obtenerEstadisticasMock
};
