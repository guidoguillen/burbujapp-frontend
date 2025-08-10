import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import BusquedaAvanzadaService, { 
  FiltrosBusqueda, 
  ResultadoBusqueda 
} from '../../services/BusquedaAvanzadaService';

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  fecha_registro: string;
}

export const BusquedaClientesAPIComponent: React.FC = () => {
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [resultados, setResultados] = useState<ResultadoBusqueda<Cliente> | null>(null);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState<Partial<FiltrosBusqueda>>({
    texto: '',
    ordenarPor: 'fecha',
    direccionOrden: 'desc',
  });

  // Función para realizar la búsqueda usando la API
  const buscarClientes = async () => {
    if (!textoBusqueda.trim()) {
      Alert.alert('Error', 'Por favor ingresa un término de búsqueda');
      return;
    }

    setLoading(true);
    try {
      const filtrosCompletos = {
        ...filtros,
        texto: textoBusqueda,
        ordenarPor: filtros.ordenarPor || 'fecha',
        direccionOrden: filtros.direccionOrden || 'desc',
      } as Partial<FiltrosBusqueda>;

      const resultado = await BusquedaAvanzadaService.buscarClientesAPI(filtrosCompletos);
      setResultados(resultado);
      
      if (resultado.total === 0) {
        Alert.alert('Sin resultados', 'No se encontraron clientes con esos criterios');
      }
    } catch (error) {
      console.error('Error buscando clientes:', error);
      Alert.alert('Error', 'Hubo un problema al buscar clientes');
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar todos los clientes al inicio
  const cargarTodosLosClientes = async () => {
    setLoading(true);
    try {
      const filtrosVacios = {
        texto: '',
        ordenarPor: 'fecha',
        direccionOrden: 'desc',
      } as Partial<FiltrosBusqueda>;

      const resultado = await BusquedaAvanzadaService.buscarClientesAPI(filtrosVacios);
      setResultados(resultado);
    } catch (error) {
      console.error('Error cargando clientes:', error);
      Alert.alert('Error', 'No se pudieron cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  // Cargar clientes al montar el componente
  useEffect(() => {
    cargarTodosLosClientes();
  }, []);

  // Renderizar item de cliente
  const renderCliente = ({ item }: { item: Cliente }) => (
    <View style={styles.clienteItem}>
      <Text style={styles.clienteNombre}>{item.nombre}</Text>
      <Text style={styles.clienteTelefono}>📞 {item.telefono}</Text>
      <Text style={styles.clienteEmail}>📧 {item.email}</Text>
      <Text style={styles.clienteDireccion}>📍 {item.direccion}</Text>
      <Text style={styles.clienteFecha}>
        📅 Registrado: {new Date(item.fecha_registro).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🔍 Búsqueda de Clientes (Mock API)</Text>
      
      {/* Barra de búsqueda */}
      <View style={styles.busquedaContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nombre, teléfono, email..."
          value={textoBusqueda}
          onChangeText={setTextoBusqueda}
          onSubmitEditing={buscarClientes}
        />
        <TouchableOpacity 
          style={styles.botonBuscar} 
          onPress={buscarClientes}
          disabled={loading}
        >
          <Text style={styles.textoBoton}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Botón para mostrar todos */}
      <TouchableOpacity 
        style={styles.botonTodos} 
        onPress={cargarTodosLosClientes}
        disabled={loading}
      >
        <Text style={styles.textoBotonTodos}>Mostrar Todos</Text>
      </TouchableOpacity>

      {/* Indicador de carga */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Buscando clientes...</Text>
        </View>
      )}

      {/* Información de resultados */}
      {resultados && !loading && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTexto}>
            📊 {resultados.total} cliente(s) encontrado(s)
          </Text>
          {resultados.coincidenciasTexto > 0 && (
            <Text style={styles.infoTexto}>
              ✨ {resultados.coincidenciasTexto} coincidencia(s) de texto
            </Text>
          )}
          <Text style={styles.infoTexto}>
            🔧 {resultados.filtrosAplicados} filtro(s) aplicado(s)
          </Text>
        </View>
      )}

      {/* Lista de resultados */}
      {resultados && !loading && (
        <FlatList
          data={resultados.items}
          renderItem={renderCliente}
          keyExtractor={(item) => item.id.toString()}
          style={styles.lista}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {textoBusqueda ? 'No se encontraron clientes' : 'No hay clientes disponibles'}
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  busquedaContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  botonBuscar: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
  },
  botonTodos: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  textoBotonTodos: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  infoTexto: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  lista: {
    flex: 1,
  },
  clienteItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clienteNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  clienteTelefono: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  clienteEmail: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 2,
  },
  clienteDireccion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  clienteFecha: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 32,
  },
});

export default BusquedaClientesAPIComponent;
