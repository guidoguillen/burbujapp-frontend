import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList, 'SelectCliente'>;

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  email?: string;
  fechaUltimaOrden?: string;
  totalOrdenes?: number;
  esFavorito?: boolean;
}

// Datos mock de clientes expandidos
const clientesMock: Cliente[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    telefono: '+591 70123456',
    direccion: 'Av. Banzer 2do anillo, Santa Cruz',
    email: 'juan.perez@email.com',
    fechaUltimaOrden: '2024-08-05',
    totalOrdenes: 15,
    esFavorito: true
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'González',
    telefono: '+591 75987654',
    direccion: 'Calle Beni entre 6to y 7mo anillo',
    email: 'maria.gonzalez@email.com',
    fechaUltimaOrden: '2024-08-03',
    totalOrdenes: 8,
    esFavorito: false
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellido: 'López',
    telefono: '+591 68445566',
    direccion: 'Barrio Hamacas, Plan 3000',
    email: 'carlos.lopez@email.com',
    fechaUltimaOrden: '2024-07-28',
    totalOrdenes: 23,
    esFavorito: true
  },
  {
    id: '4',
    nombre: 'Gabriel',
    apellido: 'Molina',
    telefono: '+591 79954303',
    direccion: 'Zona Norte, Av. Cristo Redentor',
    email: 'gabriel.molina@email.com',
    fechaUltimaOrden: '2024-08-01',
    totalOrdenes: 5,
    esFavorito: false
  },
  {
    id: '5',
    nombre: 'Ana',
    apellido: 'Rodríguez',
    telefono: '+591 72334455',
    direccion: 'Equipetrol Norte, calle 1',
    email: 'ana.rodriguez@email.com',
    fechaUltimaOrden: '2024-08-04',
    totalOrdenes: 12,
    esFavorito: true
  }
];

export const SelectClienteScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [busqueda, setBusqueda] = useState('');
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    email: ''
  });

  // Inicializar datos
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      inicializarDatos();
    });
    return unsubscribe;
  }, [navigation]);

  const inicializarDatos = () => {
    // Resetear campos
    setBusqueda('');
    setClientesFiltrados([]);
    setMostrarDropdown(false);
    setMostrarFormulario(false);
    setNuevoCliente({
      nombre: '',
      apellido: '',
      telefono: '',
      direccion: '',
      email: ''
    });
  };

  // Búsqueda mejorada
  useEffect(() => {
    if (busqueda.length > 0) {
      setCargando(true);
      
      // Simular delay de búsqueda
      const timeoutId = setTimeout(() => {
        const filtrados = clientesMock.filter(cliente => {
          const searchTerm = busqueda.toLowerCase();
          return (
            cliente.nombre.toLowerCase().includes(searchTerm) ||
            cliente.apellido.toLowerCase().includes(searchTerm) ||
            cliente.telefono.includes(busqueda) ||
            (cliente.email && cliente.email.toLowerCase().includes(searchTerm)) ||
            cliente.direccion.toLowerCase().includes(searchTerm)
          );
        });
        
        setClientesFiltrados(filtrados);
        setMostrarDropdown(true);
        setCargando(false);
      }, 300);

      return () => {
        clearTimeout(timeoutId);
        setCargando(false);
      };
    } else {
      setClientesFiltrados([]);
      setMostrarDropdown(false);
      setCargando(false);
    }
  }, [busqueda]);

  const handleSeleccionarCliente = (cliente: Cliente) => {
    setBusqueda('');
    setMostrarDropdown(false);
    navigation.navigate('SelectArticulos', { cliente });
  };

  const validarFormulario = () => {
    const errores = [];
    
    if (!nuevoCliente.nombre.trim()) errores.push('El nombre es obligatorio');
    if (!nuevoCliente.apellido.trim()) errores.push('El apellido es obligatorio');
    if (!nuevoCliente.telefono.trim()) errores.push('El teléfono es obligatorio');
    
    // Validar formato de teléfono boliviano
    const telefonoRegex = /^\+591\s[67]\d{7}$/;
    if (nuevoCliente.telefono && !telefonoRegex.test(nuevoCliente.telefono)) {
      errores.push('El teléfono debe tener el formato: +591 7XXXXXXX');
    }
    
    // Validar email si se proporciona
    if (nuevoCliente.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(nuevoCliente.email)) {
        errores.push('El email no tiene un formato válido');
      }
    }
    
    return errores;
  };

  const handleCrearNuevoCliente = () => {
    const errores = validarFormulario();
    
    if (errores.length > 0) {
      Alert.alert('Errores en el formulario', errores.join('\n'));
      return;
    }

    const cliente: Cliente = {
      id: Date.now().toString(),
      ...nuevoCliente,
      fechaUltimaOrden: new Date().toISOString().split('T')[0],
      totalOrdenes: 0,
      esFavorito: false
    };
    
    setMostrarFormulario(false);
    navigation.navigate('SelectArticulos', { cliente });
  };

  const getAvatarColor = (nombre: string) => {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
    const index = nombre.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const mostrarCrearNuevo = busqueda.length > 0 && clientesFiltrados.length === 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seleccionar Cliente</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Indicador de progreso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={[styles.progressCircle, styles.progressCircleActive]}>
            <Text style={[styles.progressText, styles.progressTextActive]}>1</Text>
          </View>
          <Text style={styles.progressLabel}>Cliente</Text>
        </View>
        
        <View style={styles.progressLine} />
        
        <View style={styles.progressStep}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>2</Text>
          </View>
          <Text style={styles.progressLabel}>Artículos</Text>
        </View>

        <View style={styles.progressLine} />
        
        <View style={styles.progressStep}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>3</Text>
          </View>
          <Text style={styles.progressLabel}>Revisar</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sección principal de búsqueda */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="account-search" size={24} color="#059669" />
            <Text style={styles.sectionTitle}>Buscar Cliente</Text>
          </View>
          <Text style={styles.sectionDesc}>Encuentra un cliente existente o crea uno nuevo</Text>
          
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre, teléfono, email..."
              value={busqueda}
              onChangeText={setBusqueda}
              autoFocus={false}
            />
            {cargando && (
              <MaterialCommunityIcons name="loading" size={20} color="#059669" style={styles.loadingIcon} />
            )}
            {busqueda.length > 0 && !cargando && (
              <TouchableOpacity onPress={() => setBusqueda('')} style={styles.clearButton}>
                <MaterialCommunityIcons name="close-circle" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>

          {/* Resultados de búsqueda */}
          {mostrarDropdown && (
            <View style={styles.searchResults}>
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((cliente, index) => (
                  <TouchableOpacity
                    key={cliente.id}
                    style={[
                      styles.clienteCard,
                      index === clientesFiltrados.length - 1 && { borderBottomWidth: 0 }
                    ]}
                    onPress={() => handleSeleccionarCliente(cliente)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.clienteInfo}>
                      <View style={[styles.avatar, { backgroundColor: getAvatarColor(cliente.nombre) }]}>
                        <Text style={styles.avatarText}>
                          {cliente.nombre.charAt(0)}{cliente.apellido.charAt(0)}
                        </Text>
                      </View>
                      <View style={styles.clienteDetalles}>
                        <Text style={styles.clienteNombre}>{cliente.nombre} {cliente.apellido}</Text>
                        <Text style={styles.clienteTelefono}>{cliente.telefono}</Text>
                        {cliente.email && (
                          <Text style={styles.clienteEmail}>{cliente.email}</Text>
                        )}
                        <Text style={styles.clienteDireccion} numberOfLines={1}>{cliente.direccion}</Text>
                      </View>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={18} color="#C7C7CC" />
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noResultados}>
                  <MaterialCommunityIcons name="account-search-outline" size={48} color="#9CA3AF" />
                  <Text style={styles.noResultadosTexto}>No se encontraron clientes</Text>
                  <TouchableOpacity
                    style={styles.crearNuevoBtn}
                    onPress={() => setMostrarFormulario(true)}
                  >
                    <MaterialCommunityIcons name="plus-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.crearNuevoText}>Crear nuevo cliente</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Filtros y clientes sugeridos */}
        {!mostrarDropdown && (
          <View style={styles.section}>
            <View style={styles.emptyStateContainer}>
              <MaterialCommunityIcons name="account-search-outline" size={64} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>Busca un cliente</Text>
              <Text style={styles.emptyStateDesc}>
                Escribe el nombre, teléfono o email del cliente en el campo de búsqueda
              </Text>
              
              <TouchableOpacity
                style={styles.crearNuevoMainBtn}
                onPress={() => setMostrarFormulario(true)}
              >
                <MaterialCommunityIcons name="account-plus" size={20} color="#FFFFFF" />
                <Text style={styles.crearNuevoMainText}>Crear Nuevo Cliente</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Botón flotante para crear nuevo cliente */}
        {/* Eliminado - ya no es necesario */}

        {/* Modal para crear nuevo cliente */}
        <Modal
          visible={mostrarFormulario}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setMostrarFormulario(false)}
        >
          <View style={styles.modalContainer}>
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                onPress={() => setMostrarFormulario(false)}
                style={styles.modalCloseBtn}
              >
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Nuevo Cliente</Text>
              <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSubtitle}>
                Complete la información del nuevo cliente
              </Text>

              <View style={styles.formRow}>
                <View style={styles.formColumn}>
                  <Text style={styles.label}>Nombre *</Text>
                  <TextInput
                    style={styles.input}
                    value={nuevoCliente.nombre}
                    onChangeText={(text) => setNuevoCliente(prev => ({ ...prev, nombre: text }))}
                    placeholder="Ej: Juan"
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.formColumn}>
                  <Text style={styles.label}>Apellido *</Text>
                  <TextInput
                    style={styles.input}
                    value={nuevoCliente.apellido}
                    onChangeText={(text) => setNuevoCliente(prev => ({ ...prev, apellido: text }))}
                    placeholder="Ej: Pérez"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Teléfono *</Text>
                <View style={styles.phoneInputContainer}>
                  <Text style={styles.phonePrefix}>🇧🇴 +591</Text>
                  <TextInput
                    style={styles.phoneInput}
                    value={nuevoCliente.telefono.replace('+591 ', '')}
                    onChangeText={(text) => {
                      // Limpiar entrada y formatear
                      const cleaned = text.replace(/\D/g, '');
                      const formatted = cleaned.length > 0 ? `+591 ${cleaned}` : '';
                      setNuevoCliente(prev => ({ ...prev, telefono: formatted }));
                    }}
                    placeholder="70123456"
                    keyboardType="phone-pad"
                    maxLength={8}
                  />
                </View>
                <Text style={styles.helpText}>Formato: +591 7XXXXXXX</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={nuevoCliente.email}
                  onChangeText={(text) => setNuevoCliente(prev => ({ ...prev, email: text }))}
                  placeholder="cliente@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Dirección</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={nuevoCliente.direccion}
                  onChangeText={(text) => setNuevoCliente(prev => ({ ...prev, direccion: text }))}
                  placeholder="Av. Banzer 2do anillo, Santa Cruz"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            {/* Botones del modal */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setMostrarFormulario(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.crearBtn} 
                onPress={handleCrearNuevoCliente}
              >
                <MaterialCommunityIcons name="account-plus" size={20} color="#FFFFFF" />
                <Text style={styles.crearBtnText}>Crear Cliente</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
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
  headerSpacer: {
    width: 24,
  },
  backBtn: {
    padding: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
  },
  progressStep: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressCircleActive: {
    backgroundColor: '#3B82F6',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressTextActive: {
    color: '#FFFFFF',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  progressLine: {
    width: 60,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 0,
  },
  searchIcon: {
    marginRight: 8,
    color: '#8E8E93',
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#000000',
    fontWeight: '400',
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  dropdownPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  crearNuevoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 8,
  },
  crearNuevoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  crearBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#059669',
    gap: 8,
  },
  crearBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Nuevos estilos mejorados
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  loadingIcon: {
    marginRight: 8,
  },
  clearButton: {
    padding: 4,
  },
  searchResults: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  clienteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E7',
  },
  clienteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  clienteDetalles: {
    flex: 1,
  },
  clienteNombreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clienteNombre: {
    fontSize: 17,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  clienteTelefono: {
    fontSize: 15,
    color: '#007AFF',
    marginBottom: 1,
    fontWeight: '400',
  },
  clienteEmail: {
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 1,
    fontWeight: '400',
  },
  clienteDireccion: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '400',
  },
  clienteEstadisticas: {
    flexDirection: 'row',
    gap: 12,
  },
  estadistica: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  noResultados: {
    alignItems: 'center',
    padding: 32,
  },
  noResultadosTexto: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  filtrosContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filtroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#059669',
    backgroundColor: '#FFFFFF',
  },
  filtroActivo: {
    backgroundColor: '#059669',
  },
  filtroTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  filtroTextoActivo: {
    color: '#FFFFFF',
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  sinClientes: {
    alignItems: 'center',
    padding: 32,
  },
  sinClientesTexto: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },

  // Estilos para el modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCloseBtn: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  formColumn: {
    flex: 1,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  phonePrefix: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    borderRightWidth: 1,
    borderRightColor: '#D1D5DB',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  // Estilos para el estado vacío
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDesc: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  crearNuevoMainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  crearNuevoMainText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
