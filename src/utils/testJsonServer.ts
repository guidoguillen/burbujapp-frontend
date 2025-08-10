/**
 * Script de Prueba para JSON Server
 * Ejecutar desde la consola del navegador o un archivo de prueba
 */

import { apiService } from '../services';

// Función para probar todos los endpoints principales
export const testJsonServerEndpoints = async () => {
  console.log('🧪 Iniciando pruebas de JSON Server...\n');
  
  try {
    // 1. Información del ambiente
    console.log('🔧 Configuración del ambiente:');
    console.log(apiService.getEnvironmentInfo());
    console.log('\n');
    
    // 2. Probar clientes
    console.log('👥 Probando endpoint de clientes...');
    const clientesResponse = await apiService.getClientes();
    console.log('Resultado clientes:', {
      success: clientesResponse.success,
      cantidad: clientesResponse.data.length,
      primer_cliente: clientesResponse.data[0]?.nombre || 'Sin datos'
    });
    console.log('\n');
    
    // 3. Probar servicios
    console.log('🧽 Probando endpoint de servicios...');
    const serviciosResponse = await apiService.getServicios();
    console.log('Resultado servicios:', {
      success: serviciosResponse.success,
      cantidad: serviciosResponse.data.length,
      primer_servicio: serviciosResponse.data[0]?.nombre || 'Sin datos'
    });
    console.log('\n');
    
    // 4. Probar órdenes
    console.log('📋 Probando endpoint de órdenes...');
    const ordenesResponse = await apiService.getOrdenes();
    console.log('Resultado órdenes:', {
      success: ordenesResponse.success,
      cantidad: ordenesResponse.data.length,
      primera_orden: ordenesResponse.data[0]?.id || 'Sin datos'
    });
    console.log('\n');
    
    // 5. Resumen final
    const todoExitoso = clientesResponse.success && serviciosResponse.success && ordenesResponse.success;
    console.log(todoExitoso ? '✅ Todas las pruebas exitosas!' : '❌ Algunas pruebas fallaron');
    
    return {
      ambiente: apiService.getEnvironmentInfo(),
      clientes: clientesResponse,
      servicios: serviciosResponse,
      ordenes: ordenesResponse,
      exitoso: todoExitoso
    };
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
    return { error: error instanceof Error ? error.message : 'Error desconocido' };
  }
};

// Función para probar filtros y paginación
export const testJsonServerFilters = async () => {
  console.log('🔍 Probando filtros y paginación...\n');
  
  try {
    // Probar paginación de clientes
    const clientesPaginados = await apiService.getClientes({ 
      page: 1, 
      limit: 3 
    });
    console.log('Clientes paginados (página 1, límite 3):', clientesPaginados.data.length);
    
    // Probar filtro por categoría en servicios
    const serviciosLavado = await apiService.getServicios({ 
      categoria: 'lavado' 
    });
    console.log('Servicios de lavado:', serviciosLavado.data.length);
    
    return {
      clientes_paginados: clientesPaginados,
      servicios_lavado: serviciosLavado
    };
    
  } catch (error) {
    console.error('❌ Error en pruebas de filtros:', error);
    return { error: error instanceof Error ? error.message : 'Error desconocido' };
  }
};

// Función de prueba rápida para usar en componentes
export const quickTest = async () => {
  try {
    const resultado = await apiService.getClientes({ limit: 1 });
    console.log('🚀 Prueba rápida - JSON Server:', resultado.success ? '✅ Conectado' : '❌ Error');
    return resultado.success;
  } catch (error) {
    console.log('🚀 Prueba rápida - JSON Server: ❌ Error de conexión');
    return false;
  }
};
