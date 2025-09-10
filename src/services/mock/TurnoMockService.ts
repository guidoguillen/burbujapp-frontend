/**
 * Servicio Mock para gestión de turnos
 * Simula las operaciones de API para desarrollo y testing
 */

import { 
  Turno, 
  CreateTurnoRequest, 
  UpdateTurnoRequest, 
  FinalizarTurnoRequest,
  TurnoStats,
  ApiResponse,
  EstadoTurno 
} from '../types/ApiTypes';

class TurnoMockService {
  private turnos: Turno[] = [];
  private currentId = 1;

  // Simular delay de red
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return `turno-${String(this.currentId++).padStart(3, '0')}`;
  }

  /**
   * Crear un nuevo turno
   */
  async crearTurno(request: CreateTurnoRequest): Promise<ApiResponse<Turno>> {
    try {
      await this.delay(300);

      // Verificar si ya hay un turno activo para el empleado
      const turnoActivo = this.turnos.find(
        t => t.empleadoId === request.empleadoId && 
        (t.estado === 'Iniciado' || t.estado === 'En_Progreso')
      );

      if (turnoActivo) {
        return {
          success: false,
          data: {} as Turno,
          message: 'Ya tienes un turno activo. Debes finalizarlo antes de crear uno nuevo.',
          errors: ['TURNO_ACTIVO_EXISTENTE']
        };
      }

      const nuevoTurno: Turno = {
        id: this.generateId(),
        empleadoId: request.empleadoId,
        empleadoNombre: request.empleadoNombre,
        fecha: new Date().toISOString().split('T')[0],
        horaInicio: request.horaInicio,
        cajaInicial: request.cajaInicial,
        observaciones: request.observaciones,
        estado: 'Iniciado',
        fechaCreacion: new Date().toISOString(),
      };

      this.turnos.push(nuevoTurno);

      return {
        success: true,
        data: nuevoTurno,
        message: 'Turno creado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Turno,
        message: 'Error al crear el turno',
        errors: ['ERROR_INTERNO']
      };
    }
  }

  /**
   * Marcar entrada del empleado
   */
  async marcarEntrada(turnoId: string, horaEntrada: string): Promise<ApiResponse<Turno>> {
    try {
      await this.delay(200);

      const turno = this.turnos.find(t => t.id === turnoId);
      
      if (!turno) {
        return {
          success: false,
          data: {} as Turno,
          message: 'Turno no encontrado',
          errors: ['TURNO_NO_ENCONTRADO']
        };
      }

      if (turno.horaEntrada) {
        return {
          success: false,
          data: turno,
          message: 'Ya se registró la entrada para este turno',
          errors: ['ENTRADA_YA_REGISTRADA']
        };
      }

      turno.horaEntrada = horaEntrada;
      turno.estado = 'En_Progreso';
      turno.fechaActualizacion = new Date().toISOString();

      return {
        success: true,
        data: turno,
        message: 'Entrada registrada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Turno,
        message: 'Error al marcar entrada',
        errors: ['ERROR_INTERNO']
      };
    }
  }

  /**
   * Actualizar información del turno
   */
  async actualizarTurno(turnoId: string, request: UpdateTurnoRequest): Promise<ApiResponse<Turno>> {
    try {
      await this.delay(300);

      const turno = this.turnos.find(t => t.id === turnoId);
      
      if (!turno) {
        return {
          success: false,
          data: {} as Turno,
          message: 'Turno no encontrado',
          errors: ['TURNO_NO_ENCONTRADO']
        };
      }

      // Actualizar campos proporcionados
      Object.keys(request).forEach(key => {
        const value = (request as any)[key];
        if (value !== undefined) {
          (turno as any)[key] = value;
        }
      });

      turno.fechaActualizacion = new Date().toISOString();

      return {
        success: true,
        data: turno,
        message: 'Turno actualizado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Turno,
        message: 'Error al actualizar turno',
        errors: ['ERROR_INTERNO']
      };
    }
  }

  /**
   * Finalizar turno
   */
  async finalizarTurno(turnoId: string, request: FinalizarTurnoRequest): Promise<ApiResponse<Turno>> {
    try {
      await this.delay(400);

      const turno = this.turnos.find(t => t.id === turnoId);
      
      if (!turno) {
        return {
          success: false,
          data: {} as Turno,
          message: 'Turno no encontrado',
          errors: ['TURNO_NO_ENCONTRADO']
        };
      }

      if (turno.estado === 'Finalizado') {
        return {
          success: false,
          data: turno,
          message: 'El turno ya está finalizado',
          errors: ['TURNO_YA_FINALIZADO']
        };
      }

      if (!turno.horaEntrada) {
        return {
          success: false,
          data: turno,
          message: 'No se puede finalizar un turno sin entrada registrada',
          errors: ['ENTRADA_NO_REGISTRADA']
        };
      }

      turno.horaSalida = request.horaSalida;
      turno.cajaFinal = request.cajaFinal;
      turno.totalVentas = request.totalVentas;
      turno.observaciones = request.observaciones || turno.observaciones;
      turno.estado = 'Finalizado';
      turno.fechaActualizacion = new Date().toISOString();

      return {
        success: true,
        data: turno,
        message: 'Turno finalizado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Turno,
        message: 'Error al finalizar turno',
        errors: ['ERROR_INTERNO']
      };
    }
  }

  /**
   * Obtener turno activo de un empleado
   */
  async obtenerTurnoActivo(empleadoId: string): Promise<ApiResponse<Turno | null>> {
    try {
      await this.delay(200);

      const turnoActivo = this.turnos.find(
        t => t.empleadoId === empleadoId && 
        (t.estado === 'Iniciado' || t.estado === 'En_Progreso')
      );

      return {
        success: true,
        data: turnoActivo || null,
        message: turnoActivo ? 'Turno activo encontrado' : 'No hay turnos activos'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Error al obtener turno activo',
        errors: ['ERROR_INTERNO']
      };
    }
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
    try {
      await this.delay(300);

      let turnosFiltrados = [...this.turnos];

      // Filtrar por empleado
      if (empleadoId) {
        turnosFiltrados = turnosFiltrados.filter(t => t.empleadoId === empleadoId);
      }

      // Filtrar por fechas
      if (fechaInicio) {
        turnosFiltrados = turnosFiltrados.filter(t => t.fecha >= fechaInicio);
      }
      if (fechaFin) {
        turnosFiltrados = turnosFiltrados.filter(t => t.fecha <= fechaFin);
      }

      // Ordenar por fecha más reciente
      turnosFiltrados.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());

      // Paginación
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const turnosPaginados = turnosFiltrados.slice(startIndex, endIndex);

      return {
        success: true,
        data: turnosPaginados,
        message: 'Historial de turnos obtenido exitosamente',
        pagination: {
          page,
          totalPages: Math.ceil(turnosFiltrados.length / limit),
          totalItems: turnosFiltrados.length,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Error al obtener historial de turnos',
        errors: ['ERROR_INTERNO']
      };
    }
  }

  /**
   * Obtener estadísticas de turnos
   */
  async obtenerEstadisticasTurnos(empleadoId?: string, fechaInicio?: string, fechaFin?: string): Promise<ApiResponse<TurnoStats>> {
    try {
      await this.delay(200);

      let turnosAnalizar = [...this.turnos];

      // Filtros
      if (empleadoId) {
        turnosAnalizar = turnosAnalizar.filter(t => t.empleadoId === empleadoId);
      }
      if (fechaInicio) {
        turnosAnalizar = turnosAnalizar.filter(t => t.fecha >= fechaInicio);
      }
      if (fechaFin) {
        turnosAnalizar = turnosAnalizar.filter(t => t.fecha <= fechaFin);
      }

      const totalTurnos = turnosAnalizar.length;
      const turnosActivos = turnosAnalizar.filter(t => t.estado === 'Iniciado' || t.estado === 'En_Progreso').length;
      const turnosFinalizados = turnosAnalizar.filter(t => t.estado === 'Finalizado').length;
      
      const ingresosTotales = turnosAnalizar
        .filter(t => t.totalVentas)
        .reduce((sum, t) => sum + (t.totalVentas || 0), 0);
      
      const promedioPorTurno = turnosFinalizados > 0 ? ingresosTotales / turnosFinalizados : 0;

      const stats: TurnoStats = {
        totalTurnos,
        turnosActivos,
        turnosFinalizados,
        ingresosTotales,
        promedioPorTurno: Math.round(promedioPorTurno * 100) / 100
      };

      return {
        success: true,
        data: stats,
        message: 'Estadísticas obtenidas exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        data: {} as TurnoStats,
        message: 'Error al obtener estadísticas',
        errors: ['ERROR_INTERNO']
      };
    }
  }

  /**
   * Cancelar turno
   */
  async cancelarTurno(turnoId: string, motivo?: string): Promise<ApiResponse<Turno>> {
    try {
      await this.delay(300);

      const turno = this.turnos.find(t => t.id === turnoId);
      
      if (!turno) {
        return {
          success: false,
          data: {} as Turno,
          message: 'Turno no encontrado',
          errors: ['TURNO_NO_ENCONTRADO']
        };
      }

      if (turno.estado === 'Finalizado') {
        return {
          success: false,
          data: turno,
          message: 'No se puede cancelar un turno finalizado',
          errors: ['TURNO_YA_FINALIZADO']
        };
      }

      turno.estado = 'Cancelado';
      turno.observaciones = motivo ? `${turno.observaciones || ''}\nCancelado: ${motivo}` : turno.observaciones;
      turno.fechaActualizacion = new Date().toISOString();

      return {
        success: true,
        data: turno,
        message: 'Turno cancelado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        data: {} as Turno,
        message: 'Error al cancelar turno',
        errors: ['ERROR_INTERNO']
      };
    }
  }

  /**
   * Limpiar datos (solo para desarrollo)
   */
  limpiarDatos(): void {
    this.turnos = [];
    this.currentId = 1;
  }

  /**
   * Obtener todos los turnos (solo para desarrollo/debug)
   */
  obtenerTodosLosTurnos(): Turno[] {
    return [...this.turnos];
  }
}

// Singleton instance
export const turnoMockService = new TurnoMockService();
export default turnoMockService;
