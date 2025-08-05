import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
}

interface Props {
  onClienteSeleccionado: (cliente: Cliente) => void;
  clienteActual: Cliente | null;
}

// Datos mock de clientes
const clientesMock: Cliente[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    telefono: '+1234567890',
    direccion: 'Calle 123, Ciudad'
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'González',
    telefono: '+0987654321',
    direccion: 'Avenida 456, Ciudad'
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellido: 'López',
    telefono: '+1122334455',
    direccion: 'Plaza 789, Ciudad'
  }
];

export const ClienteSeleccion: React.FC<Props> = ({ onClienteSeleccionado, clienteActual }) => {
  const [busqueda, setBusqueda] = useState('');
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: ''
  });

  useEffect(() => {
    if (busqueda.length > 0) {
      const filtrados = clientesMock.filter(cliente =>
        cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
        cliente.telefono.includes(busqueda)
      );
      setClientesFiltrados(filtrados);
      setMostrarDropdown(true);
    } else {
      setClientesFiltrados([]);
      setMostrarDropdown(false);
    }
  }, [busqueda]);

  const handleSeleccionarCliente = (cliente: Cliente) => {
    setBusqueda(`${cliente.nombre} ${cliente.apellido}`);
    setMostrarDropdown(false);
    onClienteSeleccionado(cliente);
  };

  const handleCrearNuevoCliente = () => {
    const cliente: Cliente = {
      id: Date.now().toString(),
      ...nuevoCliente
    };
    
    // Aquí se haría la llamada a la API para crear el cliente
    console.log('Crear nuevo cliente:', cliente);
    
    setBusqueda(`${cliente.nombre} ${cliente.apellido}`);
    setMostrarFormulario(false);
    setNuevoCliente({ nombre: '', apellido: '', telefono: '', direccion: '' });
    onClienteSeleccionado(cliente);
  };

  const mostrarCrearNuevo = busqueda.length > 0 && clientesFiltrados.length === 0;

  if (clienteActual) {
    return (
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cliente Seleccionado</Text>
          
          <View style={styles.clienteCard}>
            <View style={styles.clienteInfo}>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="account" size={20} color="#3B82F6" />
                <Text style={styles.infoText}>{clienteActual.nombre} {clienteActual.apellido}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="phone" size={20} color="#10B981" />
                <Text style={styles.infoText}>{clienteActual.telefono}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="map-marker" size={20} color="#F59E0B" />
                <Text style={styles.infoText}>{clienteActual.direccion}</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => onClienteSeleccionado(null as any)}
            >
              <MaterialCommunityIcons name="pencil" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧩 Etapa 1: Selección o creación de cliente</Text>
        <Text style={styles.sectionDesc}>Busca un cliente existente o crea uno nuevo</Text>
        
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, apellido o teléfono..."
            value={busqueda}
            onChangeText={setBusqueda}
            autoFocus
          />
          {busqueda.length > 0 && (
            <TouchableOpacity onPress={() => setBusqueda('')}>
              <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        {/* Dropdown de resultados */}
        {mostrarDropdown && (
          <View style={styles.dropdown}>
            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
              {clientesFiltrados.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.dropdownItem}
                  onPress={() => handleSeleccionarCliente(item)}
                >
                  <View>
                    <Text style={styles.dropdownName}>{item.nombre} {item.apellido}</Text>
                    <Text style={styles.dropdownPhone}>{item.telefono}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={20} color="#6B7280" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Opción crear nuevo cliente */}
        {mostrarCrearNuevo && (
          <TouchableOpacity
            style={styles.crearNuevoBtn}
            onPress={() => setMostrarFormulario(true)}
          >
            <MaterialCommunityIcons name="plus-circle" size={24} color="#059669" />
            <Text style={styles.crearNuevoText}>Crear nuevo cliente</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Formulario nuevo cliente */}
      {mostrarFormulario && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuevo Cliente</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={nuevoCliente.nombre}
              onChangeText={(text) => setNuevoCliente(prev => ({ ...prev, nombre: text }))}
              placeholder="Ingresa el nombre"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Apellido *</Text>
            <TextInput
              style={styles.input}
              value={nuevoCliente.apellido}
              onChangeText={(text) => setNuevoCliente(prev => ({ ...prev, apellido: text }))}
              placeholder="Ingresa el apellido"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Teléfono *</Text>
            <TextInput
              style={styles.input}
              value={nuevoCliente.telefono}
              onChangeText={(text) => setNuevoCliente(prev => ({ ...prev, telefono: text }))}
              placeholder="Ingresa el teléfono"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={styles.input}
              value={nuevoCliente.direccion}
              onChangeText={(text) => setNuevoCliente(prev => ({ ...prev, direccion: text }))}
              placeholder="Ingresa la dirección"
              multiline
            />
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setMostrarFormulario(false)}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.crearBtn,
                (!nuevoCliente.nombre || !nuevoCliente.apellido || !nuevoCliente.telefono) &&
                styles.crearBtnDisabled
              ]}
              onPress={handleCrearNuevoCliente}
              disabled={!nuevoCliente.nombre || !nuevoCliente.apellido || !nuevoCliente.telefono}
            >
              <Text style={styles.crearBtnText}>Crear Cliente</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  clienteCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clienteInfo: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  editBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
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
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#059669',
    alignItems: 'center',
  },
  crearBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  crearBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
