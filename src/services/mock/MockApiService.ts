/**
 * Servicio Mock para simular el microservicio .NET Core
 * Este servicio simula todas las operaciones que realizará el backend real
 */

import { 
  ApiResponse, 
  Cliente, 
  Servicio, 
  Orden, 
  CreateClienteRequest,
  UpdateClienteRequest,
  CreateServicioRequest,
  UpdateServicioRequest,
  CreateOrdenRequest,
  UpdateOrdenRequest,
  UpdateEstadoRequest,
  UpdatePagoRequest,
  ClientesQueryParams,
  ServiciosQueryParams,
  OrdenesQueryParams,
  DashboardData,
  ReporteVentas,
  EstadoOrden,
  NotificacionRequest,
  WhatsAppRequest
} from '../types/ApiTypes';

import { 
  ALL_CLIENTES, 
  ALL_SERVICIOS, 
  ALL_ORDENES,
  generateMoreClientes,
  generateMoreOrdenes
} from './MockData';

import { API_CONFIG, MOCK_DELAYS, MOCK_ERROR_RATES } from '../config/ApiConfig';

/**
 * Utilidad para simular delays de red
 */
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Utilidad para simular errores aleatorios
 */
const shouldSimulateError = (errorType: keyof typeof MOCK_ERROR_RATES): boolean => {
  return Math.random() < MOCK_ERROR_RATES[errorType];
};

/**
 * Generar UUID simple para IDs
 */
const generateId = (): string => {
  return 'mock-' + Math.random().toString(36).substr(2, 9);
};

/**
 * Generar número de orden
 */
const generateOrderNumber = (): string => {
  const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const numero = Math.floor(Math.random() * 9999) + 1;
  return `ORD-${fecha}-${numero.toString().padStart(4, '0')}`;
};

// =================== MOCK SERVICE ===================
export class MockApiService {
  private static instance: MockApiService;
  
  // Datos en memoria (simula base de datos)
  private clientes: Cliente[] = [...ALL_CLIENTES];
  private servicios: Servicio[] = [...ALL_SERVICIOS];
  private ordenes: Orden[] = [...ALL_ORDENES];

  private constructor() {}

  public static getInstance(): MockApiService {
    if (!MockApiService.instance) {
      MockApiService.instance = new MockApiService();
    }
    return MockApiService.instance;
  }

  // =================== CLIENTES ===================
  
  async getClientes(params: ClientesQueryParams = {}): Promise<ApiResponse<Cliente[]>> {
    await delay(MOCK_DELAYS.normal);
    
    if (shouldSimulateError('network')) {
      throw new Error('Error de red simulado');
    }

    let filteredClientes = [...this.clientes];

    // Aplicar filtros
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredClientes = filteredClientes.filter(cliente => 
        cliente.nombre.toLowerCase().includes(searchLower) ||
        cliente.apellido.toLowerCase().includes(searchLower) ||
        cliente.telefono.includes(params.search!) ||
        cliente.email.toLowerCase().includes(searchLower)
      );
    }

    if (params.estado) {
      filteredClientes = filteredClientes.filter(cliente => cliente.estado === params.estado);
    }

    // Paginación
    const page = params.page || 1;
    const limit = params.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedClientes = filteredClientes.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedClientes,
      pagination: {
        page,
        totalPages: Math.ceil(filteredClientes.length / limit),
        totalItems: filteredClientes.length,
        itemsPerPage: limit
      }
    };
  }

  async getClienteById(id: string): Promise<ApiResponse<Cliente>> {
    await delay(MOCK_DELAYS.fast);
    
    const cliente = this.clientes.find(c => c.id === id);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    return {
      success: true,
      data: cliente
    };
  }

  async createCliente(data: CreateClienteRequest): Promise<ApiResponse<Cliente>> {
    await delay(MOCK_DELAYS.normal);
    
    if (shouldSimulateError('validation')) {
      throw new Error('Error de validación: Email ya existe');
    }

    const nuevoCliente: Cliente = {
      id: generateId(),
      ...data,
      estado: data.estado || 'Activo',
      fechaCreacion: new Date().toISOString(),
      totalOrdenes: 0
    };

    this.clientes.unshift(nuevoCliente);

    return {
      success: true,
      data: nuevoCliente,
      message: 'Cliente creado exitosamente'
    };
  }

  async updateCliente(id: string, data: UpdateClienteRequest): Promise<ApiResponse<Cliente>> {
    await delay(MOCK_DELAYS.normal);
    
    const index = this.clientes.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }

    this.clientes[index] = { ...this.clientes[index], ...data };

    return {
      success: true,
      data: this.clientes[index],
      message: 'Cliente actualizado exitosamente'
    };
  }

  async deleteCliente(id: string): Promise<ApiResponse<null>> {
    await delay(MOCK_DELAYS.normal);
    
    const index = this.clientes.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }

    this.clientes.splice(index, 1);

    return {
      success: true,
      data: null,
      message: 'Cliente eliminado exitosamente'
    };
  }

  // =================== SERVICIOS ===================
  
  async getServicios(params: ServiciosQueryParams = {}): Promise<ApiResponse<Servicio[]>> {
    await delay(MOCK_DELAYS.normal);
    
    let filteredServicios = [...this.servicios];

    // Aplicar filtros
    if (params.categoria) {
      filteredServicios = filteredServicios.filter(s => s.categoria === params.categoria);
    }

    if (params.activo !== undefined) {
      filteredServicios = filteredServicios.filter(s => s.activo === params.activo);
    }

    if (params.popular !== undefined) {
      filteredServicios = filteredServicios.filter(s => s.popular === params.popular);
    }

    return {
      success: true,
      data: filteredServicios
    };
  }

  async createServicio(data: CreateServicioRequest): Promise<ApiResponse<Servicio>> {
    await delay(MOCK_DELAYS.normal);
    
    const nuevoServicio: Servicio = {
      id: generateId(),
      ...data,
      popular: data.popular || false,
      activo: data.activo !== false,
      fechaCreacion: new Date().toISOString()
    };

    this.servicios.unshift(nuevoServicio);

    return {
      success: true,
      data: nuevoServicio,
      message: 'Servicio creado exitosamente'
    };
  }

  async updateServicio(id: string, data: UpdateServicioRequest): Promise<ApiResponse<Servicio>> {
    await delay(MOCK_DELAYS.normal);
    
    const index = this.servicios.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Servicio no encontrado');
    }

    this.servicios[index] = { ...this.servicios[index], ...data };

    return {
      success: true,
      data: this.servicios[index],
      message: 'Servicio actualizado exitosamente'
    };
  }

  // =================== ÓRDENES ===================
  
  async getOrdenes(params: OrdenesQueryParams = {}): Promise<ApiResponse<Orden[]>> {
    await delay(MOCK_DELAYS.normal);
    
    let filteredOrdenes = [...this.ordenes];

    // Aplicar filtros
    if (params.estado) {
      filteredOrdenes = filteredOrdenes.filter(o => o.estado === params.estado);
    }

    if (params.clienteId) {
      filteredOrdenes = filteredOrdenes.filter(o => o.clienteId === params.clienteId);
    }

    if (params.urgente !== undefined) {
      filteredOrdenes = filteredOrdenes.filter(o => o.urgente === params.urgente);
    }

    if (params.pagado !== undefined) {
      filteredOrdenes = filteredOrdenes.filter(o => o.pagado === params.pagado);
    }

    if (params.termino) {
      const searchLower = params.termino.toLowerCase();
      filteredOrdenes = filteredOrdenes.filter(o => 
        o.numeroOrden.toLowerCase().includes(searchLower) ||
        o.cliente.nombre.toLowerCase().includes(searchLower) ||
        o.cliente.apellido.toLowerCase().includes(searchLower)
      );
    }

    if (params.fechaDesde) {
      filteredOrdenes = filteredOrdenes.filter(o => o.fechaCreacion >= params.fechaDesde!);
    }

    if (params.fechaHasta) {
      filteredOrdenes = filteredOrdenes.filter(o => o.fechaCreacion <= params.fechaHasta!);
    }

    // Ordenamiento
    if (params.ordenarPor) {
      filteredOrdenes.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (params.ordenarPor) {
          case 'fecha':
            aValue = new Date(a.fechaCreacion);
            bValue = new Date(b.fechaCreacion);
            break;
          case 'total':
            aValue = a.total;
            bValue = b.total;
            break;
          case 'cliente':
            aValue = `${a.cliente.nombre} ${a.cliente.apellido}`;
            bValue = `${b.cliente.nombre} ${b.cliente.apellido}`;
            break;
          case 'estado':
            aValue = a.estado;
            bValue = b.estado;
            break;
          default:
            aValue = a.fechaCreacion;
            bValue = b.fechaCreacion;
        }
        
        if (params.direccion === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    // Paginación
    const page = params.page || 1;
    const limit = params.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrdenes = filteredOrdenes.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedOrdenes,
      pagination: {
        page,
        totalPages: Math.ceil(filteredOrdenes.length / limit),
        totalItems: filteredOrdenes.length,
        itemsPerPage: limit
      }
    };
  }

  async getOrdenById(id: string): Promise<ApiResponse<Orden>> {
    await delay(MOCK_DELAYS.fast);
    
    const orden = this.ordenes.find(o => o.id === id);
    if (!orden) {
      throw new Error('Orden no encontrada');
    }

    return {
      success: true,
      data: orden
    };
  }

  async createOrden(data: CreateOrdenRequest): Promise<ApiResponse<Orden>> {
    await delay(MOCK_DELAYS.normal);
    
    if (shouldSimulateError('validation')) {
      throw new Error('Error de validación: Cliente no válido');
    }

    const cliente = this.clientes.find(c => c.id === data.clienteId);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    const nuevaOrden: Orden = {
      id: generateId(),
      numeroOrden: generateOrderNumber(),
      clienteId: data.clienteId,
      cliente: {
        id: cliente.id,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        telefono: cliente.telefono,
        email: cliente.email,
        direccion: cliente.direccion
      },
      articulos: data.articulos.map(articulo => ({
        id: generateId(),
        ...articulo,
        servicio: {
          nombre: this.servicios.find(s => s.id === articulo.servicioId)?.nombre || 'Servicio',
          unidad: this.servicios.find(s => s.id === articulo.servicioId)?.unidad || 'unidad'
        }
      })),
      subtotal: data.subtotal,
      descuento: data.descuento || 0,
      recargo: data.recargo || 0,
      total: data.total,
      estado: data.estado || 'Registrado',
      fechaCreacion: new Date().toISOString(),
      fechaEstimada: data.fechaEstimada,
      fechaEntrega: data.fechaEntrega,
      observaciones: data.observaciones,
      metodoPago: data.metodoPago || 'efectivo',
      urgente: data.urgente || false,
      pagado: data.pagado || false,
      historialEstados: [{
        id: generateId(),
        ordenId: generateId(),
        estadoAnterior: undefined,
        estadoNuevo: data.estado || 'Registrado',
        fechaCambio: new Date().toISOString(),
        usuarioId: 'mock-user',
        usuario: data.usuarioCreacion,
        observaciones: 'Orden creada'
      }],
      usuarioCreacion: data.usuarioCreacion
    };

    this.ordenes.unshift(nuevaOrden);

    // Actualizar contador de órdenes del cliente
    const clienteIndex = this.clientes.findIndex(c => c.id === data.clienteId);
    if (clienteIndex !== -1) {
      this.clientes[clienteIndex].totalOrdenes++;
      this.clientes[clienteIndex].ultimaOrden = nuevaOrden.fechaCreacion;
    }

    return {
      success: true,
      data: nuevaOrden,
      message: 'Orden creada exitosamente'
    };
  }

  async updateEstadoOrden(id: string, data: UpdateEstadoRequest): Promise<ApiResponse<Orden>> {
    await delay(MOCK_DELAYS.normal);
    
    const index = this.ordenes.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('Orden no encontrada');
    }

    const estadoAnterior = this.ordenes[index].estado;
    this.ordenes[index].estado = data.nuevoEstado;

    // Agregar al historial
    this.ordenes[index].historialEstados.push({
      id: generateId(),
      ordenId: id,
      estadoAnterior,
      estadoNuevo: data.nuevoEstado,
      fechaCambio: new Date().toISOString(),
      usuarioId: data.usuarioId,
      usuario: 'Usuario Sistema',
      observaciones: data.observaciones
    });

    // Si se marca como entregado, actualizar fecha de entrega
    if (data.nuevoEstado === 'Entregado') {
      this.ordenes[index].fechaEntrega = new Date().toISOString();
    }

    return {
      success: true,
      data: this.ordenes[index],
      message: 'Estado actualizado exitosamente'
    };
  }

  async updatePagoOrden(id: string, data: UpdatePagoRequest): Promise<ApiResponse<Orden>> {
    await delay(MOCK_DELAYS.normal);
    
    const index = this.ordenes.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('Orden no encontrada');
    }

    this.ordenes[index].metodoPago = data.metodoPago;
    this.ordenes[index].pagado = true;

    return {
      success: true,
      data: this.ordenes[index],
      message: 'Pago registrado exitosamente'
    };
  }

  // =================== REPORTES ===================
  
  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    await delay(MOCK_DELAYS.slow);
    
    const hoy = new Date().toISOString().slice(0, 10);
    const hace7Dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const ordenesHoy = this.ordenes.filter(o => o.fechaCreacion.slice(0, 10) === hoy);
    const ordenesSemana = this.ordenes.filter(o => o.fechaCreacion.slice(0, 10) >= hace7Dias);
    const clientesActivos = this.clientes.filter(c => c.estado === 'Activo');

    const dashboard: DashboardData = {
      resumenHoy: {
        ordenesNuevas: ordenesHoy.length,
        ordenesCompletadas: ordenesHoy.filter(o => o.estado === 'Entregado').length,
        ingresosDia: ordenesHoy.filter(o => o.pagado).reduce((sum, o) => sum + o.total, 0),
        clientesNuevos: this.clientes.filter(c => c.fechaCreacion.slice(0, 10) === hoy).length
      },
      resumenSemana: {
        totalOrdenes: ordenesSemana.length,
        totalIngresos: ordenesSemana.filter(o => o.pagado).reduce((sum, o) => sum + o.total, 0),
        ordenesPromedioDia: Math.round(ordenesSemana.length / 7),
        clientesActivos: clientesActivos.length
      },
      estadisticasGenerales: {
        totalClientes: this.clientes.length,
        clientesActivos: clientesActivos.length,
        serviciosDisponibles: this.servicios.filter(s => s.activo).length,
        ordenesUltimoMes: this.ordenes.filter(o => {
          const hace30Dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          return new Date(o.fechaCreacion) >= hace30Dias;
        }).length
      },
      ordenesRecientes: this.ordenes.slice(0, 10),
      serviciosPopulares: this.servicios
        .filter(s => s.popular)
        .map(servicio => ({
          servicio,
          totalOrdenes: this.ordenes.filter(o => 
            o.articulos.some(a => a.servicioId === servicio.id)
          ).length,
          ingresoTotal: this.ordenes
            .filter(o => o.articulos.some(a => a.servicioId === servicio.id))
            .reduce((sum, o) => sum + o.total, 0),
          porcentajeUso: 85 // Valor simulado
        }))
    };

    return {
      success: true,
      data: dashboard
    };
  }

  // =================== NOTIFICACIONES ===================
  
  async sendNotification(data: NotificacionRequest): Promise<ApiResponse<null>> {
    await delay(MOCK_DELAYS.normal);
    
    console.log('📧 Notificación simulada enviada:', data);
    
    return {
      success: true,
      data: null,
      message: 'Notificación enviada exitosamente'
    };
  }

  async sendWhatsApp(data: WhatsAppRequest): Promise<ApiResponse<null>> {
    await delay(MOCK_DELAYS.normal);
    
    console.log('📱 WhatsApp simulado enviado:', data);
    
    return {
      success: true,
      data: null,
      message: 'Mensaje de WhatsApp enviado exitosamente'
    };
  }

  // =================== UTILITIES ===================
  
  /**
   * Resetear datos a estado inicial
   */
  resetData(): void {
    this.clientes = [...ALL_CLIENTES];
    this.servicios = [...ALL_SERVICIOS];
    this.ordenes = [...ALL_ORDENES];
  }

  /**
   * Obtener estadísticas de uso
   */
  getStats() {
    return {
      clientes: this.clientes.length,
      servicios: this.servicios.length,
      ordenes: this.ordenes.length,
      ingresoTotal: this.ordenes.filter(o => o.pagado).reduce((sum, o) => sum + o.total, 0)
    };
  }
}

// Instancia singleton
export const mockApiService = MockApiService.getInstance();

export default mockApiService;
