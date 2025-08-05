import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList, 'SelectArticulos'>;
type RoutePropType = RouteProp<RootStackParamList, 'SelectArticulos'>;

interface Articulo {
  id: string;
  nombre: string;
  tipoServicio: 'lavado' | 'planchado' | 'otros';
  unidadCobro: 'kilo' | 'unidad';
  cantidad: number;
  precio: number;
}

// Datos mock de artículos existentes
const articulosMock = [
  { id: '1', nombre: 'Camisa', precio: 5 },
  { id: '2', nombre: 'Pantalón', precio: 7 },
  { id: '3', nombre: 'Edredón', precio: 15 },
  { id: '4', nombre: 'Vestido', precio: 10 },
  { id: '5', nombre: 'Chaqueta', precio: 12 },
  { id: '6', nombre: 'Falda', precio: 8 },
  { id: '7', nombre: 'Sábanas', precio: 12 },
  { id: '8', nombre: 'Toalla', precio: 6 },
];

const tiposServicio = [
  { id: 'lavado', label: 'Lavado', icon: 'washing-machine', color: '#3B82F6' },
  { id: 'planchado', label: 'Planchado', icon: 'iron', color: '#F59E0B' },
  { id: 'otros', label: 'Otros', icon: 'cog', color: '#8B5CF6' },
];

export const SelectArticulosScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { cliente } = route.params;

  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [busquedaArticulo, setBusquedaArticulo] = useState('');
  const [articulosFiltrados, setArticulosFiltrados] = useState<typeof articulosMock>([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [carritoVisible, setCarritoVisible] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [articuloActual, setArticuloActual] = useState({
    nombre: '',
    tipoServicio: 'lavado' as 'lavado' | 'planchado' | 'otros',
    unidadCobro: 'unidad' as 'kilo' | 'unidad',
    cantidad: 1,
    precio: 0
  });
  const [carritoAnimation] = useState(new Animated.Value(0));

  // Limpiar estado de búsqueda cuando se viene de una nueva navegación
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Solo limpiar la búsqueda, mantener artículos agregados si se regresa desde revisión
      setBusquedaArticulo('');
      setMostrarDropdown(false);
      setMostrarFormulario(false);
      setModalVisible(false);
      // Resetear artículo actual
      setArticuloActual({
        nombre: '',
        tipoServicio: 'lavado',
        unidadCobro: 'unidad',
        cantidad: 1,
        precio: 0
      });
    });

    return unsubscribe;
  }, [navigation]);

  // Limpiar completamente el carrito cuando es una orden completamente nueva
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Si venimos del Dashboard (nueva orden), limpiar todo
      if (navigation.getState().routes.length === 2) { // Dashboard -> SelectCliente -> SelectArticulos
        setArticulos([]);
        setCarritoVisible(false);
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (busquedaArticulo.length > 0) {
      const filtrados = articulosMock.filter(articulo =>
        articulo.nombre.toLowerCase().includes(busquedaArticulo.toLowerCase())
      );
      setArticulosFiltrados(filtrados);
      setMostrarDropdown(true);
    } else {
      setArticulosFiltrados([]);
      setMostrarDropdown(false);
    }
  }, [busquedaArticulo]);

  const handleSeleccionarArticulo = (articulo: typeof articulosMock[0]) => {
    setArticuloActual(prev => ({
      ...prev,
      nombre: articulo.nombre,
      precio: articulo.precio
    }));
    setBusquedaArticulo(articulo.nombre);
    setMostrarDropdown(false);
    setMostrarFormulario(true);
  };

  const handleCrearNuevoArticulo = () => {
    setArticuloActual(prev => ({
      ...prev,
      nombre: busquedaArticulo,
      precio: 0
    }));
    setMostrarFormulario(true);
    setMostrarDropdown(false);
  };

  const handleAgregarAlCarrito = () => {
    if (!articuloActual.nombre || articuloActual.cantidad <= 0 || articuloActual.precio <= 0) {
      Alert.alert('Error', 'Completa todos los campos requeridos');
      return;
    }

    const nuevoArticulo: Articulo = {
      id: Date.now().toString(),
      ...articuloActual
    };

    setArticulos(prev => [...prev, nuevoArticulo]);

    // Resetear formulario
    setArticuloActual({
      nombre: '',
      tipoServicio: 'lavado',
      unidadCobro: 'unidad',
      cantidad: 1,
      precio: 0
    });
    setBusquedaArticulo('');
    setMostrarFormulario(false);
    setModalVisible(false);

    // Mostrar carrito con animación
    if (!carritoVisible) {
      setCarritoVisible(true);
      Animated.spring(carritoAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleEliminarArticulo = (id: string) => {
    setArticulos(prev => prev.filter(item => item.id !== id));
  };

  const handleAbrirModalNuevoArticulo = () => {
    // Resetear formulario
    setArticuloActual({
      nombre: '',
      tipoServicio: 'lavado',
      unidadCobro: 'unidad',
      cantidad: 1,
      precio: 0
    });
    setBusquedaArticulo('');
    setMostrarFormulario(true);
    setModalVisible(true);
  };

  const calcularSubtotal = (articulo: Articulo) => {
    return articulo.precio * articulo.cantidad;
  };

  const calcularTotal = () => {
    return articulos.reduce((total, item) => total + calcularSubtotal(item), 0);
  };

  const handleFinalizarOrden = () => {
    if (articulos.length === 0) {
      Alert.alert('Error', 'Agrega al menos un artículo a la orden');
      return;
    }

    // Navegar a la pantalla de revisión
    navigation.navigate('ReviewOrden', {
      cliente,
      articulos,
      total: calcularTotal()
    });
  };

  const mostrarCrearNuevo = busquedaArticulo.length > 0 && articulosFiltrados.length === 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar Artículos</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Indicador de progreso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={[styles.progressCircle, styles.progressCircleCompleted]}>
            <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.progressLabel}>Cliente</Text>
        </View>
        
        <View style={[styles.progressLine, styles.progressLineActive]} />
        
        <View style={styles.progressStep}>
          <View style={[styles.progressCircle, styles.progressCircleActive]}>
            <Text style={[styles.progressText, styles.progressTextActive]}>2</Text>
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

      {/* Resumen del cliente */}
      <View style={styles.clienteContainer}>
        <View style={styles.clienteResumen}>
          <MaterialCommunityIcons name="account" size={20} color="#3B82F6" />
          <View style={styles.clienteInfo}>
            <Text style={styles.clienteNombre}>{cliente.nombre} {cliente.apellido}</Text>
            <Text style={styles.clienteTelefono}>{cliente.telefono}</Text>
          </View>
          <TouchableOpacity style={styles.editClienteBtn} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="pencil" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Buscar y agregar artículos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧺 Agregar artículos</Text>
          <Text style={styles.sectionDesc}>Busca artículos existentes o crea nuevos</Text>
          
          <TouchableOpacity 
            style={styles.addArticuloBtn}
            onPress={handleAbrirModalNuevoArticulo}
          >
            <MaterialCommunityIcons name="plus-circle" size={24} color="#FFFFFF" />
            <Text style={styles.addArticuloBtnText}>Agregar Artículo</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de artículos agregados */}
        {articulos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📦 Artículos Agregados ({articulos.length})</Text>
            
            {articulos.map((item) => (
              <View key={item.id} style={styles.articuloResumen}>
                <View style={styles.articuloInfo}>
                  <Text style={styles.articuloNombre}>{item.nombre}</Text>
                  <View style={styles.articuloTags}>
                    <View style={styles.servicioTag}>
                      <MaterialCommunityIcons 
                        name={tiposServicio.find(s => s.id === item.tipoServicio)?.icon as any} 
                        size={12} 
                        color="#FFFFFF" 
                      />
                      <Text style={styles.tagText}>
                        {tiposServicio.find(s => s.id === item.tipoServicio)?.label}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.articuloDetalle}>
                    {item.cantidad} {item.unidadCobro === 'kilo' ? 'kg' : 'und'} × ${item.precio}
                  </Text>
                </View>
                
                <View style={styles.articuloActions}>
                  <Text style={styles.articuloSubtotal}>
                    ${calcularSubtotal(item).toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleEliminarArticulo(item.id)}
                  >
                    <MaterialCommunityIcons name="trash-can" size={16} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Espacio para el footer */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer con acciones */}
      {articulos.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <Text style={styles.footerLabel}>Total de la orden:</Text>
            <Text style={styles.footerAmount}>${calcularTotal().toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.finalizarBtn} onPress={handleFinalizarOrden}>
            <MaterialCommunityIcons name="arrow-right-circle" size={24} color="#FFFFFF" />
            <Text style={styles.finalizarBtnText}>Revisar Orden</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal para agregar artículo */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Agregar Artículo</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Buscar artículos existentes - Siempre visible */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔍 Buscar artículos</Text>
              
              <View style={styles.searchContainer}>
                <MaterialCommunityIcons name="magnify" size={20} color="#6B7280" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar artículos (camisa, edredón, pantalón...)"
                  value={busquedaArticulo}
                  onChangeText={setBusquedaArticulo}
                />
                {busquedaArticulo.length > 0 && (
                  <TouchableOpacity onPress={() => setBusquedaArticulo('')}>
                    <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Dropdown de artículos */}
              {mostrarDropdown && (
                <View style={styles.dropdown}>
                  <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                    {articulosFiltrados.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.dropdownItem}
                        onPress={() => handleSeleccionarArticulo(item)}
                      >
                        <View>
                          <Text style={styles.dropdownName}>{item.nombre}</Text>
                          <Text style={styles.dropdownPrice}>${item.precio}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color="#6B7280" />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Crear nuevo artículo */}
              {mostrarCrearNuevo && (
                <TouchableOpacity
                  style={styles.crearNuevoBtn}
                  onPress={handleCrearNuevoArticulo}
                >
                  <MaterialCommunityIcons name="plus-circle" size={24} color="#059669" />
                  <Text style={styles.crearNuevoText}>Crear nuevo artículo: "{busquedaArticulo}"</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Formulario de configuración del artículo */}
            {mostrarFormulario && (
              <View style={styles.section}>
                <View style={styles.articuloHeader}>
                  <Text style={styles.sectionTitle}>⚙️ Configurar: {articuloActual.nombre}</Text>
                  <View style={styles.articuloBadge}>
                    <MaterialCommunityIcons name="tag" size={16} color="#059669" />
                    <Text style={styles.articuloBadgeText}>Artículo seleccionado</Text>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Tipo de servicio</Text>
                  <View style={styles.servicioContainer}>
                    {tiposServicio.map((servicio) => (
                      <TouchableOpacity
                        key={servicio.id}
                        style={[
                          styles.servicioBtn,
                          articuloActual.tipoServicio === servicio.id && styles.servicioBtnActive
                        ]}
                        onPress={() => setArticuloActual(prev => ({ 
                          ...prev, 
                          tipoServicio: servicio.id as any 
                        }))}
                      >
                        <MaterialCommunityIcons
                          name={servicio.icon as any}
                          size={24}
                          color={articuloActual.tipoServicio === servicio.id ? '#FFFFFF' : servicio.color}
                        />
                        <Text style={[
                          styles.servicioText,
                          articuloActual.tipoServicio === servicio.id && styles.servicioTextActive
                        ]}>
                          {servicio.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Unidad de cobro</Text>
                  <View style={styles.unidadContainer}>
                    <TouchableOpacity
                      style={[
                        styles.unidadBtn,
                        articuloActual.unidadCobro === 'unidad' && styles.unidadBtnActive
                      ]}
                      onPress={() => setArticuloActual(prev => ({ ...prev, unidadCobro: 'unidad' }))}
                    >
                      <MaterialCommunityIcons
                        name="numeric"
                        size={20}
                        color={articuloActual.unidadCobro === 'unidad' ? '#FFFFFF' : '#6B7280'}
                      />
                      <Text style={[
                        styles.unidadText,
                        articuloActual.unidadCobro === 'unidad' && styles.unidadTextActive
                      ]}>
                        Por cantidad
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.unidadBtn,
                        articuloActual.unidadCobro === 'kilo' && styles.unidadBtnActive
                      ]}
                      onPress={() => setArticuloActual(prev => ({ ...prev, unidadCobro: 'kilo' }))}
                    >
                      <MaterialCommunityIcons
                        name="weight-kilogram"
                        size={20}
                        color={articuloActual.unidadCobro === 'kilo' ? '#FFFFFF' : '#6B7280'}
                      />
                      <Text style={[
                        styles.unidadText,
                        articuloActual.unidadCobro === 'kilo' && styles.unidadTextActive
                      ]}>
                        Por kilo
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>
                      {articuloActual.unidadCobro === 'kilo' ? 'Peso (kg)' : 'Cantidad'}
                    </Text>
                    <View style={styles.counterContainer}>
                      <TouchableOpacity
                        style={styles.counterBtn}
                        onPress={() => setArticuloActual(prev => ({ 
                          ...prev, 
                          cantidad: Math.max(0, prev.cantidad - (prev.unidadCobro === 'kilo' ? 0.5 : 1))
                        }))}
                      >
                        <MaterialCommunityIcons name="minus" size={20} color="#6B7280" />
                      </TouchableOpacity>
                      <View style={styles.counterDisplay}>
                        <Text style={styles.counterValue}>{articuloActual.cantidad}</Text>
                        <Text style={styles.counterUnit}>
                          {articuloActual.unidadCobro === 'kilo' ? 'kg' : 'und'}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.counterBtn}
                        onPress={() => setArticuloActual(prev => ({ 
                          ...prev, 
                          cantidad: prev.cantidad + (prev.unidadCobro === 'kilo' ? 0.5 : 1)
                        }))}
                      >
                        <MaterialCommunityIcons name="plus" size={20} color="#059669" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>Precio unitario</Text>
                    <View style={styles.priceContainer}>
                      <TouchableOpacity
                        style={styles.priceBtn}
                        onPress={() => setArticuloActual(prev => ({ 
                          ...prev, 
                          precio: Math.max(0, prev.precio - 0.5)
                        }))}
                      >
                        <MaterialCommunityIcons name="minus" size={16} color="#6B7280" />
                      </TouchableOpacity>
                      <View style={styles.priceDisplay}>
                        <Text style={styles.priceSymbol}>$</Text>
                        <Text style={styles.priceValue}>{articuloActual.precio.toFixed(2)}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.priceBtn}
                        onPress={() => setArticuloActual(prev => ({ 
                          ...prev, 
                          precio: prev.precio + 0.5
                        }))}
                      >
                        <MaterialCommunityIcons name="plus" size={16} color="#059669" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.pricePresets}>
                      {[5, 10, 15, 20].map((preset) => (
                        <TouchableOpacity
                          key={preset}
                          style={styles.presetBtn}
                          onPress={() => setArticuloActual(prev => ({ ...prev, precio: preset }))}
                        >
                          <Text style={styles.presetText}>${preset}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                {/* Total parcial */}
                <View style={styles.totalParcialContainer}>
                  <View style={styles.totalParcialInfo}>
                    <Text style={styles.totalParcialLabel}>Subtotal:</Text>
                    <Text style={styles.totalParcialAmount}>
                      ${(articuloActual.precio * articuloActual.cantidad).toFixed(2)}
                    </Text>
                  </View>
                  <Text style={styles.totalParcialDetalle}>
                    {articuloActual.cantidad} {articuloActual.unidadCobro === 'kilo' ? 'kg' : 'unidad(es)'} × ${articuloActual.precio}/{articuloActual.unidadCobro === 'kilo' ? 'kg' : 'unidad'}
                  </Text>
                </View>

                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                      setMostrarFormulario(false);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.cancelBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.agregarBtn}
                    onPress={handleAgregarAlCarrito}
                  >
                    <MaterialCommunityIcons name="cart-plus" size={20} color="#FFFFFF" />
                    <Text style={styles.agregarBtnText}>Agregar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
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
    paddingVertical: 16,
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
  progressCircleCompleted: {
    backgroundColor: '#059669',
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
  progressLineActive: {
    backgroundColor: '#059669',
  },
  clienteContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clienteResumen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  clienteInfo: {
    flex: 1,
    marginLeft: 12,
  },
  clienteNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  clienteTelefono: {
    fontSize: 14,
    color: '#6B7280',
  },
  editClienteBtn: {
    padding: 4,
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
  dropdownPrice: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
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
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
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
  servicioContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  servicioBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  servicioBtnActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  servicioText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  servicioTextActive: {
    color: '#FFFFFF',
  },
  unidadContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  unidadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  unidadBtnActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  unidadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  unidadTextActive: {
    color: '#FFFFFF',
  },
  totalParcialContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  totalParcialInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  totalParcialLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  totalParcialAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  totalParcialDetalle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
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
  agregarBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    gap: 8,
  },
  agregarBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  carritoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemInfo: {
    flex: 1,
  },
  itemNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  itemDetalle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  deleteBtn: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  totalContainer: {
    alignItems: 'flex-end',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
  },
  totalText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
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
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  footerAmount: {
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
    gap: 12,
  },
  finalizarBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  // Estilos para el modal
  addArticuloBtn: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  addArticuloBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Estilos para artículos resumidos
  articuloResumen: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  articuloInfo: {
    flex: 1,
  },
  articuloNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  articuloTags: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  servicioTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  articuloDetalle: {
    fontSize: 14,
    color: '#6B7280',
  },
  articuloActions: {
    alignItems: 'center',
  },
  articuloSubtotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // Estilos para el header del artículo
  articuloHeader: {
    marginBottom: 16,
  },
  articuloBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  articuloBadgeText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  // Estilos para controles de cantidad
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  counterBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  counterDisplay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  counterValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  counterUnit: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  // Estilos para controles de precio
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  priceBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  priceDisplay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  priceSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginRight: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  pricePresets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 6,
  },
  presetBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  presetText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
});
