/**
 * Servicio principal para gestión de turnos
 * Actúa como wrapper entre la UI y el servicio mock/real
 */

import { 
  Turno, 
  CreateTurnoRequest, 
  UpdateTurnoRequest, 
  FinalizarTurnoRequest,
  TurnoStats,
  ApiResponse 
} from './types/ApiTypes';
import { turnoMockService } from './mock/TurnoMockService';

class TurnoService {
  private useMockService = true; // Cambiar a false cuando tengamos API real

  /**
   * Crear un nuevo turno
   */
  async crearTurno(request: CreateTurnoRequest): Promise<ApiResponse<Turno>> {
    if (this.useMockService) {
      return turnoMockService.crearTurno(request);
    }
    
    // TODO: Implementar llamada a API real
    throw new Error('API real no implementada aún');
  }

  /**
   * Marcar entrada del empleado
   */
  async marcarEntrada(turnoId: string, horaEntrada: string): Promise<ApiResponse<Turno>> {
    if (this.useMockService) {
      return turnoMockService.marcarEntrada(turnoId, horaEntrada);
    }
    
    // TODO: Implementar llamada a API real
    throw new Error('API real no implementada aún');
  }

  /**
   * Actualizar información del turno
   */
  async actualizarTurno(turnoId: string, request: UpdateTurnoRequest): Promise<ApiResponse<Turno>> {
    if (this.useMockService) {
      return turnoMockService.actualizarTurno(turnoId, request);
    }
    
    // TODO: Implementar llamada a API real
    throw new Error('API real no implementada aún');
  }

  /**
   * Finalizar turno
   */
  async finalizarTurno(turnoId: string, request: FinalizarTurnoRequest): Promise<ApiResponse<Turno>> {
    if (this.useMockService) {
      return turnoMockService.finalizarTurno(turnoId, request);
    }
    
    // TODO: Implementar llamada a API real
    throw new Error('API real no implementada aún');
  }

  /**
   * Obtener turno activo de un empleado
   */
  async obtenerTurnoActivo(empleadoId: string): Promise<ApiResponse<Turno | null>> {
    if (this.useMockService) {
      return turnoMockService.obtenerTurnoActivo(empleadoId);
    }
    
    // TODO: Implementar llamada a API real
    throw new Error('API real no implementada aún');
  }

  /**
   * Obtener historial de turnos
   */
  async obtenerHistorialTurnos(
    empleadoId?: string, 
    fechaInicio?: string, 
    fechaFin?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Turno[]>> {
    if (this.useMockService) {
      return turnoMockService.obtenerHistorialTurnos(empleadoId, fechaInicio, fechaFin, page, limit);
    }
    
    // TODO: Implementar llamada a API real
    throw new Error('API real no implementada aún');
  }

  /**
   * Obtener estadísticas de turnos
   */
  async obtenerEstadisticasTurnos(
    empleadoId?: string, 
    fechaInicio?: string, 
    fechaFin?: string
  ): Promise<ApiResponse<TurnoStats>> {
    if (this.useMockService) {
      return turnoMockService.obtenerEstadisticasTurnos(empleadoId, fechaInicio, fechaFin);
    }
    
    // TODO: Implementar llamada a API real
    throw new Error('API real no implementada aún');
  }

  /**
   * Cancelar turno
   */
  async cancelarTurno(turnoId: string, motivo?: string): Promise<ApiResponse<Turno>> {
    if (this.useMockService) {
      return turnoMockService.cancelarTurno(turnoId, motivo);
    }
    
    // TODO: Implementar llamada a API real
    throw new Error('API real no implementada aún');
  }

  /**
   * Obtener empleado actual (simulado por ahora)
   */
  obtenerEmpleadoActual(): { id: string; nombre: string } {
    // TODO: Implementar autenticación real
    return {
      id: 'emp-001',
      nombre: 'Gabriel Molina'
    };
  }

  /**
   * Helpers para desarrollo
   */
  limpiarDatosMock(): void {
    if (this.useMockService) {
      turnoMockService.limpiarDatos();
    }
  }

  obtenerTodosLosTurnosMock(): Turno[] {
    if (this.useMockService) {
      return turnoMockService.obtenerTodosLosTurnos();
    }
    return [];
  }

  /**
   * Cambiar entre mock y API real
   */
  setUseMockService(useMock: boolean): void {
    this.useMockService = useMock;
  }
}

// Singleton instance
export const turnoService = new TurnoService();
export default turnoService;
