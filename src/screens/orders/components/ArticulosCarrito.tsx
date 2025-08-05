import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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

interface Props {
  cliente: Cliente;
  articulos: Articulo[];
  onAgregarArticulo: (articulo: Articulo) => void;
  onEditarArticulo: (id: string, articulo: Articulo) => void;
  onEliminarArticulo: (id: string) => void;
  onVolverEtapa1: () => void;
}

// Datos mock de artículos existentes
const articulosMock = [
  { id: '1', nombre: 'Camisa', precio: 5 },
  { id: '2', nombre: 'Pantalón', precio: 7 },
  { id: '3', nombre: 'Edredón', precio: 15 },
  { id: '4', nombre: 'Vestido', precio: 10 },
  { id: '5', nombre: 'Chaqueta', precio: 12 },
];

const tiposServicio = [
  { id: 'lavado', label: 'Lavado', icon: 'washing-machine', color: '#3B82F6' },
  { id: 'planchado', label: 'Planchado', icon: 'iron', color: '#F59E0B' },
  { id: 'otros', label: 'Otros', icon: 'cog', color: '#8B5CF6' },
];

export const ArticulosCarrito: React.FC<Props> = ({
  cliente,
  articulos,
  onAgregarArticulo,
  onEditarArticulo,
  onEliminarArticulo,
  onVolverEtapa1
}) => {
  const [busquedaArticulo, setBusquedaArticulo] = useState('');
  const [articulosFiltrados, setArticulosFiltrados] = useState<typeof articulosMock>([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [articuloActual, setArticuloActual] = useState({
    nombre: '',
    tipoServicio: 'lavado' as 'lavado' | 'planchado' | 'otros',
    unidadCobro: 'unidad' as 'kilo' | 'unidad',
    cantidad: 1,
    precio: 0
  });

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
    if (!articuloActual.nombre || articuloActual.cantidad <= 0) {
      Alert.alert('Error', 'Completa todos los campos requeridos');
      return;
    }

    onAgregarArticulo({
      id: '',
      ...articuloActual
    });

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
  };

  const calcularSubtotal = (articulo: Articulo) => {
    return (articulo.precio || 0) * articulo.cantidad;
  };

  const calcularTotal = () => {
    return articulos.reduce((total, item) => total + calcularSubtotal(item), 0);
  };

  const mostrarCrearNuevo = busquedaArticulo.length > 0 && articulosFiltrados.length === 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Resumen del cliente */}
      <View style={styles.section}>
        <View style={styles.clienteResumen}>
          <TouchableOpacity style={styles.editClienteBtn} onPress={onVolverEtapa1}>
            <MaterialCommunityIcons name="pencil" size={16} color="#6B7280" />
          </TouchableOpacity>
          <View style={styles.clienteInfo}>
            <Text style={styles.clienteNombre}>{cliente.nombre} {cliente.apellido}</Text>
            <Text style={styles.clienteTelefono}>{cliente.telefono}</Text>
          </View>
        </View>
      </View>

      {/* Agregar artículos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧺 Etapa 2: Agregar artículos</Text>
        <Text style={styles.sectionDesc}>Busca artículos existentes o crea nuevos</Text>
        
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
          <Text style={styles.sectionTitle}>Configurar Artículo</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nombre del artículo</Text>
            <TextInput
              style={styles.input}
              value={articuloActual.nombre}
              onChangeText={(text) => setArticuloActual(prev => ({ ...prev, nombre: text }))}
              placeholder="Nombre del artículo"
            />
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
              <TextInput
                style={styles.input}
                value={articuloActual.cantidad.toString()}
                onChangeText={(text) => setArticuloActual(prev => ({ 
                  ...prev, 
                  cantidad: parseFloat(text) || 0 
                }))}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Precio unitario</Text>
              <TextInput
                style={styles.input}
                value={articuloActual.precio.toString()}
                onChangeText={(text) => setArticuloActual(prev => ({ 
                  ...prev, 
                  precio: parseFloat(text) || 0 
                }))}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Total parcial */}
          <View style={styles.totalParcialContainer}>
            <View style={styles.totalParcialInfo}>
              <Text style={styles.totalParcialLabel}>Subtotal:</Text>
              <Text style={styles.totalParcialAmount}>
                ${((articuloActual.precio || 0) * articuloActual.cantidad).toFixed(2)}
              </Text>
            </View>
            <Text style={styles.totalParcialDetalle}>
              {articuloActual.cantidad} {articuloActual.unidadCobro === 'kilo' ? 'kg' : 'unidad(es)'} × ${articuloActual.precio || 0}/{articuloActual.unidadCobro === 'kilo' ? 'kg' : 'unidad'}
            </Text>
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setMostrarFormulario(false)}
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

      {/* Carrito de artículos */}
      {articulos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del carrito</Text>
          
          {articulos.map((item) => (
            <View key={item.id} style={styles.carritoItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemNombre}>{item.nombre}</Text>
                <Text style={styles.itemDetalle}>
                  {tiposServicio.find(s => s.id === item.tipoServicio)?.label} • {' '}
                  {item.cantidad} {item.unidadCobro === 'kilo' ? 'kg' : 'unidad(es)'} • {' '}
                  ${item.precio}/{item.unidadCobro === 'kilo' ? 'kg' : 'unidad'}
                </Text>
                <Text style={styles.itemSubtotal}>
                  Subtotal: ${calcularSubtotal(item).toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => {
                    // Implementar edición
                    console.log('Editar', item.id);
                  }}
                >
                  <MaterialCommunityIcons name="pencil" size={16} color="#6B7280" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => onEliminarArticulo(item.id)}
                >
                  <MaterialCommunityIcons name="trash-can" size={16} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ${calcularTotal().toFixed(2)}</Text>
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
  clienteResumen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
  },
  editClienteBtn: {
    padding: 4,
    marginRight: 12,
  },
  clienteInfo: {
    flex: 1,
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
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
  },
  totalContainer: {
    alignItems: 'flex-end',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
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
});
