import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NotificationService } from '../../services/NotificationService';

type NavigationProp = StackNavigationProp<RootStackParamList, 'DetalleOrden'>;
type RoutePropType = RouteProp<RootStackParamList, 'DetalleOrden'>;

interface Cliente {
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
}

interface Articulo {
  nombre: string;
  tipoServicio: string;
  unidadCobro: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

interface EstadoHistorial {
  estado: string;
  fecha: string;
  usuario: string;
}

interface OrdenDetalle {
  id: string;
  cliente: Cliente;
  fechaCreacion: string;
  fechaEntrega?: string;
  articulos: Articulo[];
  total: number;
  estado: 'Registrado' | 'En proceso' | 'Terminado';
  observaciones?: string;
  historialEstados: EstadoHistorial[];
}

export const DetalleOrdenScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { ordenId } = route.params;

  const [editandoObservaciones, setEditandoObservaciones] = useState(false);
  const [nuevasObservaciones, setNuevasObservaciones] = useState('');

  // Datos mock de la orden específica
  const [orden] = useState<OrdenDetalle>({
    id: ordenId,
    cliente: {
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '77712345',
      direccion: 'Av. América #123, Zona Central'
    },
    fechaCreacion: '2025-08-04T10:30:00',
    fechaEntrega: '2025-08-06T16:00:00',
    articulos: [
      {
        nombre: 'Camisa manga larga',
        tipoServicio: 'lavado',
        unidadCobro: 'unidad',
        cantidad: 2,
        precio: 8,
        subtotal: 16
      },
      {
        nombre: 'Pantalón jean',
        tipoServicio: 'lavado',
        unidadCobro: 'unidad',
        cantidad: 1,
        precio: 12,
        subtotal: 12
      },
      {
        nombre: 'Vestido formal',
        tipoServicio: 'planchado',
        unidadCobro: 'unidad',
        cantidad: 1,
        precio: 15,
        subtotal: 15
      },
      {
        nombre: 'Edredón matrimonial',
        tipoServicio: 'lavado',
        unidadCobro: 'unidad',
        cantidad: 1,
        precio: 25,
        subtotal: 25
      },
      {
        nombre: 'Camisetas varias',
        tipoServicio: 'lavado',
        unidadCobro: 'kilo',
        cantidad: 2,
        precio: 8.5,
        subtotal: 17
      }
    ],
    total: 85,
    estado: 'Registrado',
    observaciones: 'Cliente solicita entrega urgente para el viernes',
    historialEstados: [
      {
        estado: 'Registrado',
        fecha: '2025-08-04T10:30:00',
        usuario: 'Operador Juan'
      }
    ]
  });

  const formatearFecha = (fechaISO: string): string => {
    const fecha = new Date(fechaISO);
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
    const hora = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    return `${dia} de ${mes}, ${año} - ${hora}`;
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Registrado':
        return { backgroundColor: '#FEF3C7', color: '#92400E', icon: 'clipboard-plus' as const };
      case 'En proceso':
        return { backgroundColor: '#DBEAFE', color: '#1E40AF', icon: 'clock-time-four' as const };
      case 'Terminado':
        return { backgroundColor: '#D1FAE5', color: '#065F46', icon: 'check-circle' as const };
      default:
        return { backgroundColor: '#F3F4F6', color: '#374151', icon: 'clipboard-text' as const };
    }
  };

  const puedeAvanzarEstado = () => {
    return orden.estado === 'Registrado' || orden.estado === 'En proceso';
  };

  const getSiguienteEstado = () => {
    switch (orden.estado) {
      case 'Registrado':
        return 'En proceso';
      case 'En proceso':
        return 'Terminado';
      default:
        return orden.estado;
    }
  };

  const handleCambiarEstado = () => {
    const siguienteEstado = getSiguienteEstado();
    
    Alert.alert(
      'Cambiar Estado',
      `¿Cambiar el estado de la orden a "${siguienteEstado}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            // Aquí se haría la llamada a la API
            Alert.alert('✅ Estado actualizado', `La orden ahora está "${siguienteEstado}"`);
          }
        }
      ]
    );
  };

  const estadoStyle = getEstadoColor(orden.estado);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orden #{orden.id}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        {/* Estado actual */}
        <View style={styles.section}>
          <View style={styles.estadoContainer}>
            <View style={[styles.estadoBadge, { backgroundColor: estadoStyle.backgroundColor }]}>
              <MaterialCommunityIcons 
                name={estadoStyle.icon} 
                size={20} 
                color={estadoStyle.color} 
              />
              <Text style={[styles.estadoText, { color: estadoStyle.color }]}>
                {orden.estado}
              </Text>
            </View>
            
            {puedeAvanzarEstado() && (
              <TouchableOpacity style={styles.cambiarEstadoBtn} onPress={handleCambiarEstado}>
                <MaterialCommunityIcons name="arrow-right-circle" size={16} color="#FFFFFF" />
                <Text style={styles.cambiarEstadoBtnText}>
                  Cambiar a {getSiguienteEstado()}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Información del cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Cliente</Text>
          <View style={styles.clienteContainer}>
            <Text style={styles.clienteNombre}>
              {orden.cliente.nombre} {orden.cliente.apellido}
            </Text>
            <Text style={styles.clienteInfo}>📞 {orden.cliente.telefono}</Text>
            <Text style={styles.clienteInfo}>📍 {orden.cliente.direccion}</Text>
          </View>
        </View>

        {/* Fechas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Fechas</Text>
          <View style={styles.fechasContainer}>
            <View style={styles.fechaItem}>
              <Text style={styles.fechaLabel}>Creación:</Text>
              <Text style={styles.fechaValue}>{formatearFecha(orden.fechaCreacion)}</Text>
            </View>
            {orden.fechaEntrega && (
              <View style={styles.fechaItem}>
                <Text style={styles.fechaLabel}>Entrega estimada:</Text>
                <Text style={styles.fechaValue}>{formatearFecha(orden.fechaEntrega)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Lista de artículos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Artículos ({orden.articulos.length})</Text>
          {orden.articulos.map((articulo, index) => (
            <View key={index} style={styles.articuloItem}>
              <View style={styles.articuloHeader}>
                <Text style={styles.articuloNombre}>{articulo.nombre}</Text>
                <Text style={styles.articuloSubtotal}>{articulo.subtotal} Bs</Text>
              </View>
              <View style={styles.articuloDetalles}>
                <Text style={styles.articuloDetalle}>
                  🏷️ {articulo.tipoServicio} • {articulo.cantidad} {articulo.unidadCobro}(s)
                </Text>
                <Text style={styles.articuloDetalle}>
                  💰 {articulo.precio} Bs c/u
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.section}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total de la orden:</Text>
            <Text style={styles.totalValue}>{orden.total} Bs</Text>
          </View>
        </View>

        {/* Observaciones */}
        {orden.observaciones && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Observaciones</Text>
            <Text style={styles.observacionesText}>{orden.observaciones}</Text>
          </View>
        )}

        {/* Historial de estados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Historial de Estados</Text>
          {orden.historialEstados.map((historial, index) => (
            <View key={index} style={styles.historialItem}>
              <View style={styles.historialBadge}>
                <MaterialCommunityIcons 
                  name={getEstadoColor(historial.estado).icon} 
                  size={14} 
                  color={getEstadoColor(historial.estado).color} 
                />
              </View>
              <View style={styles.historialInfo}>
                <Text style={styles.historialEstado}>{historial.estado}</Text>
                <Text style={styles.historialFecha}>
                  {formatearFecha(historial.fecha)} por {historial.usuario}
                </Text>
              </View>
            </View>
          ))}
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 8,
  },
  estadoText: {
    fontSize: 16,
    fontWeight: '700',
  },
  cambiarEstadoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  cambiarEstadoBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  clienteContainer: {
    gap: 8,
  },
  clienteNombre: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  clienteInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  fechasContainer: {
    gap: 8,
  },
  fechaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fechaLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  fechaValue: {
    fontSize: 14,
    color: '#111827',
  },
  articuloItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  articuloHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  articuloNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  articuloSubtotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  articuloDetalles: {
    gap: 2,
  },
  articuloDetalle: {
    fontSize: 14,
    color: '#6B7280',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#059669',
  },
  observacionesText: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  historialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  historialBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historialInfo: {
    flex: 1,
  },
  historialEstado: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  historialFecha: {
    fontSize: 12,
    color: '#6B7280',
  },
});
