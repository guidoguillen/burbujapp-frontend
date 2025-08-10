import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BusquedaAvanzadaService from '../../services/BusquedaAvanzadaService';

export const TestCrearOrdenComponent: React.FC = () => {
  const [cargando, setCargando] = useState(false);
  const [ultimaOrdenCreada, setUltimaOrdenCreada] = useState<any>(null);
  
  // Datos de prueba para crear orden
  const [datosOrden, setDatosOrden] = useState({
    clienteId: 'cliente-001', // ID de Gabriela en db.json
    metodoPago: 'efectivo',
    urgente: false,
    observaciones: 'Orden de prueba creada desde la app móvil'
  });

  const crearOrdenDePrueba = async () => {
    try {
      setCargando(true);
      
      // Datos simulados de la orden
      const ordenCompleta = {
        clienteId: datosOrden.clienteId,
        cliente: {
          id: 'cliente-001',
          nombre: 'Gabriela',
          apellido: 'Molina',
          telefono: '+591 79954303',
          email: 'gabriel.molina@email.com',
          direccion: 'Av. Banzer 3er anillo, zona norte'
        },
        articulos: [
          {
            id: 'articulo-test-001',
            servicioId: 'servicio-001',
            servicio: {
              nombre: 'Lavado Ropa Casual',
              unidad: 'kilo'
            },
            cantidad: 2,
            precioUnitario: 8.5,
            subtotal: 17,
            instrucciones: 'Camisas blancas y pantalones'
          },
          {
            id: 'articulo-test-002',
            servicioId: 'servicio-004',
            servicio: {
              nombre: 'Planchado Básico',
              unidad: 'unidad'
            },
            cantidad: 3,
            precioUnitario: 3.5,
            subtotal: 10.5,
            instrucciones: 'Planchado con almidón'
          }
        ],
        subtotal: 27.5,
        descuento: 2.5,
        recargo: 0,
        total: 25,
        metodoPago: datosOrden.metodoPago,
        urgente: datosOrden.urgente,
        observaciones: datosOrden.observaciones,
        fechaEstimada: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 horas
      };

      console.log('🚀 Creando orden de prueba:', ordenCompleta);

      const resultado = await BusquedaAvanzadaService.crearOrdenAPI(ordenCompleta);

      if (resultado.success && resultado.orden) {
        setUltimaOrdenCreada(resultado.orden);
        Alert.alert(
          '✅ Orden Creada',
          `Orden ${resultado.orden.numeroOrden} creada exitosamente en JSON Server`,
          [{ text: '¡Perfecto!' }]
        );
      } else {
        Alert.alert('❌ Error', resultado.error || 'No se pudo crear la orden');
      }

    } catch (error) {
      console.error('❌ Error en prueba:', error);
      Alert.alert('❌ Error', 'Error de conexión con JSON Server');
    } finally {
      setCargando(false);
    }
  };

  const eliminarUltimaOrden = async () => {
    if (!ultimaOrdenCreada) {
      Alert.alert('❌ Error', 'No hay orden para eliminar');
      return;
    }

    try {
      setCargando(true);
      
      const resultado = await BusquedaAvanzadaService.eliminarOrdenAPI(ultimaOrdenCreada.id);

      if (resultado.success) {
        Alert.alert(
          '✅ Orden Eliminada',
          `Orden ${ultimaOrdenCreada.numeroOrden} eliminada de JSON Server`,
          [{ text: 'OK' }]
        );
        setUltimaOrdenCreada(null);
      } else {
        Alert.alert('❌ Error', resultado.error || 'No se pudo eliminar la orden');
      }

    } catch (error) {
      console.error('❌ Error eliminando:', error);
      Alert.alert('❌ Error', 'Error de conexión con JSON Server');
    } finally {
      setCargando(false);
    }
  };

  const buscarOrdenes = async () => {
    try {
      setCargando(true);
      
      const resultado = await BusquedaAvanzadaService.buscarOrdenesAPI({
        texto: 'Gabriela',
        ordenarPor: 'fecha',
        direccionOrden: 'desc'
      });

      Alert.alert(
        '🔍 Búsqueda de Órdenes',
        `Se encontraron ${resultado.total} órdenes\n` +
        `Filtros aplicados: ${resultado.filtrosAplicados}\n` +
        `Coincidencias de texto: ${resultado.coincidenciasTexto}`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('❌ Error buscando:', error);
      Alert.alert('❌ Error', 'Error de conexión con JSON Server');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="clipboard-plus" size={32} color="#059669" />
        <Text style={styles.title}>🧪 Test API de Órdenes</Text>
        <Text style={styles.subtitle}>Prueba la integración con JSON Server</Text>
      </View>

      {/* Configuración de orden */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Configuración de Orden</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Cliente ID:</Text>
          <TextInput
            style={styles.input}
            value={datosOrden.clienteId}
            onChangeText={(texto) => setDatosOrden(prev => ({ ...prev, clienteId: texto }))}
            placeholder="cliente-001"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Método de Pago:</Text>
          <View style={styles.radioContainer}>
            {['efectivo', 'tarjeta', 'transferencia', 'qr'].map((metodo) => (
              <TouchableOpacity
                key={metodo}
                style={[styles.radioOption, datosOrden.metodoPago === metodo && styles.radioSelected]}
                onPress={() => setDatosOrden(prev => ({ ...prev, metodoPago: metodo }))}
              >
                <Text style={[styles.radioText, datosOrden.metodoPago === metodo && styles.radioTextSelected]}>
                  {metodo.charAt(0).toUpperCase() + metodo.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.checkboxContainer]}
          onPress={() => setDatosOrden(prev => ({ ...prev, urgente: !prev.urgente }))}
        >
          <MaterialCommunityIcons 
            name={datosOrden.urgente ? "checkbox-marked" : "checkbox-blank-outline"} 
            size={24} 
            color={datosOrden.urgente ? "#059669" : "#6B7280"} 
          />
          <Text style={styles.checkboxText}>Orden urgente</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Observaciones:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={datosOrden.observaciones}
            onChangeText={(texto) => setDatosOrden(prev => ({ ...prev, observaciones: texto }))}
            placeholder="Observaciones de la orden..."
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      {/* Acciones de prueba */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Acciones de Prueba</Text>
        
        <TouchableOpacity
          style={[styles.actionBtn, styles.createBtn]}
          onPress={crearOrdenDePrueba}
          disabled={cargando}
        >
          <MaterialCommunityIcons 
            name={cargando ? "loading" : "plus-circle"} 
            size={20} 
            color="#FFFFFF" 
          />
          <Text style={styles.actionBtnText}>
            {cargando ? 'Creando...' : 'Crear Orden de Prueba'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.searchBtn]}
          onPress={buscarOrdenes}
          disabled={cargando}
        >
          <MaterialCommunityIcons name="magnify" size={20} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>Buscar Órdenes (Gabriela)</Text>
        </TouchableOpacity>

        {ultimaOrdenCreada && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={eliminarUltimaOrden}
            disabled={cargando}
          >
            <MaterialCommunityIcons name="delete" size={20} color="#FFFFFF" />
            <Text style={styles.actionBtnText}>Eliminar Última Orden</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Información de la última orden */}
      {ultimaOrdenCreada && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Última Orden Creada</Text>
          <View style={styles.orderCard}>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Número:</Text>
              <Text style={styles.orderValue}>{ultimaOrdenCreada.numeroOrden}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Cliente:</Text>
              <Text style={styles.orderValue}>
                {ultimaOrdenCreada.cliente?.nombre} {ultimaOrdenCreada.cliente?.apellido}
              </Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Total:</Text>
              <Text style={styles.orderValue}>Bs {ultimaOrdenCreada.total}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Estado:</Text>
              <Text style={styles.orderValue}>{ultimaOrdenCreada.estado}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={styles.orderLabel}>Artículos:</Text>
              <Text style={styles.orderValue}>{ultimaOrdenCreada.articulos?.length || 0}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Información de estado */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ Estado de JSON Server</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            • Asegúrate de que JSON Server esté corriendo en puerto 3001{'\n'}
            • Comando: npx json-server --watch db.json --port 3001{'\n'}
            • Las órdenes se guardan en db.json automáticamente
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  radioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radioOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  radioSelected: {
    borderColor: '#059669',
    backgroundColor: '#D1FAE5',
  },
  radioText: {
    fontSize: 14,
    color: '#6B7280',
  },
  radioTextSelected: {
    color: '#059669',
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#374151',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  createBtn: {
    backgroundColor: '#059669',
  },
  searchBtn: {
    backgroundColor: '#3B82F6',
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  orderValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
});
