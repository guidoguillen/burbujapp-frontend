import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  ServicioTemplate,
  PLANTILLAS_SERVICIOS,
  CATEGORIAS_SERVICIOS,
  obtenerServiciosPorCategoria,
  obtenerServiciosPopulares,
  buscarServicios,
  calcularPrecioEstimado,
} from '../../services/PlantillasServicios';
import { Input } from '../common/Input';
import Button from '../common/Button';

const { width } = Dimensions.get('window');

interface ServicioSeleccionado extends ServicioTemplate {
  cantidad: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSeleccionar: (servicios: ServicioSeleccionado[]) => void;
}

export const SelectorPlantillasServicios: React.FC<Props> = ({
  visible,
  onClose,
  onSeleccionar,
}) => {
  const [categoriaActiva, setCategoriaActiva] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<ServicioSeleccionado[]>([]);

  const serviciosFiltrados = () => {
    let servicios = PLANTILLAS_SERVICIOS;

    if (busqueda.trim()) {
      servicios = buscarServicios(busqueda);
    } else if (categoriaActiva === 'populares') {
      servicios = obtenerServiciosPopulares();
    } else if (categoriaActiva !== 'todos') {
      servicios = obtenerServiciosPorCategoria(categoriaActiva);
    }

    return servicios;
  };

  const agregarServicio = (servicio: ServicioTemplate) => {
    const existente = serviciosSeleccionados.find(s => s.id === servicio.id);
    
    if (existente) {
      setServiciosSeleccionados(prev =>
        prev.map(s =>
          s.id === servicio.id
            ? { ...s, cantidad: s.cantidad + 1 }
            : s
        )
      );
    } else {
      setServiciosSeleccionados(prev => [
        ...prev,
        { ...servicio, cantidad: 1 }
      ]);
    }
  };

  const removerServicio = (servicioId: string) => {
    setServiciosSeleccionados(prev =>
      prev.filter(s => s.id !== servicioId)
    );
  };

  const actualizarCantidad = (servicioId: string, cantidad: number) => {
    if (cantidad <= 0) {
      removerServicio(servicioId);
      return;
    }

    setServiciosSeleccionados(prev =>
      prev.map(s =>
        s.id === servicioId
          ? { ...s, cantidad }
          : s
      )
    );
  };

  const calcularTotalEstimado = () => {
    return serviciosSeleccionados.reduce((total, servicio) => {
      return total + calcularPrecioEstimado(servicio.id, servicio.cantidad);
    }, 0);
  };

  const handleConfirmar = () => {
    if (serviciosSeleccionados.length === 0) {
      Alert.alert('Error', 'Selecciona al menos un servicio');
      return;
    }

    onSeleccionar(serviciosSeleccionados);
    // Limpiar selección
    setServiciosSeleccionados([]);
    setBusqueda('');
    setCategoriaActiva('todos');
    onClose();
  };

  const renderCategorias = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasContainer}>
      <TouchableOpacity
        style={[
          styles.categoriaItem,
          categoriaActiva === 'todos' && styles.categoriaActiva
        ]}
        onPress={() => setCategoriaActiva('todos')}
      >
        <MaterialCommunityIcons name="view-grid" size={20} color="#666" />
        <Text style={styles.categoriaTexto}>Todos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.categoriaItem,
          categoriaActiva === 'populares' && styles.categoriaActiva
        ]}
        onPress={() => setCategoriaActiva('populares')}
      >
        <MaterialCommunityIcons name="star" size={20} color="#666" />
        <Text style={styles.categoriaTexto}>Populares</Text>
      </TouchableOpacity>

      {CATEGORIAS_SERVICIOS.map(categoria => (
        <TouchableOpacity
          key={categoria.id}
          style={[
            styles.categoriaItem,
            categoriaActiva === categoria.id && styles.categoriaActiva
          ]}
          onPress={() => setCategoriaActiva(categoria.id)}
        >
          <MaterialCommunityIcons 
            name={categoria.icon as any} 
            size={20} 
            color={categoriaActiva === categoria.id ? categoria.color : '#666'} 
          />
          <Text style={styles.categoriaTexto}>{categoria.nombre}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderServicio = (servicio: ServicioTemplate) => {
    const seleccionado = serviciosSeleccionados.find(s => s.id === servicio.id);
    const categoria = CATEGORIAS_SERVICIOS.find(c => c.id === servicio.categoria);

    return (
      <View key={servicio.id} style={styles.servicioCard}>
        <View style={styles.servicioHeader}>
          <View style={styles.servicioIconContainer}>
            <MaterialCommunityIcons 
              name={servicio.icon as any} 
              size={24} 
              color={categoria?.color || '#3B82F6'} 
            />
            {servicio.popular && (
              <View style={styles.popularBadge}>
                <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
              </View>
            )}
          </View>

          <View style={styles.servicioInfo}>
            <Text style={styles.servicioNombre}>{servicio.nombre}</Text>
            <Text style={styles.servicioDescripcion}>{servicio.descripcion}</Text>
            <Text style={styles.servicioPrecio}>
              ${servicio.precio_base.toFixed(2)} / {servicio.unidad}
            </Text>
            <Text style={styles.servicioTiempo}>
              ⏱ {servicio.tiempo_estimado}h estimado
            </Text>
          </View>

          <TouchableOpacity
            style={styles.agregarButton}
            onPress={() => agregarServicio(servicio)}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {servicio.instrucciones && (
          <Text style={styles.servicioInstrucciones}>
            💡 {servicio.instrucciones}
          </Text>
        )}

        {seleccionado && (
          <View style={styles.cantidadContainer}>
            <TouchableOpacity
              style={styles.cantidadButton}
              onPress={() => actualizarCantidad(servicio.id, seleccionado.cantidad - 1)}
            >
              <MaterialCommunityIcons name="minus" size={16} color="#666" />
            </TouchableOpacity>

            <Text style={styles.cantidadTexto}>{seleccionado.cantidad}</Text>

            <TouchableOpacity
              style={styles.cantidadButton}
              onPress={() => actualizarCantidad(servicio.id, seleccionado.cantidad + 1)}
            >
              <MaterialCommunityIcons name="plus" size={16} color="#666" />
            </TouchableOpacity>

            <Text style={styles.subtotalTexto}>
              ${calcularPrecioEstimado(servicio.id, seleccionado.cantidad).toFixed(2)}
            </Text>

            <TouchableOpacity
              style={styles.removerButton}
              onPress={() => removerServicio(servicio.id)}
            >
              <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.titulo}>Plantillas de Servicios</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.busquedaContainer}>
          <Input
            placeholder="Buscar servicios..."
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>

        {renderCategorias()}

        <ScrollView style={styles.serviciosContainer}>
          {serviciosFiltrados().map(renderServicio)}
        </ScrollView>

        {serviciosSeleccionados.length > 0 && (
          <View style={styles.resumenContainer}>
            <View style={styles.resumenHeader}>
              <Text style={styles.resumenTitulo}>
                {serviciosSeleccionados.length} servicio(s) seleccionado(s)
              </Text>
              <Text style={styles.totalEstimado}>
                Total estimado: ${calcularTotalEstimado().toFixed(2)}
              </Text>
            </View>

            <View style={styles.botonesContainer}>
              <TouchableOpacity
                style={[styles.botonSecundario, { flex: 1, marginRight: 8 }]}
                onPress={() => setServiciosSeleccionados([])}
              >
                <Text style={styles.textoBotonSecundario}>Limpiar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botonPrimario, { flex: 2 }]}
                onPress={handleConfirmar}
              >
                <Text style={styles.textoBotonPrimario}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  titulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  busquedaContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoriasContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoriaActiva: {
    backgroundColor: '#EBF8FF',
    borderColor: '#3B82F6',
  },
  categoriaTexto: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  serviciosContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  servicioCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  servicioHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  servicioIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  popularBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 2,
  },
  servicioInfo: {
    flex: 1,
  },
  servicioNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  servicioDescripcion: {
    fontSize: 14,
    color: '#6B7280',
    marginVertical: 2,
  },
  servicioPrecio: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  servicioTiempo: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  servicioInstrucciones: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  agregarButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EBF8FF',
  },
  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cantidadButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cantidadTexto: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  subtotalTexto: {
    marginLeft: 'auto',
    marginRight: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  removerButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
  },
  resumenContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  resumenHeader: {
    marginBottom: 12,
  },
  resumenTitulo: {
    fontSize: 14,
    color: '#6B7280',
  },
  totalEstimado: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 4,
  },
  botonesContainer: {
    flexDirection: 'row',
  },
  botonSecundario: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  textoBotonSecundario: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  botonPrimario: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  textoBotonPrimario: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
