import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ClienteSeleccion } from './components/ClienteSeleccion';
import { ArticulosCarrito } from './components/ArticulosCarrito';

type NavigationProp = StackNavigationProp<RootStackParamList, 'NuevaOrden'>;

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
}

interface Articulo {
  id: string;
  nombre: string;
  tipoServicio: 'lavado' | 'planchado' | 'otros';
  unidadCobro: 'kilo' | 'unidad';
  cantidad: number;
  precio?: number;
}

export const NuevaOrdenScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [etapaActual, setEtapaActual] = useState<1 | 2>(1);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [articulosCarrito, setArticulosCarrito] = useState<Articulo[]>([]);

  const handleClienteSeleccionado = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setEtapaActual(2);
  };

  const handleAgregarArticulo = (articulo: Articulo) => {
    setArticulosCarrito(prev => [...prev, { ...articulo, id: Date.now().toString() }]);
  };

  const handleEditarArticulo = (id: string, articuloActualizado: Articulo) => {
    setArticulosCarrito(prev => 
      prev.map(item => item.id === id ? { ...articuloActualizado, id } : item)
    );
  };

  const handleEliminarArticulo = (id: string) => {
    setArticulosCarrito(prev => prev.filter(item => item.id !== id));
  };

  const calcularTotal = () => {
    return articulosCarrito.reduce((total, item) => total + (item.precio || 0) * item.cantidad, 0);
  };

  const handleFinalizarOrden = () => {
    if (!clienteSeleccionado) {
      Alert.alert('Error', 'Debes seleccionar un cliente');
      return;
    }
    
    if (articulosCarrito.length === 0) {
      Alert.alert('Error', 'Debes agregar al menos un artículo');
      return;
    }
    
    const total = calcularTotal();
    const nuevaOrden = {
      id: Date.now().toString(),
      cliente: clienteSeleccionado,
      articulos: articulosCarrito,
      total: total,
      fechaCreacion: new Date().toISOString(),
      estado: 'Registrado'
    };
    
    Alert.alert(
      '✅ Orden creada exitosamente',
      `Cliente: ${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}\nArtículos: ${articulosCarrito.length}\nTotal: $${total.toFixed(2)}`,
      [
        {
          text: 'Ver órdenes',
          onPress: () => {
            navigation.navigate('MisOrdenes');
          }
        },
        {
          text: 'Crear nueva',
          onPress: () => {
            // Limpiar formulario
            setClienteSeleccionado(null);
            setArticulosCarrito([]);
            setEtapaActual(1);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Orden</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Indicador de progreso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={[styles.progressCircle, etapaActual >= 1 && styles.progressCircleActive]}>
            <Text style={[styles.progressText, etapaActual >= 1 && styles.progressTextActive]}>1</Text>
          </View>
          <Text style={styles.progressLabel}>Cliente</Text>
        </View>
        
        <View style={[styles.progressLine, etapaActual >= 2 && styles.progressLineActive]} />
        
        <View style={styles.progressStep}>
          <View style={[styles.progressCircle, etapaActual >= 2 && styles.progressCircleActive]}>
            <Text style={[styles.progressText, etapaActual >= 2 && styles.progressTextActive]}>2</Text>
          </View>
          <Text style={styles.progressLabel}>Artículos</Text>
        </View>
      </View>

      <View style={styles.content}>
        {etapaActual === 1 && (
          <ClienteSeleccion
            onClienteSeleccionado={handleClienteSeleccionado}
            clienteActual={clienteSeleccionado}
          />
        )}

        {etapaActual === 2 && clienteSeleccionado && (
          <ArticulosCarrito
            cliente={clienteSeleccionado}
            articulos={articulosCarrito}
            onAgregarArticulo={handleAgregarArticulo}
            onEditarArticulo={handleEditarArticulo}
            onEliminarArticulo={handleEliminarArticulo}
            onVolverEtapa1={() => setEtapaActual(1)}
          />
        )}
      </View>

      {/* Footer con acciones */}
      {etapaActual === 2 && articulosCarrito.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>${calcularTotal().toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.finalizarBtn} onPress={handleFinalizarOrden}>
            <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
            <Text style={styles.finalizarBtnText}>Finalizar Orden</Text>
          </TouchableOpacity>
        </View>
      )}
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
    marginBottom: 16,
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
    color: '#9CA3AF',
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
  progressLineActive: {
    backgroundColor: '#3B82F6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#059669',
  },
  finalizarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  finalizarBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
