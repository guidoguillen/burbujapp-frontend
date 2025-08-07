import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList, 'GestionHorarios'>;

interface Horario {
  id: string;
  nombre: string;
  descripcion: string;
  horaInicio: string;
  horaFin: string;
  diasSemana: string[];
  activo: boolean;
  empleadosAsignados: number;
  fechaCreacion: string;
  fechaModificacion: string;
}

interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string;
  telefono: string;
  email: string;
  horarioActual?: string;
  estado: 'activo' | 'inactivo' | 'vacaciones';
}

type VistaActiva = 'horarios' | 'empleados' | 'turnos';

export const GestionHorariosScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [vistaActiva, setVistaActiva] = useState<VistaActiva>('horarios');
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Horario | Empleado | null>(null);
  const [modalType, setModalType] = useState<'crear' | 'editar' | 'detalle'>('detalle');

  // Mock data para horarios
  const mockHorarios: Horario[] = [
    {
      id: 'h001',
      nombre: 'Turno Mañana',
      descripcion: 'Horario matutino para operadores',
      horaInicio: '08:00',
      horaFin: '16:00',
      diasSemana: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
      activo: true,
      empleadosAsignados: 5,
      fechaCreacion: '2025-08-01T10:00:00.000Z',
      fechaModificacion: '2025-08-01T10:00:00.000Z'
    },
    {
      id: 'h002',
      nombre: 'Turno Tarde',
      descripcion: 'Horario vespertino para operadores',
      horaInicio: '14:00',
      horaFin: '22:00',
      diasSemana: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
      activo: true,
      empleadosAsignados: 3,
      fechaCreacion: '2025-08-01T10:00:00.000Z',
      fechaModificacion: '2025-08-05T15:30:00.000Z'
    },
    {
      id: 'h003',
      nombre: 'Fin de Semana',
      descripcion: 'Horario especial para sábados y domingos',
      horaInicio: '09:00',
      horaFin: '18:00',
      diasSemana: ['Sábado', 'Domingo'],
      activo: true,
      empleadosAsignados: 2,
      fechaCreacion: '2025-07-15T08:00:00.000Z',
      fechaModificacion: '2025-07-20T12:00:00.000Z'
    },
    {
      id: 'h004',
      nombre: 'Nocturno',
      descripcion: 'Horario nocturno para servicios especiales',
      horaInicio: '22:00',
      horaFin: '06:00',
      diasSemana: ['Viernes', 'Sábado'],
      activo: false,
      empleadosAsignados: 0,
      fechaCreacion: '2025-06-01T20:00:00.000Z',
      fechaModificacion: '2025-08-01T09:00:00.000Z'
    }
  ];

  // Mock data para empleados
  const mockEmpleados: Empleado[] = [
    {
      id: 'e001',
      nombre: 'Juan Carlos',
      apellido: 'Pérez López',
      cargo: 'Operador Senior',
      telefono: '77712345',
      email: 'juan.perez@burbujapp.com',
      horarioActual: 'h001',
      estado: 'activo'
    },
    {
      id: 'e002',
      nombre: 'María Elena',
      apellido: 'García Morales',
      cargo: 'Supervisora',
      telefono: '68823456',
      email: 'maria.garcia@burbujapp.com',
      horarioActual: 'h001',
      estado: 'activo'
    },
    {
      id: 'e003',
      nombre: 'Carlos Antonio',
      apellido: 'López Rivera',
      cargo: 'Operador',
      telefono: '79934567',
      email: 'carlos.lopez@burbujapp.com',
      horarioActual: 'h002',
      estado: 'activo'
    },
    {
      id: 'e004',
      nombre: 'Ana Sofía',
      apellido: 'Martínez Cruz',
      cargo: 'Encargada de Calidad',
      telefono: '75645678',
      email: 'ana.martinez@burbujapp.com',
      horarioActual: 'h002',
      estado: 'vacaciones'
    },
    {
      id: 'e005',
      nombre: 'Pedro Miguel',
      apellido: 'Rodríguez Vega',
      cargo: 'Operador',
      telefono: '69756789',
      email: 'pedro.rodriguez@burbujapp.com',
      horarioActual: 'h003',
      estado: 'activo'
    }
  ];

  useEffect(() => {
    setHorarios(mockHorarios);
    setEmpleados(mockEmpleados);
  }, []);

  const filteredHorarios = horarios.filter(horario =>
    horario.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
    horario.descripcion.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredEmpleados = empleados.filter(empleado =>
    `${empleado.nombre} ${empleado.apellido}`.toLowerCase().includes(searchText.toLowerCase()) ||
    empleado.cargo.toLowerCase().includes(searchText.toLowerCase()) ||
    empleado.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const getHorarioNombre = (horarioId?: string) => {
    if (!horarioId) return 'Sin asignar';
    const horario = horarios.find(h => h.id === horarioId);
    return horario ? horario.nombre : 'Horario no encontrado';
  };

  const getEstadoEmpleadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return { backgroundColor: '#D1FAE5', color: '#065F46', icon: 'check-circle' as const };
      case 'inactivo':
        return { backgroundColor: '#FEE2E2', color: '#DC2626', icon: 'close-circle' as const };
      case 'vacaciones':
        return { backgroundColor: '#FEF3C7', color: '#92400E', icon: 'beach' as const };
      default:
        return { backgroundColor: '#F3F4F6', color: '#374151', icon: 'help-circle' as const };
    }
  };

  const formatDiasSemana = (dias: string[]) => {
    return dias.join(', ');
  };

  const calcularHorasTrabajo = (horaInicio: string, horaFin: string) => {
    const [inicioHoras, inicioMinutos] = horaInicio.split(':').map(Number);
    const [finHoras, finMinutos] = horaFin.split(':').map(Number);
    
    let inicioMinutosTotales = inicioHoras * 60 + inicioMinutos;
    let finMinutosTotales = finHoras * 60 + finMinutos;
    
    // Manejar horarios que cruzan medianoche
    if (finMinutosTotales < inicioMinutosTotales) {
      finMinutosTotales += 24 * 60;
    }
    
    const diferenciaMinutos = finMinutosTotales - inicioMinutosTotales;
    const horas = Math.floor(diferenciaMinutos / 60);
    const minutos = diferenciaMinutos % 60;
    
    return `${horas}h ${minutos > 0 ? `${minutos}m` : ''}`;
  };

  const crearNuevoHorario = () => {
    setModalType('crear');
    setSelectedItem(null);
    setModalVisible(true);
  };

  const asignarEmpleadoHorario = (empleadoId: string, horarioId: string) => {
    Alert.alert(
      '📅 Asignar Horario',
      `¿Confirmar asignación de horario?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Asignar', 
          onPress: () => {
            setEmpleados(prev => prev.map(emp => 
              emp.id === empleadoId ? { ...emp, horarioActual: horarioId } : emp
            ));
            Alert.alert('✅ Éxito', 'Horario asignado correctamente');
          }
        }
      ]
    );
  };

  const toggleHorarioActivo = (horarioId: string) => {
    setHorarios(prev => prev.map(horario => 
      horario.id === horarioId ? { ...horario, activo: !horario.activo } : horario
    ));
  };

  const exportarHorarios = () => {
    Alert.alert(
      '📊 Exportar Horarios',
      `Se exportarán ${filteredHorarios.length} horarios`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Exportar', 
          onPress: () => Alert.alert('✅ Éxito', 'Horarios exportados correctamente')
        }
      ]
    );
  };

  const renderHorario = ({ item }: { item: Horario }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => {
        setSelectedItem(item);
        setModalType('detalle');
        setModalVisible(true);
      }}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <MaterialCommunityIcons 
            name="clock-time-four" 
            size={20} 
            color={item.activo ? '#3B82F6' : '#9CA3AF'} 
          />
          <Text style={[styles.cardTitle, !item.activo && { color: '#9CA3AF' }]}>
            {item.nombre}
          </Text>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: item.activo ? '#D1FAE5' : '#F3F4F6' }
          ]}>
            <Text style={[
              styles.statusText, 
              { color: item.activo ? '#065F46' : '#6B7280' }
            ]}>
              {item.activo ? 'Activo' : 'Inactivo'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => toggleHorarioActivo(item.id)}
        >
          <MaterialCommunityIcons 
            name={item.activo ? "toggle-switch" : "toggle-switch-off"} 
            size={24} 
            color={item.activo ? '#10B981' : '#9CA3AF'} 
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.cardDescription}>{item.descripcion}</Text>
      
      <View style={styles.horarioDetails}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="clock-outline" size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {item.horaInicio} - {item.horaFin} ({calcularHorasTrabajo(item.horaInicio, item.horaFin)})
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="calendar-week" size={16} color="#6B7280" />
          <Text style={styles.detailText}>{formatDiasSemana(item.diasSemana)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="account-group" size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {item.empleadosAsignados} empleado{item.empleadosAsignados !== 1 ? 's' : ''} asignado{item.empleadosAsignados !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpleado = ({ item }: { item: Empleado }) => {
    const estadoStyle = getEstadoEmpleadoColor(item.estado);
    
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => {
          setSelectedItem(item);
          setModalType('detalle');
          setModalVisible(true);
        }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <MaterialCommunityIcons name="account" size={20} color="#3B82F6" />
            <Text style={styles.cardTitle}>{item.nombre} {item.apellido}</Text>
            <View style={[styles.statusBadge, { backgroundColor: estadoStyle.backgroundColor }]}>
              <MaterialCommunityIcons 
                name={estadoStyle.icon} 
                size={12} 
                color={estadoStyle.color} 
              />
              <Text style={[styles.statusText, { color: estadoStyle.color }]}>
                {item.estado}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.cardDescription}>{item.cargo}</Text>
        
        <View style={styles.horarioDetails}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="email" size={16} color="#6B7280" />
            <Text style={styles.detailText}>{item.email}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="phone" size={16} color="#6B7280" />
            <Text style={styles.detailText}>{item.telefono}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="clock-time-four" size={16} color="#6B7280" />
            <Text style={styles.detailText}>
              Horario: {getHorarioNombre(item.horarioActual)}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.assignButton}
          onPress={() => {
            // Mostrar selector de horarios
            Alert.alert('📅 Cambiar Horario', 'Funcionalidad de cambio de horario');
          }}
        >
          <MaterialCommunityIcons name="calendar-edit" size={16} color="#3B82F6" />
          <Text style={styles.assignButtonText}>Cambiar Horario</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión de Horarios</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn} onPress={exportarHorarios}>
            <MaterialCommunityIcons name="download" size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={crearNuevoHorario}>
            <MaterialCommunityIcons name="plus" size={20} color="#10B981" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs de Vista */}
      <View style={styles.tabsContainer}>
        {([
          { key: 'horarios', label: 'Horarios', icon: 'clock-time-four', count: horarios.length },
          { key: 'empleados', label: 'Empleados', icon: 'account-group', count: empleados.length },
          { key: 'turnos', label: 'Turnos', icon: 'calendar-multiselect', count: 0 }
        ] as const).map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              vistaActiva === tab.key && styles.tabActive
            ]}
            onPress={() => setVistaActiva(tab.key)}
          >
            <MaterialCommunityIcons 
              name={tab.icon} 
              size={16} 
              color={vistaActiva === tab.key ? '#3B82F6' : '#6B7280'} 
            />
            <Text style={[
              styles.tabText,
              vistaActiva === tab.key && styles.tabTextActive
            ]}>
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder={`Buscar ${vistaActiva}...`}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista */}
      {vistaActiva === 'horarios' && (
        <FlatList
          data={filteredHorarios}
          keyExtractor={(item) => item.id}
          renderItem={renderHorario}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="clock-time-four" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No hay horarios disponibles</Text>
              <Text style={styles.emptySubtext}>
                {searchText ? 'Prueba con otro término de búsqueda' : 'Crea el primer horario'}
              </Text>
            </View>
          }
        />
      )}
      
      {vistaActiva === 'empleados' && (
        <FlatList
          data={filteredEmpleados}
          keyExtractor={(item) => item.id}
          renderItem={renderEmpleado}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="account-group" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No hay empleados disponibles</Text>
              <Text style={styles.emptySubtext}>
                {searchText ? 'Prueba con otro término de búsqueda' : 'Agrega empleados'}
              </Text>
            </View>
          }
        />
      )}
      
      {vistaActiva === 'turnos' && (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="calendar-multiselect" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>Gestión de Turnos</Text>
          <Text style={styles.emptySubtext}>Funcionalidad próximamente</Text>
        </View>
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalType === 'crear' ? 'Crear Horario' : 
                 modalType === 'editar' ? 'Editar' : 'Detalles'}
              </Text>
              <TouchableOpacity 
                style={styles.closeBtn}
                onPress={() => setModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              {selectedItem && vistaActiva === 'horarios' && (
                <View>
                  <Text style={styles.modalItemTitle}>
                    {(selectedItem as Horario).nombre}
                  </Text>
                  <Text style={styles.modalItemDescription}>
                    {(selectedItem as Horario).descripcion}
                  </Text>
                  
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Horario:</Text>
                    <Text style={styles.modalDetailValue}>
                      {(selectedItem as Horario).horaInicio} - {(selectedItem as Horario).horaFin}
                    </Text>
                  </View>
                  
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Días:</Text>
                    <Text style={styles.modalDetailValue}>
                      {formatDiasSemana((selectedItem as Horario).diasSemana)}
                    </Text>
                  </View>
                  
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Empleados asignados:</Text>
                    <Text style={styles.modalDetailValue}>
                      {(selectedItem as Horario).empleadosAsignados}
                    </Text>
                  </View>
                </View>
              )}
              
              {selectedItem && vistaActiva === 'empleados' && (
                <View>
                  <Text style={styles.modalItemTitle}>
                    {(selectedItem as Empleado).nombre} {(selectedItem as Empleado).apellido}
                  </Text>
                  <Text style={styles.modalItemDescription}>
                    {(selectedItem as Empleado).cargo}
                  </Text>
                  
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Email:</Text>
                    <Text style={styles.modalDetailValue}>
                      {(selectedItem as Empleado).email}
                    </Text>
                  </View>
                  
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Teléfono:</Text>
                    <Text style={styles.modalDetailValue}>
                      {(selectedItem as Empleado).telefono}
                    </Text>
                  </View>
                  
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Horario actual:</Text>
                    <Text style={styles.modalDetailValue}>
                      {getHorarioNombre((selectedItem as Empleado).horarioActual)}
                    </Text>
                  </View>
                  
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Estado:</Text>
                    <Text style={styles.modalDetailValue}>
                      {(selectedItem as Empleado).estado}
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  backBtn: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#EBF8FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  toggleButton: {
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  horarioDetails: {
    gap: 6,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
    marginTop: 8,
    gap: 6,
  },
  assignButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
  },
  modalItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  modalItemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  modalDetailRow: {
    marginBottom: 12,
  },
  modalDetailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  modalDetailValue: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
});
