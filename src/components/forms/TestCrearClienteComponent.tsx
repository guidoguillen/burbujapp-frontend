import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BusquedaAvanzadaService from '../../services/BusquedaAvanzadaService';

export const TestCrearClienteComponent: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    email: ''
  });
  const [cargando, setCargando] = useState(false);
  const [clienteCreado, setClienteCreado] = useState<any>(null);

  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      apellido: '',
      telefono: '',
      direccion: '',
      email: ''
    });
    setClienteCreado(null);
  };

  const llenarDatosPrueba = () => {
    setFormData({
      nombre: 'Pedro',
      apellido: 'Morales',
      telefono: '+591 76123456',
      direccion: 'Av. Santos Dumont, zona centro',
      email: 'pedro.morales@email.com'
    });
  };

  const validarFormulario = () => {
    const errores = [];
    
    if (!formData.nombre.trim()) errores.push('El nombre es obligatorio');
    if (!formData.apellido.trim()) errores.push('El apellido es obligatorio');
    if (!formData.telefono.trim()) errores.push('El teléfono es obligatorio');
    if (!formData.direccion.trim()) errores.push('La dirección es obligatoria');
    
    // Validar formato de teléfono boliviano
    const telefonoRegex = /^\+591\s[67]\d{7}$/;
    if (formData.telefono && !telefonoRegex.test(formData.telefono)) {
      errores.push('El teléfono debe tener el formato: +591 7XXXXXXX');
    }
    
    // Validar email si se proporciona
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errores.push('El email no tiene un formato válido');
      }
    }
    
    return errores;
  };

  const handleCrearCliente = async () => {
    const errores = validarFormulario();
    
    if (errores.length > 0) {
      Alert.alert('Errores en el formulario', errores.join('\n'));
      return;
    }

    try {
      setCargando(true);
      
      const resultado = await BusquedaAvanzadaService.crearClienteAPI(formData);

      if (resultado.success && resultado.cliente) {
        setClienteCreado(resultado.cliente);
        Alert.alert('Éxito', `Cliente "${resultado.cliente.nombre} ${resultado.cliente.apellido}" creado exitosamente`);
        console.log('✅ Cliente creado:', resultado.cliente);
      } else {
        Alert.alert('Error', resultado.error || 'No se pudo crear el cliente');
        console.error('❌ Error:', resultado.error);
      }
    } catch (error) {
      console.error('❌ Error creando cliente:', error);
      Alert.alert('Error', 'Ocurrió un error al crear el cliente. Verifica que JSON Server esté corriendo.');
    } finally {
      setCargando(false);
    }
  };

  const handleEliminarCliente = async () => {
    if (!clienteCreado) return;

    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de eliminar a ${clienteCreado.nombre} ${clienteCreado.apellido}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setCargando(true);
              const resultado = await BusquedaAvanzadaService.eliminarClienteAPI(clienteCreado.id);
              
              if (resultado.success) {
                Alert.alert('Éxito', 'Cliente eliminado exitosamente');
                setClienteCreado(null);
              } else {
                Alert.alert('Error', resultado.error || 'No se pudo eliminar el cliente');
              }
            } catch (error) {
              Alert.alert('Error', 'Ocurrió un error al eliminar el cliente');
            } finally {
              setCargando(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="account-plus" size={24} color="#059669" />
        <Text style={styles.titulo}>Test - Crear Cliente API</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Datos del Cliente</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa el nombre"
            value={formData.nombre}
            onChangeText={(text) => setFormData({...formData, nombre: text})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Apellido *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa el apellido"
            value={formData.apellido}
            onChangeText={(text) => setFormData({...formData, apellido: text})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Teléfono * (+591 7XXXXXXX)</Text>
          <TextInput
            style={styles.input}
            placeholder="+591 76123456"
            value={formData.telefono}
            onChangeText={(text) => setFormData({...formData, telefono: text})}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dirección *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa la dirección"
            value={formData.direccion}
            onChangeText={(text) => setFormData({...formData, direccion: text})}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.testButton} onPress={llenarDatosPrueba}>
            <MaterialCommunityIcons name="auto-fix" size={16} color="#6B7280" />
            <Text style={styles.testButtonText}>Llenar datos de prueba</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton} onPress={limpiarFormulario}>
            <MaterialCommunityIcons name="eraser" size={16} color="#6B7280" />
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.createButton, cargando && styles.createButtonDisabled]} 
          onPress={handleCrearCliente}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <MaterialCommunityIcons name="account-plus" size={20} color="#FFFFFF" />
          )}
          <Text style={styles.createButtonText}>
            {cargando ? 'Creando...' : 'Crear Cliente'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Resultado */}
      {clienteCreado && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>✅ Cliente Creado</Text>
          <View style={styles.clienteCard}>
            <Text style={styles.clienteNombre}>
              {clienteCreado.nombre} {clienteCreado.apellido}
            </Text>
            <Text style={styles.clienteDetalle}>ID: {clienteCreado.id}</Text>
            <Text style={styles.clienteDetalle}>📞 {clienteCreado.telefono}</Text>
            <Text style={styles.clienteDetalle}>📍 {clienteCreado.direccion}</Text>
            {clienteCreado.email && (
              <Text style={styles.clienteDetalle}>📧 {clienteCreado.email}</Text>
            )}
            <Text style={styles.clienteDetalle}>
              📅 Creado: {new Date(clienteCreado.fechaCreacion).toLocaleString()}
            </Text>
            
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={handleEliminarCliente}
              disabled={cargando}
            >
              <MaterialCommunityIcons name="trash-can" size={16} color="#FFFFFF" />
              <Text style={styles.deleteButtonText}>Eliminar Cliente de Prueba</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>ℹ️ Información</Text>
        <Text style={styles.infoText}>
          • Este componente prueba la creación de clientes usando la Mock API
        </Text>
        <Text style={styles.infoText}>
          • Los datos se guardan en JSON Server (puerto 3001)
        </Text>
        <Text style={styles.infoText}>
          • Puedes eliminar el cliente creado para limpiar la base de datos
        </Text>
        <Text style={styles.infoText}>
          • Revisa la consola para ver los logs detallados
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    gap: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  testButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
    gap: 4,
  },
  testButtonText: {
    fontSize: 12,
    color: '#6B7280',
  },
  clearButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
    gap: 4,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#6B7280',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#059669',
    gap: 8,
  },
  createButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resultContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 12,
  },
  clienteCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  clienteNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  clienteDetalle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    marginTop: 12,
    gap: 4,
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#1E40AF',
    marginBottom: 4,
  },
});

export default TestCrearClienteComponent;
