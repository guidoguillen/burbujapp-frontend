/**
 * Servicio Principal de API - Unificado
 * Este servicio decide automáticamente si usar mocks o el microservicio real
 * según la configuración en ApiConfig.ts
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
  NotificacionRequest,
  WhatsAppRequest
} from './types/ApiTypes';

import { API_CONFIG, API_ENDPOINTS, getApiHeaders } from './config/ApiConfig';
import { mockApiService } from './mock/MockApiService';

/**
 * Clase principal del servicio API
 */
class BurbujAppApiService {
  private static instance: BurbujAppApiService;
  private authToken: string | null = null;

  private constructor() {}

  public static getInstance(): BurbujAppApiService {
    if (!BurbujAppApiService.instance) {
      BurbujAppApiService.instance = new BurbujAppApiService();
    }
    return BurbujAppApiService.instance;
  }

  // =================== CONFIGURACIÓN ===================
  
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = null;
  }

  getEnvironmentInfo() {
    return {
      environment: API_CONFIG.name,
      baseUrl: API_CONFIG.baseUrl,
      useMock: API_CONFIG.useMock,
      version: API_CONFIG.version
    };
  }

  // =================== MÉTODOS PRIVADOS ===================
  
  private async makeRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    if (API_CONFIG.useMock) {
      throw new Error('Esta función debe usar el mock service directamente');
    }

    const url = `${API_CONFIG.baseUrl}/${API_CONFIG.version}${endpoint}`;
    const headers = getApiHeaders(this.authToken || undefined);

    const config: RequestInit = {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) })
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error en API request:', {
        url,
        method,
        error: error instanceof Error ? error.message : error
      });
      throw error;
    }
  }

  // =================== CLIENTES ===================
  
  async getClientes(params: ClientesQueryParams = {}): Promise<ApiResponse<Cliente[]>> {
    if (API_CONFIG.useMock) {
      return mockApiService.getClientes(params);
    }
    
    try {
      // Para JSON Server, usar endpoints directos sin versioning
      const baseUrl = API_CONFIG.baseUrl.includes('localhost:3001') || API_CONFIG.baseUrl.includes(':3001') 
        ? API_CONFIG.baseUrl 
        : `${API_CONFIG.baseUrl}/${API_CONFIG.version}`;
        
      const queryString = new URLSearchParams();
      if (params.page) queryString.append('_page', params.page.toString());
      if (params.limit) queryString.append('_limit', params.limit.toString());
      if (params.search) queryString.append('q', params.search);
      if (params.estado) queryString.append('estado', params.estado);

      const url = `${baseUrl}/clientes?${queryString.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getApiHeaders(this.authToken || undefined),
        signal: AbortSignal.timeout(API_CONFIG.timeout)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Clientes obtenidos exitosamente'
      };
    } catch (error) {
      console.error('❌ Error obteniendo clientes:', error);
      return {
        success: false,
        data: [],
        message: error instanceof Error ? error.message : 'Error al obtener clientes'
      };
    }
  }

  async getClienteById(id: string): Promise<ApiResponse<Cliente>> {
    if (API_CONFIG.useMock) {
      return mockApiService.getClienteById(id);
    }
    
    return this.makeRequest<ApiResponse<Cliente>>(API_ENDPOINTS.clientes.getById(id));
  }

  async createCliente(data: CreateClienteRequest): Promise<ApiResponse<Cliente>> {
    if (API_CONFIG.useMock) {
      return mockApiService.createCliente(data);
    }
    
    return this.makeRequest<ApiResponse<Cliente>>(API_ENDPOINTS.clientes.create, 'POST', data);
  }

  async updateCliente(id: string, data: UpdateClienteRequest): Promise<ApiResponse<Cliente>> {
    if (API_CONFIG.useMock) {
      return mockApiService.updateCliente(id, data);
    }
    
    return this.makeRequest<ApiResponse<Cliente>>(API_ENDPOINTS.clientes.update(id), 'PUT', data);
  }

  async deleteCliente(id: string): Promise<ApiResponse<null>> {
    if (API_CONFIG.useMock) {
      return mockApiService.deleteCliente(id);
    }
    
    return this.makeRequest<ApiResponse<null>>(API_ENDPOINTS.clientes.delete(id), 'DELETE');
  }

  // =================== SERVICIOS ===================
  
  async getServicios(params: ServiciosQueryParams = {}): Promise<ApiResponse<Servicio[]>> {
    if (API_CONFIG.useMock) {
      return mockApiService.getServicios(params);
    }
    
    try {
      // Para JSON Server, usar endpoints directos sin versioning
      const baseUrl = API_CONFIG.baseUrl.includes('localhost:3001') || API_CONFIG.baseUrl.includes(':3001') 
        ? API_CONFIG.baseUrl 
        : `${API_CONFIG.baseUrl}/${API_CONFIG.version}`;
        
      const queryString = new URLSearchParams();
      if (params.categoria) queryString.append('categoria', params.categoria);
      if (params.activo !== undefined) queryString.append('activo', params.activo.toString());
      if (params.popular !== undefined) queryString.append('popular', params.popular.toString());

      const url = `${baseUrl}/servicios?${queryString.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getApiHeaders(this.authToken || undefined),
        signal: AbortSignal.timeout(API_CONFIG.timeout)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Servicios obtenidos exitosamente'
      };
    } catch (error) {
      console.error('❌ Error obteniendo servicios:', error);
      return {
        success: false,
        data: [],
        message: error instanceof Error ? error.message : 'Error al obtener servicios'
      };
    }
  }

  async createServicio(data: CreateServicioRequest): Promise<ApiResponse<Servicio>> {
    if (API_CONFIG.useMock) {
      return mockApiService.createServicio(data);
    }
    
    return this.makeRequest<ApiResponse<Servicio>>(API_ENDPOINTS.servicios.create, 'POST', data);
  }

  async updateServicio(id: string, data: UpdateServicioRequest): Promise<ApiResponse<Servicio>> {
    if (API_CONFIG.useMock) {
      return mockApiService.updateServicio(id, data);
    }
    
    return this.makeRequest<ApiResponse<Servicio>>(API_ENDPOINTS.servicios.update(id), 'PUT', data);
  }

  // =================== ÓRDENES ===================
  
  async getOrdenes(params: OrdenesQueryParams = {}): Promise<ApiResponse<Orden[]>> {
    if (API_CONFIG.useMock) {
      return mockApiService.getOrdenes(params);
    }
    
    try {
      // Para JSON Server, usar endpoints directos sin versioning
      const baseUrl = API_CONFIG.baseUrl.includes('localhost:3001') || API_CONFIG.baseUrl.includes(':3001') 
        ? API_CONFIG.baseUrl 
        : `${API_CONFIG.baseUrl}/${API_CONFIG.version}`;
        
      const queryString = new URLSearchParams();
      if (params.page) queryString.append('_page', params.page.toString());
      if (params.limit) queryString.append('_limit', params.limit.toString());
      if (params.estado) queryString.append('estado', params.estado);
      if (params.fechaDesde) queryString.append('fechaDesde_gte', params.fechaDesde);
      if (params.fechaHasta) queryString.append('fechaHasta_lte', params.fechaHasta);
      if (params.clienteId) queryString.append('clienteId', params.clienteId);
      if (params.termino) queryString.append('q', params.termino);
      if (params.urgente !== undefined) queryString.append('urgente', params.urgente.toString());
      if (params.pagado !== undefined) queryString.append('pagado', params.pagado.toString());
      if (params.ordenarPor) queryString.append('_sort', params.ordenarPor);
      if (params.direccion) queryString.append('_order', params.direccion);

      const url = `${baseUrl}/ordenes?${queryString.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getApiHeaders(this.authToken || undefined),
        signal: AbortSignal.timeout(API_CONFIG.timeout)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: 'Órdenes obtenidas exitosamente'
      };
    } catch (error) {
      console.error('❌ Error obteniendo órdenes:', error);
      return {
        success: false,
        data: [],
        message: error instanceof Error ? error.message : 'Error al obtener órdenes'
      };
    }
  }

  async getOrdenById(id: string): Promise<ApiResponse<Orden>> {
    if (API_CONFIG.useMock) {
      return mockApiService.getOrdenById(id);
    }
    
    return this.makeRequest<ApiResponse<Orden>>(API_ENDPOINTS.ordenes.getById(id));
  }

  async createOrden(data: CreateOrdenRequest): Promise<ApiResponse<Orden>> {
    if (API_CONFIG.useMock) {
      return mockApiService.createOrden(data);
    }
    
    return this.makeRequest<ApiResponse<Orden>>(API_ENDPOINTS.ordenes.create, 'POST', data);
  }

  async updateOrden(id: string, data: UpdateOrdenRequest): Promise<ApiResponse<Orden>> {
    if (API_CONFIG.useMock) {
      // Mock service no tiene este método implementado aún
      throw new Error('updateOrden no implementado en mock service');
    }
    
    return this.makeRequest<ApiResponse<Orden>>(API_ENDPOINTS.ordenes.update(id), 'PUT', data);
  }

  async updateEstadoOrden(id: string, data: UpdateEstadoRequest): Promise<ApiResponse<Orden>> {
    if (API_CONFIG.useMock) {
      return mockApiService.updateEstadoOrden(id, data);
    }
    
    return this.makeRequest<ApiResponse<Orden>>(API_ENDPOINTS.ordenes.updateEstado(id), 'PUT', data);
  }

  async updatePagoOrden(id: string, data: UpdatePagoRequest): Promise<ApiResponse<Orden>> {
    if (API_CONFIG.useMock) {
      return mockApiService.updatePagoOrden(id, data);
    }
    
    return this.makeRequest<ApiResponse<Orden>>(API_ENDPOINTS.ordenes.updatePago(id), 'PUT', data);
  }

  async deleteOrden(id: string): Promise<ApiResponse<null>> {
    if (API_CONFIG.useMock) {
      // Mock service no tiene este método implementado aún
      throw new Error('deleteOrden no implementado en mock service');
    }
    
    return this.makeRequest<ApiResponse<null>>(API_ENDPOINTS.ordenes.delete(id), 'DELETE');
  }

  // =================== REPORTES ===================
  
  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    if (API_CONFIG.useMock) {
      return mockApiService.getDashboard();
    }
    
    return this.makeRequest<ApiResponse<DashboardData>>(API_ENDPOINTS.reportes.dashboard);
  }

  async getReporteVentas(fechaDesde: string, fechaHasta: string): Promise<ApiResponse<ReporteVentas>> {
    if (API_CONFIG.useMock) {
      // Mock service no tiene este método implementado aún
      throw new Error('getReporteVentas no implementado en mock service');
    }
    
    const queryString = new URLSearchParams({
      fechaDesde,
      fechaHasta
    });

    const endpoint = `${API_ENDPOINTS.reportes.ventas}?${queryString.toString()}`;
    return this.makeRequest<ApiResponse<ReporteVentas>>(endpoint);
  }

  // =================== NOTIFICACIONES ===================
  
  async sendNotification(data: NotificacionRequest): Promise<ApiResponse<null>> {
    if (API_CONFIG.useMock) {
      return mockApiService.sendNotification(data);
    }
    
    return this.makeRequest<ApiResponse<null>>(API_ENDPOINTS.notificaciones.send, 'POST', data);
  }

  async sendWhatsApp(data: WhatsAppRequest): Promise<ApiResponse<null>> {
    if (API_CONFIG.useMock) {
      return mockApiService.sendWhatsApp(data);
    }
    
    return this.makeRequest<ApiResponse<null>>(API_ENDPOINTS.notificaciones.whatsapp, 'POST', data);
  }

  // =================== UTILIDADES ===================
  
  /**
   * Verificar conectividad con el backend
   */
  async checkHealth(): Promise<boolean> {
    if (API_CONFIG.useMock) {
      console.log('🟢 Mock service está disponible');
      return true;
    }

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/health`);
      const isHealthy = response.ok;
      console.log(isHealthy ? '🟢 Backend está disponible' : '🔴 Backend no está disponible');
      return isHealthy;
    } catch (error) {
      console.log('🔴 Error conectando con backend:', error);
      return false;
    }
  }

  /**
   * Obtener información del servicio
   */
  async getServiceInfo() {
    if (API_CONFIG.useMock) {
      return {
        service: 'Mock Service',
        version: '1.0.0',
        environment: API_CONFIG.name,
        stats: mockApiService.getStats()
      };
    }

    try {
      return await this.makeRequest('/info');
    } catch (error) {
      return {
        service: 'Real API',
        version: 'Unknown',
        environment: API_CONFIG.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// =================== INSTANCIA SINGLETON ===================
export const apiService = BurbujAppApiService.getInstance();

// =================== FUNCIONES DE CONVENIENCIA ===================

/**
 * Configurar token de autenticación
 */
export const setAuthToken = (token: string) => {
  apiService.setAuthToken(token);
};

/**
 * Limpiar token de autenticación
 */
export const clearAuthToken = () => {
  apiService.clearAuthToken();
};

/**
 * Obtener información del entorno actual
 */
export const getEnvironmentInfo = () => {
  return apiService.getEnvironmentInfo();
};

/**
 * Verificar salud del servicio
 */
export const checkServiceHealth = () => {
  return apiService.checkHealth();
};

export default apiService;
