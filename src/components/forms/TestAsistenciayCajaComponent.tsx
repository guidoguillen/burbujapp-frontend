import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { BusquedaAvanzadaService } from '../../services/BusquedaAvanzadaService';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: string;
  estado: string;
}

interface RegistroAsistencia {
  id: string;
  usuarioId: string;
  usuario: any;
  fecha: string;
  horaIngreso: string;
  horaSalida?: string;
  estado: string;
  observaciones: string;
}

interface MovimientoCaja {
  id: string;
  tipo: 'ingreso' | 'egreso';
  concepto: string;
  monto: number;
  metodoPago: string;
  fecha: string;
  usuario: any;
  descripcion: string;
}

export const TestAsistenciayCajaComponent: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [registrosAsistencia, setRegistrosAsistencia] = useState<RegistroAsistencia[]>([]);
  const [movimientosCaja, setMovimientosCaja] = useState<MovimientoCaja[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo, setModalTipo] = useState<'usuario' | 'movimiento' | 'arqueo'>('usuario');
  
  // Estados para formularios
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rol: 'operador'
  });

  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    tipo: 'ingreso' as 'ingreso' | 'egreso',
    concepto: '',
    monto: '',
    metodoPago: 'efectivo',
    usuarioId: '',
    descripcion: ''
  });

  const [nuevoArqueo, setNuevoArqueo] = useState({
    usuarioId: '',
    turno: 'mañana',
    saldoInicial: '',
    saldoReal: '',
    observaciones: ''
  });

  const busquedaService = BusquedaAvanzadaService.getInstance();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar usuarios
      const usuariosResponse = await busquedaService.obtenerUsuariosAPI();
      if (usuariosResponse.success && usuariosResponse.usuarios) {
        setUsuarios(usuariosResponse.usuarios);
      }

      // Cargar registros de asistencia
      const asistenciaResponse = await busquedaService.obtenerRegistrosAsistenciaAPI();
      if (asistenciaResponse.success && asistenciaResponse.registros) {
        setRegistrosAsistencia(asistenciaResponse.registros);
      }

      // Cargar movimientos de caja
      const movimientosResponse = await busquedaService.obtenerMovimientosCajaAPI();
      if (movimientosResponse.success && movimientosResponse.movimientos) {
        setMovimientosCaja(movimientosResponse.movimientos);
      }

    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const crearUsuario = async () => {
    if (!nuevoUsuario.nombre || !nuevoUsuario.apellido || !nuevoUsuario.email) {
      Alert.alert('Error', 'Completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const response = await busquedaService.crearUsuarioAPI(nuevoUsuario);
      
      if (response.success) {
        Alert.alert('✅ Éxito', 'Usuario creado correctamente');
        setNuevoUsuario({
          nombre: '',
          apellido: '',
          email: '',
          telefono: '',
          rol: 'operador'
        });
        setModalVisible(false);
        cargarDatos();
      } else {
        Alert.alert('❌ Error', response.error || 'No se pudo crear el usuario');
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Error inesperado al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  const registrarIngreso = async (usuarioId: string) => {
    setLoading(true);
    try {
      const response = await busquedaService.registrarIngresoAPI(usuarioId, 'Ingreso desde la app');
      
      if (response.success) {
        Alert.alert('✅ Éxito', 'Ingreso registrado correctamente');
        cargarDatos();
      } else {
        Alert.alert('❌ Error', response.error || 'No se pudo registrar el ingreso');
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Error inesperado al registrar ingreso');
    } finally {
      setLoading(false);
    }
  };

  const registrarSalida = async (registroId: string) => {
    setLoading(true);
    try {
      const response = await busquedaService.registrarSalidaAPI(registroId, 'Salida desde la app');
      
      if (response.success) {
        Alert.alert('✅ Éxito', 'Salida registrada correctamente');
        cargarDatos();
      } else {
        Alert.alert('❌ Error', response.error || 'No se pudo registrar la salida');
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Error inesperado al registrar salida');
    } finally {
      setLoading(false);
    }
  };

  const crearMovimientoCaja = async () => {
    if (!nuevoMovimiento.concepto || !nuevoMovimiento.monto || !nuevoMovimiento.usuarioId) {
      Alert.alert('Error', 'Completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const movimientoData = {
        ...nuevoMovimiento,
        monto: parseFloat(nuevoMovimiento.monto)
      };

      const response = await busquedaService.registrarMovimientoCajaAPI(movimientoData);
      
      if (response.success) {
        Alert.alert('✅ Éxito', 'Movimiento de caja registrado correctamente');
        setNuevoMovimiento({
          tipo: 'ingreso',
          concepto: '',
          monto: '',
          metodoPago: 'efectivo',
          usuarioId: '',
          descripcion: ''
        });
        setModalVisible(false);
        cargarDatos();
      } else {
        Alert.alert('❌ Error', response.error || 'No se pudo registrar el movimiento');
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Error inesperado al registrar movimiento');
    } finally {
      setLoading(false);
    }
  };

  const crearArqueo = async () => {
    if (!nuevoArqueo.usuarioId || !nuevoArqueo.saldoInicial || !nuevoArqueo.saldoReal) {
      Alert.alert('Error', 'Completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const arqueoData = {
        ...nuevoArqueo,
        saldoInicial: parseFloat(nuevoArqueo.saldoInicial),
        saldoReal: parseFloat(nuevoArqueo.saldoReal),
        detalleEfectivo: {
          billetes200: 0,
          billetes100: 0,
          billetes50: 0,
          billetes20: 0,
          billetes10: 0,
          monedas5: 0,
          monedas2: 0,
          monedas1: 0,
          centavos50: 0
        }
      };

      const response = await busquedaService.crearArqueoCajaAPI(arqueoData);
      
      if (response.success) {
        Alert.alert('✅ Éxito', 'Arqueo de caja creado correctamente');
        setNuevoArqueo({
          usuarioId: '',
          turno: 'mañana',
          saldoInicial: '',
          saldoReal: '',
          observaciones: ''
        });
        setModalVisible(false);
        cargarDatos();
      } else {
        Alert.alert('❌ Error', response.error || 'No se pudo crear el arqueo');
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Error inesperado al crear arqueo');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (tipo: 'usuario' | 'movimiento' | 'arqueo') => {
    setModalTipo(tipo);
    setModalVisible(true);
  };

  const renderUsuarios = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>👥 Usuarios ({usuarios.length})</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => abrirModal('usuario')}
        >
          <Text style={styles.addButtonText}>+ Nuevo Usuario</Text>
        </TouchableOpacity>
      </View>
      
      {usuarios.map((usuario) => (
        <View key={usuario.id} style={styles.card}>
          <Text style={styles.cardTitle}>
            {usuario.nombre} {usuario.apellido} ({usuario.rol})
          </Text>
          <Text style={styles.cardSubtitle}>{usuario.email}</Text>
          <Text style={styles.cardSubtitle}>{usuario.telefono}</Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => registrarIngreso(usuario.id)}
          >
            <Text style={styles.actionButtonText}>🕐 Registrar Ingreso</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  const renderAsistencia = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>⏰ Registros de Asistencia ({registrosAsistencia.length})</Text>
      
      {registrosAsistencia.map((registro) => (
        <View key={registro.id} style={styles.card}>
          <Text style={styles.cardTitle}>
            {registro.usuario?.nombre} {registro.usuario?.apellido}
          </Text>
          <Text style={styles.cardSubtitle}>
            📅 {registro.fecha} | Estado: {registro.estado}
          </Text>
          <Text style={styles.cardSubtitle}>
            🕐 Ingreso: {new Date(registro.horaIngreso).toLocaleTimeString()}
          </Text>
          {registro.horaSalida && (
            <Text style={styles.cardSubtitle}>
              🕐 Salida: {new Date(registro.horaSalida).toLocaleTimeString()}
            </Text>
          )}
          
          {registro.estado === 'Trabajando' && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#FF6B6B' }]}
              onPress={() => registrarSalida(registro.id)}
            >
              <Text style={styles.actionButtonText}>🚪 Registrar Salida</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  const renderMovimientosCaja = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>💰 Movimientos de Caja ({movimientosCaja.length})</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => abrirModal('movimiento')}
        >
          <Text style={styles.addButtonText}>+ Nuevo Movimiento</Text>
        </TouchableOpacity>
      </View>
      
      {movimientosCaja.map((movimiento) => (
        <View key={movimiento.id} style={styles.card}>
          <Text style={styles.cardTitle}>
            {movimiento.tipo === 'ingreso' ? '💚' : '❤️'} {movimiento.concepto}
          </Text>
          <Text style={styles.cardSubtitle}>
            Bs. {movimiento.monto.toFixed(2)} | {movimiento.metodoPago}
          </Text>
          <Text style={styles.cardSubtitle}>
            {movimiento.usuario?.nombre} {movimiento.usuario?.apellido}
          </Text>
          <Text style={styles.cardSubtitle}>
            📅 {new Date(movimiento.fecha).toLocaleString()}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderModal = () => {
    if (modalTipo === 'usuario') {
      return (
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Crear Nuevo Usuario</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={nuevoUsuario.nombre}
            onChangeText={(text) => setNuevoUsuario({...nuevoUsuario, nombre: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Apellido"
            value={nuevoUsuario.apellido}
            onChangeText={(text) => setNuevoUsuario({...nuevoUsuario, apellido: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={nuevoUsuario.email}
            onChangeText={(text) => setNuevoUsuario({...nuevoUsuario, email: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={nuevoUsuario.telefono}
            onChangeText={(text) => setNuevoUsuario({...nuevoUsuario, telefono: text})}
          />
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={crearUsuario}>
              <Text style={styles.buttonText}>Crear Usuario</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    
    if (modalTipo === 'movimiento') {
      return (
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Registrar Movimiento de Caja</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Concepto"
            value={nuevoMovimiento.concepto}
            onChangeText={(text) => setNuevoMovimiento({...nuevoMovimiento, concepto: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Monto"
            keyboardType="numeric"
            value={nuevoMovimiento.monto}
            onChangeText={(text) => setNuevoMovimiento({...nuevoMovimiento, monto: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Usuario ID"
            value={nuevoMovimiento.usuarioId}
            onChangeText={(text) => setNuevoMovimiento({...nuevoMovimiento, usuarioId: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={nuevoMovimiento.descripcion}
            onChangeText={(text) => setNuevoMovimiento({...nuevoMovimiento, descripcion: text})}
          />
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={crearMovimientoCaja}>
              <Text style={styles.buttonText}>Registrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    
    if (modalTipo === 'arqueo') {
      return (
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Crear Arqueo de Caja</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Usuario ID"
            value={nuevoArqueo.usuarioId}
            onChangeText={(text) => setNuevoArqueo({...nuevoArqueo, usuarioId: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Saldo Inicial"
            keyboardType="numeric"
            value={nuevoArqueo.saldoInicial}
            onChangeText={(text) => setNuevoArqueo({...nuevoArqueo, saldoInicial: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Saldo Real"
            keyboardType="numeric"
            value={nuevoArqueo.saldoReal}
            onChangeText={(text) => setNuevoArqueo({...nuevoArqueo, saldoReal: text})}
          />
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={crearArqueo}>
              <Text style={styles.buttonText}>Crear Arqueo</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Test APIs Asistencia y Caja</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={cargarDatos}>
          <Text style={styles.refreshButtonText}>🔄 Actualizar</Text>
        </TouchableOpacity>
      </View>

      {renderUsuarios()}
      {renderAsistencia()}
      {renderMovimientosCaja()}

      <View style={styles.section}>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: '#9C27B0', marginTop: 10 }]}
          onPress={() => abrirModal('arqueo')}
        >
          <Text style={styles.addButtonText}>📊 Crear Arqueo de Caja</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {renderModal()}
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 8,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
