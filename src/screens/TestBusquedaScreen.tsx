import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import BusquedaClientesAPIComponent from '../components/forms/BusquedaClientesAPIComponent';
import TestCrearClienteComponent from '../components/forms/TestCrearClienteComponent';
import BusquedaAvanzadaService from '../services/BusquedaAvanzadaService';

export const TestBusquedaScreen: React.FC = () => {
  
  // Función para probar la búsqueda global
  const probarBusquedaGlobal = async () => {
    try {
      const resultado = await BusquedaAvanzadaService.busquedaGlobalAPI('María');
      
      Alert.alert(
        'Resultado Búsqueda Global',
        `Clientes: ${resultado.clientes.total}\n` +
        `Órdenes: ${resultado.ordenes.total}\n` +
        `Total: ${resultado.totalResultados}`
      );
      
      console.log('Resultado búsqueda global:', resultado);
    } catch (error) {
      Alert.alert('Error', 'No se pudo realizar la búsqueda global');
      console.error('Error en búsqueda global:', error);
    }
  };

  // Función para probar la búsqueda de órdenes
  const probarBusquedaOrdenes = async () => {
    try {
      const resultado = await BusquedaAvanzadaService.buscarOrdenesAPI({
        texto: '',
        ordenarPor: 'fecha',
        direccionOrden: 'desc',
      });
      
      Alert.alert(
        'Órdenes Encontradas',
        `Total: ${resultado.total} órdenes\n` +
        `Filtros aplicados: ${resultado.filtrosAplicados}`
      );
      
      console.log('Resultado búsqueda órdenes:', resultado);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las órdenes');
      console.error('Error en búsqueda órdenes:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>🧪 Test Búsqueda con Mock API</Text>
        <Text style={styles.subtitulo}>
          Prueba el servicio de búsqueda conectado al JSON Server
        </Text>
      </View>

      {/* Botones de prueba */}
      <View style={styles.botonesContainer}>
        <TouchableOpacity style={styles.botonPrueba} onPress={probarBusquedaGlobal}>
          <Text style={styles.textoBoton}>🌍 Prueba Búsqueda Global</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.botonPrueba} onPress={probarBusquedaOrdenes}>
          <Text style={styles.textoBoton}>📋 Prueba Búsqueda Órdenes</Text>
        </TouchableOpacity>
      </View>

      {/* Información de la API */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitulo}>🔧 Información de la Mock API</Text>
        <Text style={styles.infoTexto}>
          • JSON Server corriendo en puerto 3001
        </Text>
        <Text style={styles.infoTexto}>
          • Endpoints disponibles: /clientes, /ordenes, /servicios
        </Text>
        <Text style={styles.infoTexto}>
          • Búsqueda con filtros avanzados
        </Text>
        <Text style={styles.infoTexto}>
          • Datos de prueba bolivianos
        </Text>
      </View>

      {/* Componente de búsqueda de clientes */}
      <View style={styles.componenteContainer}>
        <Text style={styles.componenteTitulo}>🔍 Búsqueda de Clientes</Text>
        <BusquedaClientesAPIComponent />
      </View>

      {/* Componente de crear cliente */}
      <View style={styles.componenteContainer}>
        <Text style={styles.componenteTitulo}>➕ Crear Cliente</Text>
        <TestCrearClienteComponent />
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
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  botonesContainer: {
    padding: 16,
    gap: 12,
  },
  botonPrueba: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  infoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoTexto: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  componenteContainer: {
    flex: 1,
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  componenteTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default TestBusquedaScreen;
