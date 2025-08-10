import { JSON_SERVER_URL } from './config/IpConfig';

export interface FiltrosBusqueda {
  texto: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  estado?: string[];
  cliente?: string;
  servicio?: string[];
  precioMin?: number;
  precioMax?: number;
  ordenarPor: 'fecha' | 'precio' | 'cliente' | 'estado';
  direccionOrden: 'asc' | 'desc';
  tipoServicio?: string[];
}

export interface ResultadoBusqueda<T> {
  items: T[];
  total: number;
  filtrosAplicados: number;
  coincidenciasTexto: number;
}

export class BusquedaAvanzadaService {
  private static instance: BusquedaAvanzadaService;

  static getInstance(): BusquedaAvanzadaService {
    if (!BusquedaAvanzadaService.instance) {
      BusquedaAvanzadaService.instance = new BusquedaAvanzadaService();
    }
    return BusquedaAvanzadaService.instance;
  }

  // Método privado para hacer llamadas a la API
  private async fetchFromApi<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${JSON_SERVER_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching from API: ${endpoint}`, error);
      throw error;
    }
  }

  // Método para buscar clientes usando la mock API
  async buscarClientesAPI(filtros: Partial<FiltrosBusqueda>): Promise<ResultadoBusqueda<any>> {
    try {
      // Obtener todos los clientes de la API
      const clientes = await this.fetchFromApi<any[]>('/clientes');
      
      // Aplicar filtros localmente
      return this.buscarClientes(clientes, filtros);
    } catch (error) {
      console.error('Error buscando clientes en API:', error);
      return {
        items: [],
        total: 0,
        filtrosAplicados: 0,
        coincidenciasTexto: 0,
      };
    }
  }

  // Método para buscar órdenes usando la mock API
  async buscarOrdenesAPI(filtros: FiltrosBusqueda): Promise<ResultadoBusqueda<any>> {
    try {
      // Obtener todas las órdenes desde JSON Server usando la nueva función
      const resultado = await this.obtenerTodasLasOrdenesAPI();
      
      if (!resultado.success || !resultado.ordenes) {
        throw new Error(resultado.error || 'No se pudieron obtener las órdenes');
      }
      
      // Aplicar filtros de búsqueda local a los datos de JSON Server
      return this.buscarOrdenes(resultado.ordenes, filtros);
    } catch (error) {
      console.error('❌ Error en buscarOrdenesAPI:', error);
      return {
        items: [],
        total: 0,
        filtrosAplicados: 0,
        coincidenciasTexto: 0,
      };
    }
  }

  // Método para búsqueda global usando la mock API
  async busquedaGlobalAPI(texto: string) {
    try {
      // Obtener datos de todas las entidades
      const [ordenes, clientes] = await Promise.all([
        this.fetchFromApi<any[]>('/ordenes'),
        this.fetchFromApi<any[]>('/clientes'),
      ]);

      const datos = { ordenes, clientes, turnos: [] }; // turnos por ahora vacío
      return this.busquedaGlobal(datos, texto);
    } catch (error) {
      console.error('Error en búsqueda global API:', error);
      return {
        ordenes: { items: [], total: 0, filtrosAplicados: 0, coincidenciasTexto: 0 },
        clientes: { items: [], total: 0, filtrosAplicados: 0, coincidenciasTexto: 0 },
        turnos: { items: [], total: 0, filtrosAplicados: 0, coincidenciasTexto: 0 },
        totalResultados: 0,
      };
    }
  }

  // Método para crear cliente usando la mock API
  async crearClienteAPI(datosCliente: {
    nombre: string;
    apellido: string;
    telefono: string;
    direccion: string;
    email?: string;
  }): Promise<{ success: boolean; cliente?: any; error?: string }> {
    try {
      // Generar ID único
      const clienteId = `cliente-${Date.now()}`;
      
      // Preparar datos del cliente
      const nuevoCliente = {
        id: clienteId,
        nombre: datosCliente.nombre,
        apellido: datosCliente.apellido,
        email: datosCliente.email || '',
        telefono: datosCliente.telefono,
        direccion: datosCliente.direccion,
        estado: 'Activo',
        fechaCreacion: new Date().toISOString(),
        totalOrdenes: 0,
        ultimaOrden: null
      };

      // Hacer POST a JSON Server
      const response = await fetch(`${JSON_SERVER_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoCliente)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const clienteCreado = await response.json();
      
      console.log('✅ Cliente creado exitosamente:', clienteCreado);
      
      return {
        success: true,
        cliente: clienteCreado
      };

    } catch (error) {
      console.error('❌ Error creando cliente:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Método para actualizar cliente usando la mock API
  async actualizarClienteAPI(clienteId: string, datosActualizados: {
    nombre?: string;
    apellido?: string;
    telefono?: string;
    direccion?: string;
    email?: string;
  }): Promise<{ success: boolean; cliente?: any; error?: string }> {
    try {
      // Hacer PUT a JSON Server
      const response = await fetch(`${JSON_SERVER_URL}/clientes/${clienteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosActualizados)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const clienteActualizado = await response.json();
      
      console.log('✅ Cliente actualizado exitosamente:', clienteActualizado);
      
      return {
        success: true,
        cliente: clienteActualizado
      };

    } catch (error) {
      console.error('❌ Error actualizando cliente:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Método para eliminar cliente usando la mock API
  async eliminarClienteAPI(clienteId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Hacer DELETE a JSON Server
      const response = await fetch(`${JSON_SERVER_URL}/clientes/${clienteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log('✅ Cliente eliminado exitosamente:', clienteId);
      
      return {
        success: true
      };

    } catch (error) {
      console.error('❌ Error eliminando cliente:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // ============================================
  // APIS PARA ÓRDENES (JSON SERVER)
  // ============================================

  // Método para crear orden usando JSON Server
  async crearOrdenAPI(datosOrden: {
    clienteId: string;
    cliente: any;
    articulos: any[];
    subtotal: number;
    descuento?: number;
    recargo?: number;
    total: number;
    metodoPago: string;
    urgente?: boolean;
    observaciones?: string;
    fechaEstimada?: string;
  }): Promise<{ success: boolean; orden?: any; error?: string }> {
    try {
      // Generar ID único y número de orden
      const ordenId = `orden-${Date.now()}`;
      const numeroOrden = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Date.now()).slice(-4)}`;
      
      // Preparar datos de la orden
      const nuevaOrden = {
        id: ordenId,
        numeroOrden: numeroOrden,
        clienteId: datosOrden.clienteId,
        cliente: datosOrden.cliente,
        articulos: datosOrden.articulos,
        subtotal: datosOrden.subtotal,
        descuento: datosOrden.descuento || 0,
        recargo: datosOrden.recargo || 0,
        total: datosOrden.total,
        estado: 'Registrado',
        fechaCreacion: new Date().toISOString(),
        fechaEstimada: datosOrden.fechaEstimada || null,
        fechaEntrega: null,
        observaciones: datosOrden.observaciones || null,
        metodoPago: datosOrden.metodoPago,
        urgente: datosOrden.urgente || false,
        pagado: false,
        historialEstados: [
          {
            id: `estado-${Date.now()}`,
            ordenId: ordenId,
            estadoAnterior: null,
            estadoNuevo: 'Registrado',
            fechaCambio: new Date().toISOString(),
            usuarioId: 'user-mobile',
            usuario: 'App Móvil',
            observaciones: 'Orden creada desde la aplicación móvil'
          }
        ],
        usuarioCreacion: 'App Móvil'
      };

      // Hacer POST a JSON Server
      const response = await fetch(`${JSON_SERVER_URL}/ordenes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaOrden)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const ordenCreada = await response.json();
      console.log('✅ Orden creada exitosamente:', ordenCreada);
      
      return {
        success: true,
        orden: ordenCreada
      };

    } catch (error) {
      console.error('❌ Error creando orden:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Método para actualizar orden usando JSON Server
  async actualizarOrdenAPI(ordenId: string, datosActualizados: Partial<any>): Promise<{ success: boolean; orden?: any; error?: string }> {
    try {
      // Hacer PATCH a JSON Server
      const response = await fetch(`${JSON_SERVER_URL}/ordenes/${ordenId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosActualizados)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const ordenActualizada = await response.json();
      console.log('✅ Orden actualizada exitosamente:', ordenActualizada);
      
      return {
        success: true,
        orden: ordenActualizada
      };

    } catch (error) {
      console.error('❌ Error actualizando orden:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Método para eliminar orden usando JSON Server
  async eliminarOrdenAPI(ordenId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Hacer DELETE a JSON Server
      const response = await fetch(`${JSON_SERVER_URL}/ordenes/${ordenId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log('✅ Orden eliminada exitosamente:', ordenId);
      
      return {
        success: true
      };

    } catch (error) {
      console.error('❌ Error eliminando orden:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Método para obtener una orden específica usando JSON Server
  async obtenerOrdenAPI(ordenId: string): Promise<{ success: boolean; orden?: any; error?: string }> {
    try {
      // Hacer GET a JSON Server
      const response = await fetch(`${JSON_SERVER_URL}/ordenes/${ordenId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const orden = await response.json();
      console.log('✅ Orden obtenida exitosamente:', orden);
      
      return {
        success: true,
        orden: orden
      };

    } catch (error) {
      console.error('❌ Error obteniendo orden:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Método para obtener todas las órdenes y aplicar búsqueda local
  async obtenerTodasLasOrdenesAPI(): Promise<{ success: boolean; ordenes?: any[]; error?: string }> {
    try {
      // Hacer GET a JSON Server para obtener todas las órdenes
      const response = await fetch(`${JSON_SERVER_URL}/ordenes`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const ordenes = await response.json();
      console.log('✅ Órdenes obtenidas exitosamente:', ordenes.length);
      
      return {
        success: true,
        ordenes: ordenes
      };

    } catch (error) {
      console.error('❌ Error obteniendo órdenes:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // ============================================
  // APIS PARA USUARIOS Y REGISTRO DE ASISTENCIA
  // ============================================

  // Método para obtener todos los usuarios
  async obtenerUsuariosAPI(): Promise<{ success: boolean; usuarios?: any[]; error?: string }> {
    try {
      const response = await fetch(`${JSON_SERVER_URL}/usuarios`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const usuarios = await response.json();
      console.log('✅ Usuarios obtenidos exitosamente:', usuarios.length);
      
      return {
        success: true,
        usuarios: usuarios
      };

    } catch (error) {
      console.error('❌ Error obteniendo usuarios:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Método para crear usuario
  async crearUsuarioAPI(datosUsuario: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    rol: string;
  }): Promise<{ success: boolean; usuario?: any; error?: string }> {
    try {
      const usuarioData = {
        id: `usuario-${Date.now()}`,
        nombre: datosUsuario.nombre,
        apellido: datosUsuario.apellido,
        email: datosUsuario.email,
        telefono: datosUsuario.telefono,
        rol: datosUsuario.rol,
        estado: 'Activo',
        fechaCreacion: new Date().toISOString(),
        ultimoAcceso: null
      };

      const response = await fetch(`${JSON_SERVER_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const usuarioCreado = await response.json();
      console.log('✅ Usuario creado exitosamente:', usuarioCreado);
      
      return {
        success: true,
        usuario: usuarioCreado
      };

    } catch (error) {
      console.error('❌ Error creando usuario:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Método para actualizar usuario
  async actualizarUsuarioAPI(usuarioId: string, datosActualizados: Partial<any>): Promise<{ success: boolean; usuario?: any; error?: string }> {
    try {
      const response = await fetch(`${JSON_SERVER_URL}/usuarios/${usuarioId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosActualizados)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const usuarioActualizado = await response.json();
      console.log('✅ Usuario actualizado exitosamente:', usuarioActualizado);
      
      return {
        success: true,
        usuario: usuarioActualizado
      };

    } catch (error) {
      console.error('❌ Error actualizando usuario:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Método para eliminar usuario
  async eliminarUsuarioAPI(usuarioId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${JSON_SERVER_URL}/usuarios/${usuarioId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log('✅ Usuario eliminado exitosamente:', usuarioId);
      
      return {
        success: true
      };

    } catch (error) {
      console.error('❌ Error eliminando usuario:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Método para registrar ingreso de asistencia
  async registrarIngresoAPI(usuarioId: string, observaciones?: string): Promise<{ success: boolean; registro?: any; error?: string }> {
    try {
      // Primero obtener datos del usuario
      const usuarioResponse = await fetch(`${JSON_SERVER_URL}/usuarios/${usuarioId}`);
      
      if (!usuarioResponse.ok) {
        throw new Error('Usuario no encontrado');
      }
      
      const usuario = await usuarioResponse.json();
      
      const registroData = {
        id: `asistencia-${Date.now()}`,
        usuarioId: usuarioId,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          rol: usuario.rol
        },
        fecha: new Date().toISOString().split('T')[0],
        horaIngreso: new Date().toISOString(),
        horaSalida: null,
        horasTrabajadasPrevistas: 8,
        horasTrabajadas: null,
        estado: 'Trabajando',
        observaciones: observaciones || 'Ingreso registrado desde la app',
        ubicacion: {
          latitud: -17.783327, // Coordenadas ejemplo de Santa Cruz
          longitud: -63.182129,
          direccion: 'Oficina Principal, Santa Cruz'
        }
      };

      const response = await fetch(`${JSON_SERVER_URL}/registroAsistencia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registroData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const registroCreado = await response.json();
      console.log('✅ Ingreso registrado exitosamente:', registroCreado);
      
      return {
        success: true,
        registro: registroCreado
      };

    } catch (error) {
      console.error('❌ Error registrando ingreso:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Método para registrar salida de asistencia
  async registrarSalidaAPI(registroId: string, observaciones?: string): Promise<{ success: boolean; registro?: any; error?: string }> {
    try {
      const horaSalida = new Date().toISOString();
      
      // Obtener el registro para calcular horas trabajadas
      const registroResponse = await fetch(`${JSON_SERVER_URL}/registroAsistencia/${registroId}`);
      
      if (!registroResponse.ok) {
        throw new Error('Registro no encontrado');
      }
      
      const registro = await registroResponse.json();
      
      // Calcular horas trabajadas
      const horaIngreso = new Date(registro.horaIngreso);
      const horaSalidaDate = new Date(horaSalida);
      const horasTrabajadas = Math.round((horaSalidaDate.getTime() - horaIngreso.getTime()) / (1000 * 60 * 60) * 100) / 100;
      
      const datosActualizados = {
        horaSalida: horaSalida,
        horasTrabajadas: horasTrabajadas,
        estado: 'Completado',
        observaciones: observaciones || 'Salida registrada desde la app'
      };

      const response = await fetch(`${JSON_SERVER_URL}/registroAsistencia/${registroId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosActualizados)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const registroActualizado = await response.json();
      console.log('✅ Salida registrada exitosamente:', registroActualizado);
      
      return {
        success: true,
        registro: registroActualizado
      };

    } catch (error) {
      console.error('❌ Error registrando salida:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Método para obtener registros de asistencia
  async obtenerRegistrosAsistenciaAPI(): Promise<{ success: boolean; registros?: any[]; error?: string }> {
    try {
      const response = await fetch(`${JSON_SERVER_URL}/registroAsistencia`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const registros = await response.json();
      console.log('✅ Registros de asistencia obtenidos:', registros.length);
      
      return {
        success: true,
        registros: registros
      };

    } catch (error) {
      console.error('❌ Error obteniendo registros de asistencia:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // ============================================
  // APIS PARA MANEJO DE CAJA
  // ============================================

  // Método para registrar movimiento de caja
  async registrarMovimientoCajaAPI(datosMovimiento: {
    tipo: 'ingreso' | 'egreso';
    concepto: string;
    monto: number;
    metodoPago: string;
    usuarioId: string;
    ordenId?: string;
    numeroOrden?: string;
    cliente?: string;
    descripcion: string;
    comprobante?: string;
  }): Promise<{ success: boolean; movimiento?: any; error?: string }> {
    try {
      // Obtener datos del usuario
      const usuarioResponse = await fetch(`${JSON_SERVER_URL}/usuarios/${datosMovimiento.usuarioId}`);
      
      if (!usuarioResponse.ok) {
        throw new Error('Usuario no encontrado');
      }
      
      const usuario = await usuarioResponse.json();
      
      const movimientoData = {
        id: `movimiento-${Date.now()}`,
        tipo: datosMovimiento.tipo,
        concepto: datosMovimiento.concepto,
        monto: datosMovimiento.monto,
        metodoPago: datosMovimiento.metodoPago,
        fecha: new Date().toISOString(),
        usuarioId: datosMovimiento.usuarioId,
        usuario: {
          nombre: usuario.nombre,
          apellido: usuario.apellido
        },
        ordenId: datosMovimiento.ordenId || null,
        numeroOrden: datosMovimiento.numeroOrden || null,
        cliente: datosMovimiento.cliente || null,
        descripcion: datosMovimiento.descripcion,
        estado: 'confirmado',
        comprobante: datosMovimiento.comprobante || `COMP-${Date.now()}`
      };

      const response = await fetch(`${JSON_SERVER_URL}/movimientosCaja`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movimientoData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const movimientoCreado = await response.json();
      console.log('✅ Movimiento de caja registrado:', movimientoCreado);
      
      return {
        success: true,
        movimiento: movimientoCreado
      };

    } catch (error) {
      console.error('❌ Error registrando movimiento de caja:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Método para obtener movimientos de caja
  async obtenerMovimientosCajaAPI(): Promise<{ success: boolean; movimientos?: any[]; error?: string }> {
    try {
      const response = await fetch(`${JSON_SERVER_URL}/movimientosCaja`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const movimientos = await response.json();
      console.log('✅ Movimientos de caja obtenidos:', movimientos.length);
      
      return {
        success: true,
        movimientos: movimientos
      };

    } catch (error) {
      console.error('❌ Error obteniendo movimientos de caja:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Método para crear arqueo de caja
  async crearArqueoCajaAPI(datosArqueo: {
    usuarioId: string;
    turno: string;
    saldoInicial: number;
    saldoReal: number;
    detalleEfectivo: any;
    observaciones?: string;
  }): Promise<{ success: boolean; arqueo?: any; error?: string }> {
    try {
      // Obtener movimientos del día para calcular totales
      const movimientosResponse = await this.obtenerMovimientosCajaAPI();
      
      if (!movimientosResponse.success) {
        throw new Error('No se pudieron obtener los movimientos');
      }
      
      const hoy = new Date().toISOString().split('T')[0];
      const movimientosHoy = movimientosResponse.movimientos?.filter(
        m => m.fecha.startsWith(hoy)
      ) || [];
      
      const totalIngresos = movimientosHoy
        .filter(m => m.tipo === 'ingreso')
        .reduce((sum, m) => sum + m.monto, 0);
      
      const totalEgresos = movimientosHoy
        .filter(m => m.tipo === 'egreso')
        .reduce((sum, m) => sum + m.monto, 0);
      
      const saldoTeorico = datosArqueo.saldoInicial + totalIngresos - totalEgresos;
      const diferencia = datosArqueo.saldoReal - saldoTeorico;
      
      // Obtener datos del usuario
      const usuarioResponse = await fetch(`${JSON_SERVER_URL}/usuarios/${datosArqueo.usuarioId}`);
      const usuario = await usuarioResponse.json();
      
      const arqueoData = {
        id: `arqueo-${Date.now()}`,
        fecha: hoy,
        usuarioId: datosArqueo.usuarioId,
        usuario: {
          nombre: usuario.nombre,
          apellido: usuario.apellido
        },
        turno: datosArqueo.turno,
        saldoInicial: datosArqueo.saldoInicial,
        totalIngresos: totalIngresos,
        totalEgresos: totalEgresos,
        saldoTeorico: saldoTeorico,
        saldoReal: datosArqueo.saldoReal,
        diferencia: diferencia,
        estado: Math.abs(diferencia) < 0.01 ? 'cuadrado' : 'descuadrado',
        observaciones: datosArqueo.observaciones || 'Arqueo de caja',
        detalleEfectivo: datosArqueo.detalleEfectivo,
        fechaCreacion: new Date().toISOString()
      };

      const response = await fetch(`${JSON_SERVER_URL}/arqueoCaja`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arqueoData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arqueoCreado = await response.json();
      console.log('✅ Arqueo de caja creado:', arqueoCreado);
      
      return {
        success: true,
        arqueo: arqueoCreado
      };

    } catch (error) {
      console.error('❌ Error creando arqueo de caja:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Método para obtener arqueos de caja
  async obtenerArqueosCajaAPI(): Promise<{ success: boolean; arqueos?: any[]; error?: string }> {
    try {
      const response = await fetch(`${JSON_SERVER_URL}/arqueoCaja`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arqueos = await response.json();
      console.log('✅ Arqueos de caja obtenidos:', arqueos.length);
      
      return {
        success: true,
        arqueos: arqueos
      };

    } catch (error) {
      console.error('❌ Error obteniendo arqueos de caja:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Búsqueda de órdenes con filtros avanzados
  buscarOrdenes(ordenes: any[], filtros: FiltrosBusqueda): ResultadoBusqueda<any> {
    let resultados = [...ordenes];
    let filtrosAplicados = 0;
    let coincidenciasTexto = 0;

    // Filtro por texto (busca en múltiples campos)
    if (filtros.texto.trim()) {
      const textoBusqueda = filtros.texto.toLowerCase();
      resultados = resultados.filter(orden => {
        const campos = [
          orden.id?.toString() || '',
          orden.cliente?.nombre || '',
          orden.cliente?.telefono || '',
          orden.servicios?.map((s: any) => s.tipo).join(' ') || '',
          orden.notas || '',
          orden.observaciones || '',
        ];
        
        const coincide = campos.some(campo => 
          campo.toLowerCase().includes(textoBusqueda)
        );
        
        if (coincide) coincidenciasTexto++;
        return coincide;
      });
      filtrosAplicados++;
    }

    // Filtro por rango de fechas
    if (filtros.fechaInicio || filtros.fechaFin) {
      resultados = resultados.filter(orden => {
        const fechaOrden = new Date(orden.fecha_creacion);
        let cumple = true;

        if (filtros.fechaInicio) {
          cumple = cumple && fechaOrden >= filtros.fechaInicio;
        }

        if (filtros.fechaFin) {
          const fechaFin = new Date(filtros.fechaFin);
          fechaFin.setHours(23, 59, 59, 999); // Incluir todo el día
          cumple = cumple && fechaOrden <= fechaFin;
        }

        return cumple;
      });
      filtrosAplicados++;
    }

    // Filtro por estado
    if (filtros.estado && filtros.estado.length > 0) {
      resultados = resultados.filter(orden => 
        filtros.estado!.includes(orden.estado)
      );
      filtrosAplicados++;
    }

    // Filtro por cliente
    if (filtros.cliente) {
      const clienteBusqueda = filtros.cliente.toLowerCase();
      resultados = resultados.filter(orden => 
        orden.cliente?.nombre?.toLowerCase().includes(clienteBusqueda) ||
        orden.cliente?.telefono?.includes(clienteBusqueda)
      );
      filtrosAplicados++;
    }

    // Filtro por tipo de servicio
    if (filtros.servicio && filtros.servicio.length > 0) {
      resultados = resultados.filter(orden => 
        orden.servicios?.some((s: any) => 
          filtros.servicio!.includes(s.tipo)
        )
      );
      filtrosAplicados++;
    }

    // Filtro por rango de precio
    if (filtros.precioMin !== undefined || filtros.precioMax !== undefined) {
      resultados = resultados.filter(orden => {
        const precio = parseFloat(orden.total || 0);
        let cumple = true;

        if (filtros.precioMin !== undefined) {
          cumple = cumple && precio >= filtros.precioMin;
        }

        if (filtros.precioMax !== undefined) {
          cumple = cumple && precio <= filtros.precioMax;
        }

        return cumple;
      });
      filtrosAplicados++;
    }

    // Ordenamiento
    resultados = this.ordenarResultados(resultados, filtros.ordenarPor, filtros.direccionOrden);

    return {
      items: resultados,
      total: resultados.length,
      filtrosAplicados,
      coincidenciasTexto,
    };
  }

  // Búsqueda de clientes
  buscarClientes(clientes: any[], filtros: Partial<FiltrosBusqueda>): ResultadoBusqueda<any> {
    let resultados = [...clientes];
    let filtrosAplicados = 0;
    let coincidenciasTexto = 0;

    // Filtro por texto
    if (filtros.texto?.trim()) {
      const textoBusqueda = filtros.texto.toLowerCase();
      resultados = resultados.filter(cliente => {
        const campos = [
          cliente.nombre || '',
          cliente.telefono || '',
          cliente.email || '',
          cliente.direccion || '',
        ];
        
        const coincide = campos.some(campo => 
          campo.toLowerCase().includes(textoBusqueda)
        );
        
        if (coincide) coincidenciasTexto++;
        return coincide;
      });
      filtrosAplicados++;
    }

    // Filtro por fecha de registro
    if (filtros.fechaInicio || filtros.fechaFin) {
      resultados = resultados.filter(cliente => {
        const fechaRegistro = new Date(cliente.fecha_registro);
        let cumple = true;

        if (filtros.fechaInicio) {
          cumple = cumple && fechaRegistro >= filtros.fechaInicio;
        }

        if (filtros.fechaFin) {
          const fechaFin = new Date(filtros.fechaFin);
          fechaFin.setHours(23, 59, 59, 999);
          cumple = cumple && fechaRegistro <= fechaFin;
        }

        return cumple;
      });
      filtrosAplicados++;
    }

    // Ordenamiento
    if (filtros.ordenarPor && filtros.direccionOrden) {
      resultados = this.ordenarResultados(resultados, filtros.ordenarPor, filtros.direccionOrden);
    }

    return {
      items: resultados,
      total: resultados.length,
      filtrosAplicados,
      coincidenciasTexto,
    };
  }

  // Búsqueda de turnos
  buscarTurnos(turnos: any[], filtros: Partial<FiltrosBusqueda>): ResultadoBusqueda<any> {
    let resultados = [...turnos];
    let filtrosAplicados = 0;
    let coincidenciasTexto = 0;

    // Filtro por texto
    if (filtros.texto?.trim()) {
      const textoBusqueda = filtros.texto.toLowerCase();
      resultados = resultados.filter(turno => {
        const campos = [
          turno.cliente?.nombre || '',
          turno.cliente?.telefono || '',
          turno.servicio || '',
          turno.notas || '',
        ];
        
        const coincide = campos.some(campo => 
          campo.toLowerCase().includes(textoBusqueda)
        );
        
        if (coincide) coincidenciasTexto++;
        return coincide;
      });
      filtrosAplicados++;
    }

    // Filtro por fecha
    if (filtros.fechaInicio || filtros.fechaFin) {
      resultados = resultados.filter(turno => {
        const fechaTurno = new Date(turno.fecha);
        let cumple = true;

        if (filtros.fechaInicio) {
          cumple = cumple && fechaTurno >= filtros.fechaInicio;
        }

        if (filtros.fechaFin) {
          const fechaFin = new Date(filtros.fechaFin);
          fechaFin.setHours(23, 59, 59, 999);
          cumple = cumple && fechaTurno <= fechaFin;
        }

        return cumple;
      });
      filtrosAplicados++;
    }

    // Filtro por estado
    if (filtros.estado && filtros.estado.length > 0) {
      resultados = resultados.filter(turno => 
        filtros.estado!.includes(turno.estado)
      );
      filtrosAplicados++;
    }

    // Ordenamiento
    if (filtros.ordenarPor && filtros.direccionOrden) {
      resultados = this.ordenarResultados(resultados, filtros.ordenarPor, filtros.direccionOrden);
    }

    return {
      items: resultados,
      total: resultados.length,
      filtrosAplicados,
      coincidenciasTexto,
    };
  }

  // Búsqueda global (en todos los tipos de datos)
  busquedaGlobal(datos: { ordenes: any[]; clientes: any[]; turnos: any[]; }, texto: string) {
    const resultados = {
      ordenes: this.buscarOrdenes(datos.ordenes, {
        texto,
        ordenarPor: 'fecha',
        direccionOrden: 'desc',
      }),
      clientes: this.buscarClientes(datos.clientes, {
        texto,
        ordenarPor: 'fecha',
        direccionOrden: 'desc',
      }),
      turnos: this.buscarTurnos(datos.turnos, {
        texto,
        ordenarPor: 'fecha',
        direccionOrden: 'desc',
      }),
    };

    return {
      ...resultados,
      totalResultados: resultados.ordenes.total + resultados.clientes.total + resultados.turnos.total,
    };
  }

  // Sugerencias de búsqueda basadas en historial
  obtenerSugerencias(datos: { ordenes: any[]; clientes: any[]; }, limite: number = 10): string[] {
    const sugerencias = new Set<string>();

    // Extraer nombres de clientes únicos
    datos.clientes.forEach(cliente => {
      if (cliente.nombre) {
        sugerencias.add(cliente.nombre);
      }
    });

    // Extraer tipos de servicios únicos
    datos.ordenes.forEach(orden => {
      orden.servicios?.forEach((servicio: any) => {
        if (servicio.tipo) {
          sugerencias.add(servicio.tipo);
        }
      });
    });

    // Extraer términos de notas frecuentes
    const notasTexto = datos.ordenes
      .map(orden => orden.notas || '')
      .join(' ')
      .toLowerCase();

    const palabras = notasTexto
      .split(/\s+/)
      .filter(palabra => palabra.length > 3)
      .reduce((contador, palabra) => {
        contador[palabra] = (contador[palabra] || 0) + 1;
        return contador;
      }, {} as Record<string, number>);

    // Agregar palabras más frecuentes
    Object.entries(palabras)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([palabra]) => sugerencias.add(palabra));

    return Array.from(sugerencias).slice(0, limite);
  }

  // Filtros predefinidos comunes
  obtenerFiltrosPredefinidos(): Array<{ nombre: string; filtros: Partial<FiltrosBusqueda> }> {
    const hoy = new Date();
    const hace7Dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
    const hace30Dias = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);

    return [
      {
        nombre: 'Órdenes pendientes',
        filtros: {
          estado: ['pendiente', 'en_proceso'],
          ordenarPor: 'fecha',
          direccionOrden: 'asc',
        },
      },
      {
        nombre: 'Completadas hoy',
        filtros: {
          estado: ['completada'],
          fechaInicio: new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()),
          fechaFin: hoy,
          ordenarPor: 'fecha',
          direccionOrden: 'desc',
        },
      },
      {
        nombre: 'Última semana',
        filtros: {
          fechaInicio: hace7Dias,
          fechaFin: hoy,
          ordenarPor: 'fecha',
          direccionOrden: 'desc',
        },
      },
      {
        nombre: 'Último mes',
        filtros: {
          fechaInicio: hace30Dias,
          fechaFin: hoy,
          ordenarPor: 'fecha',
          direccionOrden: 'desc',
        },
      },
      {
        nombre: 'Órdenes canceladas',
        filtros: {
          estado: ['cancelada'],
          ordenarPor: 'fecha',
          direccionOrden: 'desc',
        },
      },
      {
        nombre: 'Precios altos (>$100)',
        filtros: {
          precioMin: 100,
          ordenarPor: 'precio',
          direccionOrden: 'desc',
        },
      },
    ];
  }

  // Método privado para ordenamiento
  private ordenarResultados(items: any[], campo: string, direccion: 'asc' | 'desc'): any[] {
    return items.sort((a, b) => {
      let valorA: any;
      let valorB: any;

      switch (campo) {
        case 'fecha':
          valorA = new Date(a.fecha_creacion || a.fecha_registro || a.fecha);
          valorB = new Date(b.fecha_creacion || b.fecha_registro || b.fecha);
          break;
        case 'precio':
          valorA = parseFloat(a.total || 0);
          valorB = parseFloat(b.total || 0);
          break;
        case 'cliente':
          valorA = a.cliente?.nombre || '';
          valorB = b.cliente?.nombre || '';
          break;
        case 'estado':
          valorA = a.estado || '';
          valorB = b.estado || '';
          break;
        default:
          valorA = a[campo] || '';
          valorB = b[campo] || '';
      }

      if (valorA < valorB) return direccion === 'asc' ? -1 : 1;
      if (valorA > valorB) return direccion === 'asc' ? 1 : -1;
      return 0;
    });
  }
}

export default BusquedaAvanzadaService.getInstance();
