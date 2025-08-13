import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, TextInput, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import BusquedaAvanzadaService from '../../services/BusquedaAvanzadaService';

type NavigationProp = StackNavigationProp<RootStackParamList, 'MisOrdenes'>;

interface Cliente {
  nombre: string;
  apellido: string;
  telefono: string;
}

interface Orden {
  id: string;
  cliente: Cliente;
  fechaCreacion: string;
  articulos: number;
  total: number;
  estado: 'Registrado' | 'En proceso' | 'Terminado';
}

type EstadoFiltro = 'Registrado' | 'En proceso' | 'Terminado';
type OrdenamientoTipo = 'reciente' | 'antiguo' | 'total_asc' | 'total_desc';

export const MisOrdenesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [estadoActivo, setEstadoActivo] = useState<EstadoFiltro>('Registrado');
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState<OrdenamientoTipo>('reciente');
  const [mostrarDropdownOrden, setMostrarDropdownOrden] = useState(false);
  const [modalQRVisible, setModalQRVisible] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<Orden | null>(null);
  const [cargandoOrdenes, setCargandoOrdenes] = useState(false);
  const [todasLasOrdenes, setTodasLasOrdenes] = useState<Orden[]>([]);

  // Cargar órdenes desde JSON Server al montar el componente
  useEffect(() => {
    cargarOrdenesDesdeAPI();
  }, []);

  const cargarOrdenesDesdeAPI = async () => {
    try {
      setCargandoOrdenes(true);
      
      const resultado = await BusquedaAvanzadaService.obtenerTodasLasOrdenesAPI();
      
      if (resultado.success && resultado.ordenes) {
        // Transformar los datos para que coincidan con la interfaz local
        const ordenesTransformadas = resultado.ordenes.map((orden: any) => ({
          id: orden.id,
          cliente: {
            nombre: orden.cliente?.nombre || 'Cliente',
            apellido: orden.cliente?.apellido || 'Desconocido',
            telefono: orden.cliente?.telefono || 'Sin teléfono'
          },
          fechaCreacion: orden.fechaCreacion,
          articulos: orden.articulos?.length || 0,
          total: orden.total || 0,
          estado: orden.estado || 'Registrado'
        }));
        
        setTodasLasOrdenes(ordenesTransformadas);
        console.log('✅ Órdenes cargadas desde API:', ordenesTransformadas.length);
      } else {
        console.log('⚠️ No se pudieron cargar órdenes desde API, usando datos mock');
        // Fallback a datos mock si no se puede conectar
        setTodasLasOrdenes(ordenesMock);
      }
    } catch (error) {
      console.error('❌ Error cargando órdenes desde API:', error);
      Alert.alert(
        'Error de Conexión',
        'No se pudieron cargar las órdenes desde el servidor. Verifica que JSON Server esté corriendo.',
        [{ text: 'Entendido' }]
      );
      // Fallback a datos mock
      setTodasLasOrdenes(ordenesMock);
    } finally {
      setCargandoOrdenes(false);
    }
  };

  // Datos mock de órdenes (fallback)
  const ordenesMock: Orden[] = [
    {
      id: 'ABC123',
      cliente: { nombre: 'Juan', apellido: 'Pérez', telefono: '77712345' },
      fechaCreacion: '2025-08-04T10:30:00',
      articulos: 5,
      total: 85,
      estado: 'Registrado'
    },
    {
      id: 'DEF456',
      cliente: { nombre: 'María', apellido: 'García', telefono: '68823456' },
      fechaCreacion: '2025-08-04T14:15:00',
      articulos: 3,
      total: 120,
      estado: 'En proceso'
    },
    {
      id: 'GHI789',
      cliente: { nombre: 'Carlos', apellido: 'López', telefono: '79934567' },
      fechaCreacion: '2025-08-03T09:45:00',
      articulos: 8,
      total: 200,
      estado: 'Terminado'
    },
    {
      id: 'JKL012',
      cliente: { nombre: 'Ana', apellido: 'Martínez', telefono: '75645678' },
      fechaCreacion: '2025-08-03T16:20:00',
      articulos: 2,
      total: 45,
      estado: 'Registrado'
    },
    {
      id: 'MNO345',
      cliente: { nombre: 'Pedro', apellido: 'Rodríguez', telefono: '69756789' },
      fechaCreacion: '2025-08-02T11:10:00',
      articulos: 6,
      total: 150,
      estado: 'Terminado'
    },
    {
      id: 'PQR678',
      cliente: { nombre: 'Lucía', apellido: 'Fernández', telefono: '73867890' },
      fechaCreacion: '2025-08-05T08:30:00',
      articulos: 4,
      total: 95,
      estado: 'En proceso'
    },
  ];

  const normalizarTexto = (texto: string): string => {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const filtrarOrdenes = (): Orden[] => {
    let ordenesFiltradas = todasLasOrdenes.filter(orden => orden.estado === estadoActivo);

    // Aplicar filtro de búsqueda
    if (textoBusqueda.trim()) {
      const busquedaNormalizada = normalizarTexto(textoBusqueda);
      ordenesFiltradas = ordenesFiltradas.filter(orden => {
        const nombreCompleto = `${orden.cliente.nombre} ${orden.cliente.apellido}`;
        return (
          normalizarTexto(nombreCompleto).includes(busquedaNormalizada) ||
          orden.cliente.telefono.includes(textoBusqueda) ||
          normalizarTexto(orden.id).includes(busquedaNormalizada)
        );
      });
    }

    // Aplicar ordenamiento
    ordenesFiltradas.sort((a, b) => {
      switch (ordenamiento) {
        case 'reciente':
          return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
        case 'antiguo':
          return new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime();
        case 'total_asc':
          return a.total - b.total;
        case 'total_desc':
          return b.total - a.total;
        default:
          return 0;
      }
    });

    return ordenesFiltradas;
  };

  const formatearFecha = (fechaISO: string): string => {
    const fecha = new Date(fechaISO);
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    return `${fecha.getDate()} de ${meses[fecha.getMonth()]}, ${fecha.getFullYear()}`;
  };

  const getEstadoColor = (estado: EstadoFiltro) => {
    switch (estado) {
      case 'Registrado':
        return { backgroundColor: '#FEF3C7', color: '#92400E', icon: 'clipboard-plus' as const };
      case 'En proceso':
        return { backgroundColor: '#DBEAFE', color: '#1E40AF', icon: 'clock-time-four' as const };
      case 'Terminado':
        return { backgroundColor: '#D1FAE5', color: '#065F46', icon: 'check-circle' as const };
    }
  };

  const ordenamientoOpciones = [
    { valor: 'reciente', label: 'Más reciente' },
    { valor: 'antiguo', label: 'Más antiguo' },
    { valor: 'total_desc', label: 'Total mayor' },
    { valor: 'total_asc', label: 'Total menor' },
  ];

  const ordenesFiltradas = filtrarOrdenes();

  // Función para exportar órdenes
  const exportarOrdenes = () => {
    const ordenesParaExportar = ordenesFiltradas.map(orden => ({
      id: orden.id,
      fecha: orden.fechaCreacion,
      cliente: `${orden.cliente.nombre} ${orden.cliente.apellido}`,
      telefono: orden.cliente.telefono,
      total: orden.total,
      estado: orden.estado,
      articulos: 3 // orden.articulos.length - temporal
    }));
    
    Alert.alert(
      '📊 Exportar Órdenes',
      `Se exportarán ${ordenesParaExportar.length} órdenes del estado "${estadoActivo}"`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Exportar', 
          onPress: () => Alert.alert('✅ Éxito', 'Las órdenes se han exportado correctamente')
        }
      ]
    );
  };

  const getContadorPorEstado = (estado: EstadoFiltro): number => {
    return todasLasOrdenes.filter(orden => orden.estado === estado).length;
  };

  // Función para generar datos del QR
  const generarDatosQR = (orden: Orden): string => {
    const ordenData = {
      tipo: 'ORDEN_LAVANDERIA',
      accion: 'VER_DETALLE',
      codigo: orden.id,
      cliente: `${orden.cliente.nombre} ${orden.cliente.apellido}`,
      telefono: orden.cliente.telefono,
      fecha: orden.fechaCreacion,
      articulos: orden.articulos,
      total: orden.total.toFixed(2),
      estado: orden.estado,
      // URL para abrir directamente la orden
      deepLink: `burbujapp://orden/${orden.id}`,
      // Información legible para humanos
      descripcion: `Orden #${orden.id} - ${orden.cliente.nombre} ${orden.cliente.apellido} - Total: ${orden.total} Bs`
    };
    return JSON.stringify(ordenData);
  };

  // Función para mostrar modal QR
  const mostrarQR = (orden: Orden) => {
    setOrdenSeleccionada(orden);
    setModalQRVisible(true);
  };

  // Función para abrir el detalle desde QR
  const abrirDetalleDesdeQR = (ordenId: string) => {
    setModalQRVisible(false);
    navigation.navigate('DetalleOrden', { ordenId });
  };

  // Función para procesar QR escaneado
  const procesarQREscaneado = (qrData: string) => {
    try {
      const data = JSON.parse(qrData);
      if (data.tipo === 'ORDEN_LAVANDERIA' && data.accion === 'VER_DETALLE') {
        abrirDetalleDesdeQR(data.codigo);
      }
    } catch (error) {
      Alert.alert('Error', 'Código QR no válido');
    }
  };

  const renderOrden = ({ item }: { item: Orden }) => {
    const estadoStyle = getEstadoColor(item.estado);
    
    return (
      <View style={styles.ordenCard}>
        <View style={styles.ordenHeader}>
          <View>
            <Text style={styles.ordenId}>🧾 Orden #{item.id}</Text>
            <Text style={styles.clienteNombre}>
              👤 {item.cliente.nombre} {item.cliente.apellido}
            </Text>
          </View>
          
          <View style={[styles.estadoBadge, { backgroundColor: estadoStyle.backgroundColor }]}>
            <MaterialCommunityIcons 
              name={estadoStyle.icon} 
              size={14} 
              color={estadoStyle.color} 
            />
            <Text style={[styles.estadoText, { color: estadoStyle.color }]}>
              {item.estado}
            </Text>
          </View>
        </View>

        <View style={styles.ordenDetalles}>
          <Text style={styles.ordenDetalle}>
            📆 {formatearFecha(item.fechaCreacion)}
          </Text>
          <Text style={styles.ordenDetalle}>
            📦 Artículos: {item.articulos}
          </Text>
          <Text style={styles.ordenTotal}>
            💵 Total: {item.total} Bs
          </Text>
        </View>

        <View style={styles.botonesContainer}>
          <TouchableOpacity 
            style={styles.verDetallesBtn}
            onPress={() => navigation.navigate('DetalleOrden', { ordenId: item.id })}
          >
            <MaterialCommunityIcons name="eye" size={16} color="#3B82F6" />
            <Text style={styles.verDetallesBtnText}>Ver detalles</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.qrBtn}
            onPress={() => mostrarQR(item)}
          >
            <MaterialCommunityIcons name="qrcode" size={20} color="#10B981" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Órdenes</Text>
        <TouchableOpacity style={styles.exportBtn} onPress={exportarOrdenes}>
          <MaterialCommunityIcons name="download" size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Filtros por estado */}
      <View style={styles.filtrosEstado}>
        {(['Registrado', 'En proceso', 'Terminado'] as EstadoFiltro[]).map((estado) => {
          const isActive = estadoActivo === estado;
          const estadoStyle = getEstadoColor(estado);
          const contador = getContadorPorEstado(estado);
          
          return (
            <TouchableOpacity
              key={estado}
              style={[
                styles.filtroTab,
                isActive && { backgroundColor: estadoStyle.backgroundColor }
              ]}
              onPress={() => setEstadoActivo(estado)}
            >
              <MaterialCommunityIcons 
                name={estadoStyle.icon} 
                size={16} 
                color={isActive ? estadoStyle.color : '#6B7280'} 
              />
              <Text style={[
                styles.filtroTabText,
                isActive && { color: estadoStyle.color, fontWeight: '700' }
              ]}>
                {estado} ({contador})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Barra de búsqueda y ordenamiento */}
      <View style={styles.busquedaContainer}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por cliente, teléfono o código..."
            value={textoBusqueda}
            onChangeText={setTextoBusqueda}
          />
          {textoBusqueda.length > 0 && (
            <TouchableOpacity onPress={() => setTextoBusqueda('')}>
              <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={styles.ordenarBtn}
          onPress={() => setMostrarDropdownOrden(!mostrarDropdownOrden)}
        >
          <MaterialCommunityIcons name="sort" size={20} color="#3B82F6" />
          <MaterialCommunityIcons name="chevron-down" size={16} color="#3B82F6" />
        </TouchableOpacity>

        {/* Dropdown de ordenamiento */}
        {mostrarDropdownOrden && (
          <View style={styles.dropdown}>
            {ordenamientoOpciones.map((opcion) => (
              <TouchableOpacity
                key={opcion.valor}
                style={styles.dropdownItem}
                onPress={() => {
                  setOrdenamiento(opcion.valor as OrdenamientoTipo);
                  setMostrarDropdownOrden(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  ordenamiento === opcion.valor && styles.dropdownItemTextActive
                ]}>
                  {opcion.label}
                </Text>
                {ordenamiento === opcion.valor && (
                  <MaterialCommunityIcons name="check" size={16} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Lista de órdenes */}
      {cargandoOrdenes ? (
        <View style={styles.loadingContainer}>
          <MaterialCommunityIcons name="loading" size={48} color="#059669" />
          <Text style={styles.loadingText}>Cargando órdenes desde el servidor...</Text>
          <Text style={styles.loadingSubtext}>Conectando con JSON Server</Text>
        </View>
      ) : (
        <FlatList
          data={ordenesFiltradas}
          keyExtractor={(item) => item.id}
          renderItem={renderOrden}
          contentContainerStyle={styles.listaContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="clipboard-remove" size={48} color="#9CA3AF" />
              <Text style={styles.emptyText}>No hay órdenes {estadoActivo.toLowerCase()}</Text>
              <Text style={styles.emptySubtext}>
                {textoBusqueda ? 'Prueba con otro término de búsqueda' : 'Las órdenes aparecerán aquí'}
              </Text>
            </View>
          }
        />
      )}

      {/* Modal QR */}
      <Modal
        visible={modalQRVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalQRVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                🔗 Código QR - Orden #{ordenSeleccionada?.id}
              </Text>
              <TouchableOpacity 
                style={styles.closeBtn}
                onPress={() => setModalQRVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            {ordenSeleccionada && (
              <View style={styles.qrContent}>
                <View style={styles.qrWrapper}>
                  <QRCode
                    value={generarDatosQR(ordenSeleccionada)}
                    size={200}
                    color="#111827"
                    backgroundColor="#FFFFFF"
                  />
                </View>
                
                <View style={styles.qrInfo}>
                  <Text style={styles.qrClienteNombre}>
                    👤 {ordenSeleccionada.cliente.nombre} {ordenSeleccionada.cliente.apellido}
                  </Text>
                  <Text style={styles.qrDetalle}>📞 {ordenSeleccionada.cliente.telefono}</Text>
                  <Text style={styles.qrDetalle}>💵 Total: {ordenSeleccionada.total} Bs</Text>
                  <Text style={styles.qrDetalle}>📦 Artículos: {ordenSeleccionada.articulos}</Text>
                  <Text style={styles.qrInstruction}>
                    💡 Escanea este QR para abrir directamente esta orden
                  </Text>
                </View>

                <View style={styles.qrActions}>
                  <TouchableOpacity 
                    style={styles.verDetalleQRBtn}
                    onPress={() => abrirDetalleDesdeQR(ordenSeleccionada.id)}
                  >
                    <MaterialCommunityIcons name="eye" size={18} color="#3B82F6" />
                    <Text style={styles.verDetalleQRBtnText}>Ver Detalle</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.shareBtn}>
                    <MaterialCommunityIcons name="share-variant" size={18} color="#3B82F6" />
                    <Text style={styles.shareBtnText}>Compartir</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.saveBtn}>
                    <MaterialCommunityIcons name="download" size={18} color="#10B981" />
                    <Text style={styles.saveBtnText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
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
  exportBtn: {
    padding: 8,
  },
  filtrosEstado: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtroTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    gap: 6,
  },
  filtroTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  busquedaContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  ordenarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 4,
  },
  dropdown: {
    position: 'absolute',
    top: 70,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
    minWidth: 150,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#374151',
  },
  dropdownItemTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  listaContainer: {
    padding: 16,
  },
  ordenCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  ordenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ordenId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  clienteNombre: {
    fontSize: 14,
    color: '#6B7280',
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ordenDetalles: {
    gap: 4,
    marginBottom: 12,
  },
  ordenDetalle: {
    fontSize: 14,
    color: '#6B7280',
  },
  ordenTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  verDetallesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 6,
  },
  verDetallesBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  botonesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qrBtn: {
    padding: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  // Estilos del Modal QR
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  qrContent: {
    alignItems: 'center',
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  qrInfo: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 4,
  },
  qrClienteNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  qrDetalle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  qrInstruction: {
    fontSize: 12,
    color: '#10B981',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  qrActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  verDetalleQRBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
    gap: 4,
  },
  verDetalleQRBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
    gap: 4,
  },
  shareBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    gap: 4,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
});
