import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de la API
const API_CONFIG = {
  baseUrl: 'https://api.burbujapp.com', // URL que se conectará a Koyeb
  timeout: 10000,
  version: 'v1'
};

// Tipos para las respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  telefonoSecundario?: string;
  estado: 'Activo' | 'Inactivo';
  fechaCreacion: string;
  totalOrdenes: number;
  ultimaOrden?: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: 'lavado' | 'planchado' | 'limpieza_seco' | 'especiales';
  precio: number;
  unidad: 'kilo' | 'unidad' | 'metro';
  tiempoEstimado: number; // en horas
  instrucciones?: string;
  popular: boolean;
  activo: boolean;
  fechaCreacion: string;
}

export interface ArticuloOrden {
  id?: string;
  servicioId: string;
  servicio?: Servicio;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  instrucciones?: string;
}

export interface EstadoHistorial {
  id: string;
  ordenId: string;
  estadoAnterior?: string;
  estadoNuevo: string;
  fechaCambio: string;
  usuarioId: string;
  usuario: string;
  observaciones?: string;
}

export interface Orden {
  id: string;
  numeroOrden: string;
  clienteId: string;
  cliente?: Cliente;
  articulos: ArticuloOrden[];
  subtotal: number;
  descuento: number;
  recargo: number;
  total: number;
  estado: 'Registrado' | 'En proceso' | 'Listo' | 'Entregado' | 'Cancelado';
  fechaCreacion: string;
  fechaEstimada?: string;
  fechaEntrega?: string;
  observaciones?: string;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'qr';
  urgente: boolean;
  pagado: boolean;
  historialEstados: EstadoHistorial[];
  usuarioCreacion: string;
}

export interface FiltrosOrden {
  estado?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  clienteId?: string;
  termino?: string;
  urgente?: boolean;
  pagado?: boolean;
}

export interface OrdenamientoOrden {
  campo: 'fecha' | 'total' | 'cliente' | 'estado';
  direccion: 'asc' | 'desc';
}

// Simulación de base de datos local
class OrderApiServiceImpl {
  private async delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async getStorageData<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private async setStorageData<T>(key: string, data: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  // ========================================
  // CLIENTES API
  // ========================================

  /**
   * GET /api/clientes
   * Obtener lista de clientes con paginación
   */
  async obtenerClientes(page: number = 1, limit: number = 20): Promise<ApiResponse<Cliente[]>> {
    await this.delay(800);
    
    const clientesMock: Cliente[] = [
      {
        id: 'cli_001',
        nombre: 'Juan Carlos',
        apellido: 'Pérez Mamani',
        email: 'juan.perez@email.com',
        telefono: '77712345',
        direccion: 'Av. América #123, Zona Central',
        estado: 'Activo',
        fechaCreacion: '2024-01-15T10:30:00Z',
        totalOrdenes: 15,
        ultimaOrden: '2025-08-01T14:20:00Z'
      },
      {
        id: 'cli_002',
        nombre: 'María Elena',
        apellido: 'González Quispe',
        email: 'maria.gonzalez@email.com',
        telefono: '78923456',
        direccion: 'Calle Comercio #456, Zona Norte',
        telefonoSecundario: '2234567',
        estado: 'Activo',
        fechaCreacion: '2024-02-10T14:20:00Z',
        totalOrdenes: 8,
        ultimaOrden: '2025-07-28T09:15:00Z'
      },
      {
        id: 'cli_003',
        nombre: 'Carlos Alberto',
        apellido: 'Rodríguez Silva',
        email: 'carlos.rodriguez@email.com',
        telefono: '79034567',
        direccion: 'Av. Ballivián #789, Calacoto',
        estado: 'Activo',
        fechaCreacion: '2024-03-05T09:15:00Z',
        totalOrdenes: 23,
        ultimaOrden: '2025-08-03T16:45:00Z'
      },
      {
        id: 'cli_004',
        nombre: 'Ana Lucía',
        apellido: 'Vargas Condori',
        email: 'ana.vargas@email.com',
        telefono: '68945612',
        direccion: 'Calle Murillo #321, Sopocachi',
        estado: 'Activo',
        fechaCreacion: '2024-04-12T11:25:00Z',
        totalOrdenes: 12,
        ultimaOrden: '2025-07-30T13:10:00Z'
      }
    ];

    // Simular paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const clientesPaginados = clientesMock.slice(startIndex, endIndex);

    return {
      success: true,
      data: clientesPaginados,
      pagination: {
        page,
        totalPages: Math.ceil(clientesMock.length / limit),
        totalItems: clientesMock.length,
        itemsPerPage: limit
      }
    };
  }

  /**
   * GET /api/clientes/buscar?q={termino}
   * Buscar clientes por nombre, teléfono, etc.
   */
  async buscarClientes(termino: string): Promise<ApiResponse<Cliente[]>> {
    await this.delay(500);
    
    const clientes = await this.obtenerClientes(1, 100); // Obtener todos para buscar
    const clientesFiltrados = clientes.data.filter(cliente => 
      cliente.nombre.toLowerCase().includes(termino.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(termino.toLowerCase()) ||
      cliente.telefono.includes(termino) ||
      cliente.email.toLowerCase().includes(termino.toLowerCase())
    );

    return {
      success: true,
      data: clientesFiltrados
    };
  }

  /**
   * POST /api/clientes
   * Crear nuevo cliente
   */
  async crearCliente(clienteData: Omit<Cliente, 'id' | 'fechaCreacion' | 'totalOrdenes' | 'estado'>): Promise<ApiResponse<Cliente>> {
    await this.delay(1200);

    const nuevoCliente: Cliente = {
      ...clienteData,
      id: `cli_${Date.now()}`,
      estado: 'Activo',
      fechaCreacion: new Date().toISOString(),
      totalOrdenes: 0
    };

    return {
      success: true,
      data: nuevoCliente,
      message: 'Cliente creado exitosamente'
    };
  }

  /**
   * GET /api/clientes/{id}
   * Obtener cliente por ID
   */
  async obtenerCliente(id: string): Promise<ApiResponse<Cliente>> {
    await this.delay(600);
    
    const clientes = await this.obtenerClientes(1, 100);
    const cliente = clientes.data.find(c => c.id === id);

    if (!cliente) {
      return {
        success: false,
        data: {} as Cliente,
        message: 'Cliente no encontrado'
      };
    }

    return {
      success: true,
      data: cliente
    };
  }

  // ========================================
  // SERVICIOS API
  // ========================================

  /**
   * GET /api/servicios
   * Obtener lista de servicios disponibles
   */
  async obtenerServicios(): Promise<ApiResponse<Servicio[]>> {
    await this.delay(600);

    const serviciosMock: Servicio[] = [
      {
        id: 'srv_001',
        nombre: 'Lavado básico',
        descripcion: 'Lavado estándar para ropa cotidiana',
        categoria: 'lavado',
        precio: 8.0,
        unidad: 'kilo',
        tiempoEstimado: 2,
        instrucciones: 'Separar colores claros y oscuros',
        popular: true,
        activo: true,
        fechaCreacion: '2024-01-01T00:00:00Z'
      },
      {
        id: 'srv_002',
        nombre: 'Lavado delicado',
        descripcion: 'Para prendas delicadas y sedas',
        categoria: 'lavado',
        precio: 12.0,
        unidad: 'kilo',
        tiempoEstimado: 3,
        instrucciones: 'Usar agua fría y detergente especial',
        popular: false,
        activo: true,
        fechaCreacion: '2024-01-01T00:00:00Z'
      },
      {
        id: 'srv_003',
        nombre: 'Planchado básico',
        descripcion: 'Planchado estándar para camisas y pantalones',
        categoria: 'planchado',
        precio: 15.0,
        unidad: 'unidad',
        tiempoEstimado: 0.5,
        popular: true,
        activo: true,
        fechaCreacion: '2024-01-01T00:00:00Z'
      },
      {
        id: 'srv_004',
        nombre: 'Planchado premium',
        descripcion: 'Planchado profesional con acabado perfecto',
        categoria: 'planchado',
        precio: 25.0,
        unidad: 'unidad',
        tiempoEstimado: 1,
        instrucciones: 'Incluye almidonado y empaque especial',
        popular: false,
        activo: true,
        fechaCreacion: '2024-01-01T00:00:00Z'
      },
      {
        id: 'srv_005',
        nombre: 'Limpieza en seco',
        descripcion: 'Para trajes y vestidos formales',
        categoria: 'limpieza_seco',
        precio: 35.0,
        unidad: 'unidad',
        tiempoEstimado: 24,
        instrucciones: 'Revisar etiquetas de cuidado',
        popular: true,
        activo: true,
        fechaCreacion: '2024-01-01T00:00:00Z'
      },
      {
        id: 'srv_006',
        nombre: 'Lavado de edredones',
        descripcion: 'Lavado especial para edredones y colchas',
        categoria: 'especiales',
        precio: 30.0,
        unidad: 'unidad',
        tiempoEstimado: 4,
        instrucciones: 'Secado con temperatura controlada',
        popular: true,
        activo: true,
        fechaCreacion: '2024-01-01T00:00:00Z'
      },
      {
        id: 'srv_007',
        nombre: 'Lavado de alfombras',
        descripcion: 'Limpieza profunda de alfombras y tapetes',
        categoria: 'especiales',
        precio: 45.0,
        unidad: 'metro',
        tiempoEstimado: 48,
        instrucciones: 'Secado al aire libre requerido',
        popular: false,
        activo: true,
        fechaCreacion: '2024-01-01T00:00:00Z'
      }
    ];

    return {
      success: true,
      data: serviciosMock.filter(s => s.activo)
    };
  }

  /**
   * GET /api/servicios/categoria/{categoria}
   * Obtener servicios por categoría
   */
  async obtenerServiciosPorCategoria(categoria: string): Promise<ApiResponse<Servicio[]>> {
    await this.delay(400);
    
    const servicios = await this.obtenerServicios();
    const serviciosFiltrados = servicios.data.filter(servicio => 
      categoria === 'todos' || servicio.categoria === categoria
    );

    return {
      success: true,
      data: serviciosFiltrados
    };
  }

  /**
   * GET /api/servicios/populares
   * Obtener servicios más populares
   */
  async obtenerServiciosPopulares(): Promise<ApiResponse<Servicio[]>> {
    await this.delay(500);
    
    const servicios = await this.obtenerServicios();
    const serviciosPopulares = servicios.data.filter(s => s.popular);

    return {
      success: true,
      data: serviciosPopulares
    };
  }

  // ========================================
  // ÓRDENES API
  // ========================================

  /**
   * POST /api/ordenes
   * Crear nueva orden
   */
  async crearOrden(ordenData: Omit<Orden, 'id' | 'numeroOrden' | 'fechaCreacion' | 'historialEstados'>): Promise<ApiResponse<Orden>> {
    await this.delay(1500);

    const numeroOrden = `ORD${Date.now()}`;
    const nuevaOrden: Orden = {
      ...ordenData,
      id: `ord_${Date.now()}`,
      numeroOrden,
      fechaCreacion: new Date().toISOString(),
      fechaEstimada: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      historialEstados: [{
        id: `hist_${Date.now()}`,
        ordenId: `ord_${Date.now()}`,
        estadoNuevo: 'Registrado',
        fechaCambio: new Date().toISOString(),
        usuarioId: 'usr_001',
        usuario: 'Sistema',
        observaciones: 'Orden creada exitosamente'
      }]
    };

    // Simular guardado en storage
    const ordenes = await this.getStorageData<Orden[]>('ordenes', []);
    ordenes.push(nuevaOrden);
    await this.setStorageData('ordenes', ordenes);

    return {
      success: true,
      data: nuevaOrden,
      message: 'Orden creada exitosamente'
    };
  }

  /**
   * GET /api/ordenes
   * Obtener lista de órdenes con filtros y paginación
   */
  async obtenerOrdenes(
    filtros?: FiltrosOrden,
    ordenamiento?: OrdenamientoOrden,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<Orden[]>> {
    await this.delay(700);
    
    // Obtener órdenes desde storage o usar mock data
    let ordenes = await this.getStorageData<Orden[]>('ordenes', []);
    
    // Si no hay órdenes en storage, usar datos mock
    if (ordenes.length === 0) {
      ordenes = await this.generarOrdenesMock();
      await this.setStorageData('ordenes', ordenes);
    }

    // Aplicar filtros
    if (filtros) {
      if (filtros.estado) {
        ordenes = ordenes.filter(o => o.estado === filtros.estado);
      }
      if (filtros.fechaDesde) {
        ordenes = ordenes.filter(o => new Date(o.fechaCreacion) >= new Date(filtros.fechaDesde!));
      }
      if (filtros.fechaHasta) {
        ordenes = ordenes.filter(o => new Date(o.fechaCreacion) <= new Date(filtros.fechaHasta!));
      }
      if (filtros.clienteId) {
        ordenes = ordenes.filter(o => o.clienteId === filtros.clienteId);
      }
      if (filtros.termino) {
        const termino = filtros.termino.toLowerCase();
        ordenes = ordenes.filter(o => 
          o.numeroOrden.toLowerCase().includes(termino) ||
          o.cliente?.nombre.toLowerCase().includes(termino) ||
          o.cliente?.apellido.toLowerCase().includes(termino) ||
          o.cliente?.telefono.includes(termino)
        );
      }
      if (filtros.urgente !== undefined) {
        ordenes = ordenes.filter(o => o.urgente === filtros.urgente);
      }
      if (filtros.pagado !== undefined) {
        ordenes = ordenes.filter(o => o.pagado === filtros.pagado);
      }
    }

    // Aplicar ordenamiento
    if (ordenamiento) {
      ordenes.sort((a, b) => {
        let valorA: any, valorB: any;
        
        switch (ordenamiento.campo) {
          case 'fecha':
            valorA = new Date(a.fechaCreacion);
            valorB = new Date(b.fechaCreacion);
            break;
          case 'total':
            valorA = a.total;
            valorB = b.total;
            break;
          case 'cliente':
            valorA = `${a.cliente?.nombre} ${a.cliente?.apellido}`;
            valorB = `${b.cliente?.nombre} ${b.cliente?.apellido}`;
            break;
          case 'estado':
            valorA = a.estado;
            valorB = b.estado;
            break;
          default:
            return 0;
        }

        if (ordenamiento.direccion === 'asc') {
          return valorA > valorB ? 1 : -1;
        } else {
          return valorA < valorB ? 1 : -1;
        }
      });
    }

    // Aplicar paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const ordenesPaginadas = ordenes.slice(startIndex, endIndex);

    return {
      success: true,
      data: ordenesPaginadas,
      pagination: {
        page,
        totalPages: Math.ceil(ordenes.length / limit),
        totalItems: ordenes.length,
        itemsPerPage: limit
      }
    };
  }

  /**
   * GET /api/ordenes/{id}
   * Obtener orden por ID
   */
  async obtenerOrden(id: string): Promise<ApiResponse<Orden>> {
    await this.delay(500);
    
    const ordenes = await this.getStorageData<Orden[]>('ordenes', []);
    const orden = ordenes.find(o => o.id === id || o.numeroOrden === id);

    if (!orden) {
      return {
        success: false,
        data: {} as Orden,
        message: 'Orden no encontrada'
      };
    }

    return {
      success: true,
      data: orden
    };
  }

  /**
   * PUT /api/ordenes/{id}/estado
   * Actualizar estado de orden
   */
  async actualizarEstadoOrden(
    id: string, 
    nuevoEstado: Orden['estado'], 
    observaciones?: string
  ): Promise<ApiResponse<Orden>> {
    await this.delay(800);
    
    const ordenes = await this.getStorageData<Orden[]>('ordenes', []);
    const indiceOrden = ordenes.findIndex(o => o.id === id || o.numeroOrden === id);

    if (indiceOrden === -1) {
      return {
        success: false,
        data: {} as Orden,
        message: 'Orden no encontrada'
      };
    }

    const ordenActual = ordenes[indiceOrden];
    const estadoAnterior = ordenActual.estado;

    // Actualizar estado
    ordenes[indiceOrden].estado = nuevoEstado;
    
    // Agregar al historial
    const nuevoHistorial: EstadoHistorial = {
      id: `hist_${Date.now()}`,
      ordenId: id,
      estadoAnterior,
      estadoNuevo: nuevoEstado,
      fechaCambio: new Date().toISOString(),
      usuarioId: 'usr_001',
      usuario: 'Usuario Actual',
      observaciones
    };

    ordenes[indiceOrden].historialEstados.push(nuevoHistorial);

    // Si el estado es "Entregado", marcar fecha de entrega
    if (nuevoEstado === 'Entregado') {
      ordenes[indiceOrden].fechaEntrega = new Date().toISOString();
    }

    await this.setStorageData('ordenes', ordenes);

    return {
      success: true,
      data: ordenes[indiceOrden],
      message: 'Estado actualizado exitosamente'
    };
  }

  /**
   * PUT /api/ordenes/{id}/pago
   * Marcar orden como pagada
   */
  async marcarComoPagada(id: string, metodoPago: string): Promise<ApiResponse<Orden>> {
    await this.delay(600);
    
    const ordenes = await this.getStorageData<Orden[]>('ordenes', []);
    const indiceOrden = ordenes.findIndex(o => o.id === id || o.numeroOrden === id);

    if (indiceOrden === -1) {
      return {
        success: false,
        data: {} as Orden,
        message: 'Orden no encontrada'
      };
    }

    ordenes[indiceOrden].pagado = true;
    ordenes[indiceOrden].metodoPago = metodoPago as any;

    await this.setStorageData('ordenes', ordenes);

    return {
      success: true,
      data: ordenes[indiceOrden],
      message: 'Pago registrado exitosamente'
    };
  }

  /**
   * DELETE /api/ordenes/{id}
   * Cancelar/eliminar orden
   */
  async cancelarOrden(id: string, motivo?: string): Promise<ApiResponse<boolean>> {
    await this.delay(700);
    
    const ordenes = await this.getStorageData<Orden[]>('ordenes', []);
    const indiceOrden = ordenes.findIndex(o => o.id === id || o.numeroOrden === id);

    if (indiceOrden === -1) {
      return {
        success: false,
        data: false,
        message: 'Orden no encontrada'
      };
    }

    // Cambiar estado a cancelado en lugar de eliminar
    ordenes[indiceOrden].estado = 'Cancelado';
    
    // Agregar al historial
    const nuevoHistorial: EstadoHistorial = {
      id: `hist_${Date.now()}`,
      ordenId: id,
      estadoAnterior: ordenes[indiceOrden].estado,
      estadoNuevo: 'Cancelado',
      fechaCambio: new Date().toISOString(),
      usuarioId: 'usr_001',
      usuario: 'Usuario Actual',
      observaciones: motivo || 'Orden cancelada'
    };

    ordenes[indiceOrden].historialEstados.push(nuevoHistorial);

    await this.setStorageData('ordenes', ordenes);

    return {
      success: true,
      data: true,
      message: 'Orden cancelada exitosamente'
    };
  }

  // ========================================
  // DASHBOARD/MÉTRICAS API
  // ========================================

  /**
   * GET /api/dashboard/metricas
   * Obtener métricas del dashboard
   */
  async obtenerMetricasDashboard(): Promise<ApiResponse<any>> {
    await this.delay(900);

    const ordenes = await this.getStorageData<Orden[]>('ordenes', []);
    const clientes = await this.obtenerClientes(1, 100);

    const hoy = new Date().toDateString();
    const ordenesHoy = ordenes.filter(o => new Date(o.fechaCreacion).toDateString() === hoy);
    
    const metricas = {
      ordenesHoy: ordenesHoy.length,
      ventasHoy: ordenesHoy.reduce((total, orden) => total + orden.total, 0),
      ventasMes: ordenes.reduce((total, orden) => total + orden.total, 0),
      clientesActivos: clientes.data.length,
      ordenesRegistradas: ordenes.filter(o => o.estado === 'Registrado').length,
      ordenesEnProceso: ordenes.filter(o => o.estado === 'En proceso').length,
      ordenesListas: ordenes.filter(o => o.estado === 'Listo').length,
      ordenesEntregadas: ordenes.filter(o => o.estado === 'Entregado').length,
      ordenesCanceladas: ordenes.filter(o => o.estado === 'Cancelado').length,
      promedioTicket: ordenes.length > 0 ? ordenes.reduce((total, orden) => total + orden.total, 0) / ordenes.length : 0,
      servicioMasPopular: 'Lavado básico',
      tiempoPromedioEntrega: 24 // horas
    };

    return {
      success: true,
      data: metricas
    };
  }

  // ========================================
  // MÉTODOS AUXILIARES
  // ========================================

  private async generarOrdenesMock(): Promise<Orden[]> {
    const clientes = await this.obtenerClientes(1, 100);
    const servicios = await this.obtenerServicios();
    
    const ordenesMock: Orden[] = [
      {
        id: 'ord_001',
        numeroOrden: 'ORD202508010001',
        clienteId: 'cli_001',
        cliente: clientes.data[0],
        articulos: [
          {
            id: 'art_001',
            servicioId: 'srv_001',
            servicio: servicios.data[0],
            cantidad: 3,
            precioUnitario: 8.0,
            subtotal: 24.0
          },
          {
            id: 'art_002',
            servicioId: 'srv_003',
            servicio: servicios.data[2],
            cantidad: 2,
            precioUnitario: 15.0,
            subtotal: 30.0
          }
        ],
        subtotal: 54.0,
        descuento: 0,
        recargo: 0,
        total: 54.0,
        estado: 'Registrado',
        fechaCreacion: '2025-08-08T10:30:00Z',
        fechaEstimada: '2025-08-09T18:00:00Z',
        observaciones: 'Cliente requiere entrega urgente',
        metodoPago: 'efectivo',
        urgente: false,
        pagado: false,
        historialEstados: [{
          id: 'hist_001',
          ordenId: 'ord_001',
          estadoNuevo: 'Registrado',
          fechaCambio: '2025-08-08T10:30:00Z',
          usuarioId: 'usr_001',
          usuario: 'Sistema'
        }],
        usuarioCreacion: 'usr_001'
      },
      {
        id: 'ord_002',
        numeroOrden: 'ORD202508010002',
        clienteId: 'cli_002',
        cliente: clientes.data[1],
        articulos: [
          {
            id: 'art_003',
            servicioId: 'srv_005',
            servicio: servicios.data[4],
            cantidad: 1,
            precioUnitario: 35.0,
            subtotal: 35.0
          }
        ],
        subtotal: 35.0,
        descuento: 0,
        recargo: 17.5,
        total: 52.5,
        estado: 'En proceso',
        fechaCreacion: '2025-08-07T14:20:00Z',
        fechaEstimada: '2025-08-08T14:20:00Z',
        observaciones: 'Traje para evento especial',
        metodoPago: 'tarjeta',
        urgente: true,
        pagado: true,
        historialEstados: [
          {
            id: 'hist_002',
            ordenId: 'ord_002',
            estadoNuevo: 'Registrado',
            fechaCambio: '2025-08-07T14:20:00Z',
            usuarioId: 'usr_001',
            usuario: 'Sistema'
          },
          {
            id: 'hist_003',
            ordenId: 'ord_002',
            estadoAnterior: 'Registrado',
            estadoNuevo: 'En proceso',
            fechaCambio: '2025-08-07T16:00:00Z',
            usuarioId: 'usr_002',
            usuario: 'María Operadora'
          }
        ],
        usuarioCreacion: 'usr_001'
      }
    ];

    return ordenesMock;
  }
}

export const orderApiService = new OrderApiServiceImpl();

// English API wrapper for better integration
export const OrderApiService = {
  // Clientes API (English wrapper methods)
  getClientes: (params?: { page?: number; limit?: number; search?: string }) => 
    orderApiService.obtenerClientes(params?.page, params?.limit),
  
  searchClientes: (search: string) => 
    orderApiService.buscarClientes(search),
    
  createCliente: (data: Omit<Cliente, 'id' | 'fechaCreacion' | 'totalOrdenes' | 'estado'>) => 
    orderApiService.crearCliente(data),
    
  getCliente: (id: string) => 
    orderApiService.obtenerCliente(id),

  // Servicios API (English wrapper methods)
  getServicios: (params?: { categoria?: string; activo?: boolean; popular?: boolean }) => {
    if (params?.categoria && params.categoria !== 'todas') {
      return orderApiService.obtenerServiciosPorCategoria(params.categoria);
    }
    return orderApiService.obtenerServicios();
  },

  // Ordenes API (English wrapper methods)
  createOrden: (data: Omit<Orden, 'id' | 'numeroOrden' | 'fechaCreacion' | 'historialEstados'>) => 
    orderApiService.crearOrden(data),
    
  getOrdenes: (filtros?: FiltrosOrden, ordenamiento?: OrdenamientoOrden, page?: number, limit?: number) => 
    orderApiService.obtenerOrdenes(filtros, ordenamiento, page, limit),
    
  getOrden: (id: string) => 
    orderApiService.obtenerOrden(id),
    
  updateEstadoOrden: (id: string, estado: Orden['estado'], observaciones?: string) => 
    orderApiService.actualizarEstadoOrden(id, estado, observaciones),
    
  markAsPaid: (id: string, metodoPago: string) => 
    orderApiService.marcarComoPagada(id, metodoPago),
    
  cancelOrden: (id: string, motivo?: string) => 
    orderApiService.cancelarOrden(id, motivo),

  // Dashboard API
  getDashboardMetrics: () => 
    orderApiService.obtenerMetricasDashboard()
};
