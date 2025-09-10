/**
 * Tipos TypeScript para las APIs del microservicio
 * Estos tipos deben coincidir exactamente con los del backend .NET Core
 */

// =================== RESPUESTAS DE API ===================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// =================== ENUMS ===================
export type EstadoCliente = 'Activo' | 'Inactivo';
export type CategoriaServicio = 'lavado' | 'planchado' | 'limpieza_seco' | 'especiales';
export type UnidadServicio = 'kilo' | 'unidad' | 'metro';
export type EstadoOrden = 'Registrado' | 'En proceso' | 'Listo' | 'Entregado' | 'Cancelado';
export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'qr';

// =================== CLIENTE ===================
export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  telefonoSecundario?: string;
  estado: EstadoCliente;
  fechaCreacion: string;
  totalOrdenes: number;
  ultimaOrden?: string;
}

export interface CreateClienteRequest {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  telefonoSecundario?: string;
  estado?: EstadoCliente;
}

export interface UpdateClienteRequest extends Partial<CreateClienteRequest> {}

// =================== SERVICIO ===================
export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: CategoriaServicio;
  precio: number;
  unidad: UnidadServicio;
  tiempoEstimado: number; // en horas
  instrucciones?: string;
  popular: boolean;
  activo: boolean;
  fechaCreacion: string;
}

export interface CreateServicioRequest {
  nombre: string;
  descripcion: string;
  categoria: CategoriaServicio;
  precio: number;
  unidad: UnidadServicio;
  tiempoEstimado: number;
  instrucciones?: string;
  popular?: boolean;
  activo?: boolean;
}

export interface UpdateServicioRequest extends Partial<CreateServicioRequest> {}

// =================== ORDEN ===================
export interface Orden {
  id: string;
  numeroOrden: string;
  clienteId: string;
  cliente: ClienteResumen;
  articulos: ArticuloOrden[];
  subtotal: number;
  descuento: number;
  recargo: number;
  total: number;
  estado: EstadoOrden;
  fechaCreacion: string;
  fechaEstimada?: string;
  fechaEntrega?: string;
  observaciones?: string;
  metodoPago: MetodoPago;
  urgente: boolean;
  pagado: boolean;
  historialEstados: HistorialEstado[];
  usuarioCreacion: string;
}

export interface ClienteResumen {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  direccion: string;
}

export interface ArticuloOrden {
  id: string;
  servicioId: string;
  servicio: ServicioResumen;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  instrucciones?: string;
}

export interface ServicioResumen {
  nombre: string;
  unidad: UnidadServicio;
}

export interface HistorialEstado {
  id: string;
  ordenId: string;
  estadoAnterior?: string;
  estadoNuevo: string;
  fechaCambio: string;
  usuarioId: string;
  usuario: string;
  observaciones?: string;
}

export interface CreateOrdenRequest {
  clienteId: string;
  articulos: CreateArticuloRequest[];
  subtotal: number;
  descuento?: number;
  recargo?: number;
  total: number;
  estado?: EstadoOrden;
  fechaEstimada?: string;
  fechaEntrega?: string;
  observaciones?: string;
  metodoPago?: MetodoPago;
  urgente?: boolean;
  pagado?: boolean;
  usuarioCreacion: string;
}

export interface CreateArticuloRequest {
  servicioId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  instrucciones?: string;
}

export interface UpdateOrdenRequest {
  fechaEstimada?: string;
  fechaEntrega?: string;
  observaciones?: string;
  urgente?: boolean;
}

export interface UpdateEstadoRequest {
  nuevoEstado: EstadoOrden;
  observaciones?: string;
  usuarioId: string;
}

export interface UpdatePagoRequest {
  metodoPago: MetodoPago;
  montoPagado?: number;
  referencia?: string;
}

// =================== FILTROS Y QUERIES ===================
export interface ClientesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  estado?: EstadoCliente;
}

export interface ServiciosQueryParams {
  categoria?: CategoriaServicio;
  activo?: boolean;
  popular?: boolean;
}

export interface OrdenesQueryParams {
  page?: number;
  limit?: number;
  estado?: EstadoOrden;
  fechaDesde?: string;
  fechaHasta?: string;
  clienteId?: string;
  termino?: string;
  urgente?: boolean;
  pagado?: boolean;
  ordenarPor?: 'fecha' | 'total' | 'cliente' | 'estado';
  direccion?: 'asc' | 'desc';
}

// =================== AUTENTICACIÓN ===================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  usuario: UsuarioInfo;
  expiresIn: number;
}

export interface UsuarioInfo {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  fechaCreacion: string;
}

// =================== REPORTES ===================
export interface DashboardData {
  resumenHoy: {
    ordenesNuevas: number;
    ordenesCompletadas: number;
    ingresosDia: number;
    clientesNuevos: number;
  };
  resumenSemana: {
    totalOrdenes: number;
    totalIngresos: number;
    ordenesPromedioDia: number;
    clientesActivos: number;
  };
  estadisticasGenerales: {
    totalClientes: number;
    clientesActivos: number;
    serviciosDisponibles: number;
    ordenesUltimoMes: number;
  };
  ordenesRecientes: Orden[];
  serviciosPopulares: ServicioEstadistica[];
}

export interface ServicioEstadistica {
  servicio: Servicio;
  totalOrdenes: number;
  ingresoTotal: number;
  porcentajeUso: number;
}

export interface ReporteVentas {
  periodo: string;
  fechaInicio: string;
  fechaFin: string;
  resumen: {
    totalOrdenes: number;
    totalIngresos: number;
    promedioOrden: number;
    crecimiento: number;
  };
  ventasPorDia: VentaDia[];
  serviciosMasVendidos: ServicioEstadistica[];
  clientesFrecuentes: ClienteEstadistica[];
}

export interface VentaDia {
  fecha: string;
  ordenes: number;
  ingresos: number;
}

export interface ClienteEstadistica {
  cliente: Cliente;
  totalOrdenes: number;
  totalGastado: number;
  ultimaOrden: string;
}

// =================== NOTIFICACIONES ===================
export interface NotificacionRequest {
  destinatario: string;
  tipo: 'email' | 'whatsapp' | 'sms';
  asunto?: string;
  mensaje: string;
  plantilla?: string;
  variables?: Record<string, any>;
}

export interface WhatsAppRequest {
  numero: string;
  mensaje: string;
  tipo?: 'texto' | 'imagen' | 'documento';
  archivo?: string;
}

// =================== ERRORES ===================
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// =================== CONFIGURACIÓN ===================
export interface AppConfig {
  version: string;
  features: {
    notificaciones: boolean;
    reportes: boolean;
    backup: boolean;
    whatsapp: boolean;
  };
  limites: {
    maxClientesPorPagina: number;
    maxOrdenesPorPagina: number;
    tiempoSesion: number;
  };
}

// =================== TURNOS ===================
export type EstadoTurno = 'Iniciado' | 'En_Progreso' | 'Finalizado' | 'Cancelado';

export interface Turno {
  id: string;
  empleadoId: string;
  empleadoNombre: string;
  fecha: string;
  horaInicio: string;
  horaEntrada?: string;
  horaSalida?: string;
  cajaInicial?: number;
  cajaFinal?: number;
  totalVentas?: number;
  observaciones?: string;
  estado: EstadoTurno;
  fechaCreacion: string;
  fechaActualizacion?: string;
}

export interface CreateTurnoRequest {
  empleadoId: string;
  empleadoNombre: string;
  horaInicio: string;
  cajaInicial?: number;
  observaciones?: string;
}

export interface UpdateTurnoRequest {
  horaEntrada?: string;
  horaSalida?: string;
  cajaInicial?: number;
  cajaFinal?: number;
  totalVentas?: number;
  observaciones?: string;
  estado?: EstadoTurno;
}

export interface FinalizarTurnoRequest {
  horaSalida: string;
  cajaFinal: number;
  totalVentas: number;
  observaciones?: string;
}

export interface TurnoStats {
  totalTurnos: number;
  turnosActivos: number;
  turnosFinalizados: number;
  ingresosTotales: number;
  promedioPorTurno: number;
}

export default {
  // Exportar todos los tipos para uso general
};
