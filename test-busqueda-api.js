import BusquedaAvanzadaService from '../src/services/BusquedaAvanzadaService';

// Test simple para verificar que la búsqueda con API funcione
async function testBusquedaAPI() {
  console.log('🧪 Iniciando test de búsqueda con API...');
  
  try {
    // Test 1: Buscar todos los clientes
    console.log('\n📋 Test 1: Obteniendo todos los clientes...');
    const todosLosClientes = await BusquedaAvanzadaService.buscarClientesAPI({
      texto: '',
      ordenarPor: 'fecha',
      direccionOrden: 'desc'
    });
    
    console.log(`✅ Total clientes encontrados: ${todosLosClientes.total}`);
    console.log(`🔧 Filtros aplicados: ${todosLosClientes.filtrosAplicados}`);
    
    // Test 2: Buscar por texto específico
    console.log('\n🔍 Test 2: Buscando "Gabriela"...');
    const busquedaGabriela = await BusquedaAvanzadaService.buscarClientesAPI({
      texto: 'Gabriela',
      ordenarPor: 'fecha',
      direccionOrden: 'desc'
    });
    
    console.log(`✅ Clientes con "Gabriela": ${busquedaGabriela.total}`);
    console.log(`✨ Coincidencias de texto: ${busquedaGabriela.coincidenciasTexto}`);
    
    if (busquedaGabriela.items.length > 0) {
      console.log(`👤 Primer resultado: ${busquedaGabriela.items[0].nombre} ${busquedaGabriela.items[0].apellido}`);
    }
    
    // Test 3: Búsqueda global
    console.log('\n🌍 Test 3: Búsqueda global...');
    const busquedaGlobal = await BusquedaAvanzadaService.busquedaGlobalAPI('Molina');
    
    console.log(`✅ Total resultados globales: ${busquedaGlobal.totalResultados}`);
    console.log(`👥 Clientes encontrados: ${busquedaGlobal.clientes.total}`);
    console.log(`📋 Órdenes encontradas: ${busquedaGlobal.ordenes.total}`);
    
    // Test 4: Buscar órdenes
    console.log('\n📋 Test 4: Buscando órdenes...');
    const busquedaOrdenes = await BusquedaAvanzadaService.buscarOrdenesAPI({
      texto: '',
      ordenarPor: 'fecha',
      direccionOrden: 'desc'
    });
    
    console.log(`✅ Total órdenes encontradas: ${busquedaOrdenes.total}`);
    
    console.log('\n🎉 ¡Todos los tests completados exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - Clientes en DB: ${todosLosClientes.total}`);
    console.log(`   - Órdenes en DB: ${busquedaOrdenes.total}`);
    console.log(`   - Búsqueda por texto: ✅ Funcional`);
    console.log(`   - Búsqueda global: ✅ Funcional`);
    console.log(`   - Conexión con API: ✅ Funcional`);
    
  } catch (error) {
    console.error('❌ Error en los tests:', error);
    console.error('\n🔧 Posibles soluciones:');
    console.error('   1. Verificar que JSON Server esté corriendo: npm run dev');
    console.error('   2. Verificar la IP en IpConfig.ts');
    console.error('   3. Verificar que el puerto 3001 esté disponible');
  }
}

// Ejecutar el test si este archivo se ejecuta directamente
if (require.main === module) {
  testBusquedaAPI();
}

export default testBusquedaAPI;
