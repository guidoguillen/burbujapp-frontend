import { BusquedaAvanzadaService } from './BusquedaAvanzadaService';

// Mock de fetch para simular respuestas de la API
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('BusquedaAvanzadaService', () => {
  let service: BusquedaAvanzadaService;

  beforeEach(() => {
    service = BusquedaAvanzadaService.getInstance();
    mockFetch.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('debe retornar la misma instancia (singleton)', () => {
      const service1 = BusquedaAvanzadaService.getInstance();
      const service2 = BusquedaAvanzadaService.getInstance();
      
      expect(service1).toBe(service2);
    });
  });

  describe('obtenerUsuariosAPI', () => {
    it('debe obtener usuarios exitosamente', async () => {
      const mockUsuarios = [
        {
          id: 'usuario-001',
          nombre: 'Gabriel',
          apellido: 'Molina',
          email: 'gabriel@test.com',
          rol: 'administrador'
        }
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValueOnce(mockUsuarios)
      });

      const result = await service.obtenerUsuariosAPI();

      expect(result.success).toBe(true);
      expect(result.usuarios).toEqual(mockUsuarios);
      expect(result.error).toBeUndefined();
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/usuarios'));
    });

    it('debe manejar errores de red correctamente', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await service.obtenerUsuariosAPI();

      expect(result.success).toBe(false);
      expect(result.usuarios).toBeUndefined();
      expect(result.error).toBe('Network error');
    });

    it('debe manejar errores HTTP correctamente', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: jest.fn()
      });

      const result = await service.obtenerUsuariosAPI();

      expect(result.success).toBe(false);
      expect(result.usuarios).toBeUndefined();
      expect(result.error).toBe('HTTP error! status: 404');
    });
  });

  describe('crearUsuarioAPI', () => {
    it('debe crear un usuario exitosamente', async () => {
      const nuevoUsuario = {
        nombre: 'Test',
        apellido: 'User',
        email: 'test@example.com',
        telefono: '+591 12345678',
        rol: 'operador'
      };

      const usuarioCreado = {
        id: 'usuario-123',
        ...nuevoUsuario,
        estado: 'Activo',
        fechaCreacion: '2025-08-10T00:00:00Z'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: jest.fn().mockResolvedValueOnce(usuarioCreado)
      });

      const result = await service.crearUsuarioAPI(nuevoUsuario);

      expect(result.success).toBe(true);
      expect(result.usuario).toEqual(usuarioCreado);
      expect(result.error).toBeUndefined();

      const fetchCall = mockFetch.mock.calls[0];
      expect(fetchCall[0]).toContain('/usuarios');
      expect(fetchCall[1].method).toBe('POST');
      expect(fetchCall[1].headers['Content-Type']).toBe('application/json');
    });

    it('debe validar datos requeridos', async () => {
      // En una implementación real, el servicio podría validar antes de hacer la petición
      const datosIncompletos = {
        nombre: 'Test',
        apellido: '',
        email: '',
        telefono: '',
        rol: 'operador'
      };

      // Simular que la API rechaza datos incompletos
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: jest.fn()
      });

      const result = await service.crearUsuarioAPI(datosIncompletos);

      expect(result.success).toBe(false);
      expect(result.error).toBe('HTTP error! status: 400');
    });
  });

  describe('registrarIngresoAPI', () => {
    it('debe registrar ingreso de asistencia exitosamente', async () => {
      const usuarioId = 'usuario-001';
      const mockUsuario = {
        id: usuarioId,
        nombre: 'Gabriel',
        apellido: 'Molina',
        rol: 'administrador'
      };

      const mockRegistro = {
        id: 'asistencia-123',
        usuarioId: usuarioId,
        usuario: mockUsuario,
        fecha: '2025-08-10',
        horaIngreso: '2025-08-10T08:00:00Z',
        estado: 'Trabajando'
      };

      // Mock para obtener datos del usuario
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValueOnce(mockUsuario)
        })
        // Mock para crear el registro de asistencia
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: jest.fn().mockResolvedValueOnce(mockRegistro)
        });

      const result = await service.registrarIngresoAPI(usuarioId, 'Test ingreso');

      expect(result.success).toBe(true);
      expect(result.registro).toEqual(mockRegistro);
      expect(result.error).toBeUndefined();

      // Verificar que se hicieron las llamadas correctas
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch.mock.calls[0][0]).toContain(`/usuarios/${usuarioId}`);
      expect(mockFetch.mock.calls[1][0]).toContain('/registroAsistencia');
    });

    it('debe manejar usuario inexistente', async () => {
      const usuarioId = 'usuario-inexistente';

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: jest.fn()
      });

      const result = await service.registrarIngresoAPI(usuarioId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Usuario no encontrado');
    });
  });

  describe('registrarMovimientoCajaAPI', () => {
    it('debe registrar movimiento de caja exitosamente', async () => {
      const datosMovimiento = {
        tipo: 'ingreso' as const,
        concepto: 'Venta de servicios',
        monto: 100.50,
        metodoPago: 'efectivo',
        usuarioId: 'usuario-001',
        descripcion: 'Pago cliente'
      };

      const mockUsuario = {
        id: 'usuario-001',
        nombre: 'Gabriel',
        apellido: 'Molina'
      };

      const mockMovimiento = {
        id: 'movimiento-123',
        ...datosMovimiento,
        usuario: mockUsuario,
        fecha: '2025-08-10T10:00:00Z',
        estado: 'confirmado'
      };

      // Mock para obtener datos del usuario
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: jest.fn().mockResolvedValueOnce(mockUsuario)
        })
        // Mock para crear el movimiento
        .mockResolvedValueOnce({
          ok: true,
          status: 201,
          json: jest.fn().mockResolvedValueOnce(mockMovimiento)
        });

      const result = await service.registrarMovimientoCajaAPI(datosMovimiento);

      expect(result.success).toBe(true);
      expect(result.movimiento).toEqual(mockMovimiento);
      expect(result.error).toBeUndefined();
      
      // Verificar las llamadas a la API
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch.mock.calls[1][0]).toContain('/movimientosCaja');
      expect(mockFetch.mock.calls[1][1].method).toBe('POST');
    });
  });

  describe('actualizarUsuarioAPI', () => {
    it('debe actualizar usuario exitosamente', async () => {
      const usuarioId = 'usuario-001';
      const datosActualizacion = {
        telefono: '+591 87654321',
        ultimoAcceso: '2025-08-10T10:00:00Z'
      };

      const usuarioActualizado = {
        id: usuarioId,
        nombre: 'Gabriel',
        apellido: 'Molina',
        email: 'gabriel@test.com',
        ...datosActualizacion
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValueOnce(usuarioActualizado)
      });

      const result = await service.actualizarUsuarioAPI(usuarioId, datosActualizacion);

      expect(result.success).toBe(true);
      expect(result.usuario).toEqual(usuarioActualizado);
      expect(result.error).toBeUndefined();

      const fetchCall = mockFetch.mock.calls[0];
      expect(fetchCall[0]).toContain(`/usuarios/${usuarioId}`);
      expect(fetchCall[1].method).toBe('PATCH');
    });
  });
});
