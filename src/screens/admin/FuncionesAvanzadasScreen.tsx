import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, Alert, Switch, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Promocion {
  id: string;
  nombre: string;
  descripcion: string;
  descuento: number;
  tipo: 'porcentaje' | 'monto';
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
  codigoQR?: string;
}

interface ClienteFidelidad {
  id: string;
  nombre: string;
  telefono: string;
  puntos: number;
  nivel: 'Bronce' | 'Plata' | 'Oro' | 'Platino';
  descuentoActual: number;
  proximaRecompensa: number;
}

interface EventoCalendario {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  tipo: 'mantenimiento' | 'promocion' | 'capacitacion' | 'evento';
  recordatorio: boolean;
}

interface FuncionAvanzada {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  categoria: 'promociones' | 'fidelidad' | 'comunicacion' | 'calendario' | 'integracion';
  activa: boolean;
}

export const FuncionesAvanzadasScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [modalPromociones, setModalPromociones] = useState(false);
  const [modalFidelidad, setModalFidelidad] = useState(false);
  const [modalWhatsApp, setModalWhatsApp] = useState(false);
  const [modalCalendario, setModalCalendario] = useState(false);
  const [promocionEditando, setPromocionEditando] = useState<Promocion | null>(null);

  // Mock de promociones
  const [promociones, setPromociones] = useState<Promocion[]>([
    {
      id: '1',
      nombre: 'Descuento Cliente Nuevo',
      descripcion: '20% de descuento en primera visita',
      descuento: 20,
      tipo: 'porcentaje',
      fechaInicio: '2025-08-01',
      fechaFin: '2025-08-31',
      activa: true,
      codigoQR: 'NUEVO20'
    },
    {
      id: '2',
      nombre: 'Promoción Lavado+Planchado',
      descripcion: '$10 de descuento en combo completo',
      descuento: 10,
      tipo: 'monto',
      fechaInicio: '2025-08-15',
      fechaFin: '2025-09-15',
      activa: true,
      codigoQR: 'COMBO10'
    },
    {
      id: '3',
      nombre: 'Fin de Semana Especial',
      descripcion: '15% descuento sábados y domingos',
      descuento: 15,
      tipo: 'porcentaje',
      fechaInicio: '2025-08-01',
      fechaFin: '2025-12-31',
      activa: false,
      codigoQR: 'WEEKEND15'
    }
  ]);

  // Mock de clientes fidelidad
  const [clientesFidelidad] = useState<ClienteFidelidad[]>([
    { id: '1', nombre: 'María Elena García', telefono: '77712345', puntos: 850, nivel: 'Oro', descuentoActual: 15, proximaRecompensa: 150 },
    { id: '2', nombre: 'Carlos Mendoza López', telefono: '68823456', puntos: 650, nivel: 'Plata', descuentoActual: 10, proximaRecompensa: 350 },
    { id: '3', nombre: 'Ana Patricia Vargas', telefono: '79934567', puntos: 1200, nivel: 'Platino', descuentoActual: 20, proximaRecompensa: 800 },
    { id: '4', nombre: 'Luis Fernando Cruz', telefono: '75645678', puntos: 280, nivel: 'Bronce', descuentoActual: 5, proximaRecompensa: 220 },
    { id: '5', nombre: 'Patricia Morales', telefono: '69756789', puntos: 480, nivel: 'Plata', descuentoActual: 10, proximaRecompensa: 520 }
  ]);

  // Mock de eventos calendario
  const [eventosCalendario] = useState<EventoCalendario[]>([
    {
      id: '1',
      titulo: 'Mantenimiento Máquinas',
      descripcion: 'Revisión general de equipos de lavado',
      fecha: '2025-08-10',
      hora: '09:00',
      tipo: 'mantenimiento',
      recordatorio: true
    },
    {
      id: '2',
      titulo: 'Lanzamiento Promoción Verano',
      descripcion: 'Inicio de campaña de descuentos',
      fecha: '2025-08-15',
      hora: '08:00',
      tipo: 'promocion',
      recordatorio: true
    },
    {
      id: '3',
      titulo: 'Capacitación Personal',
      descripcion: 'Entrenamiento en nuevos procesos',
      fecha: '2025-08-20',
      hora: '14:00',
      tipo: 'capacitacion',
      recordatorio: false
    }
  ]);

  // Mock de funciones avanzadas
  const [funcionesAvanzadas, setFuncionesAvanzadas] = useState<FuncionAvanzada[]>([
    {
      id: '1',
      nombre: 'Gestión de Promociones',
      descripcion: 'Crear y gestionar ofertas especiales',
      icono: 'percent',
      color: '#EF4444',
      categoria: 'promociones',
      activa: true
    },
    {
      id: '2',
      nombre: 'Programa de Fidelidad',
      descripcion: 'Sistema de puntos y recompensas',
      icono: 'star',
      color: '#F59E0B',
      categoria: 'fidelidad',
      activa: true
    },
    {
      id: '3',
      nombre: 'WhatsApp Business',
      descripcion: 'Comunicación automatizada con clientes',
      icono: 'whatsapp',
      color: '#25D366',
      categoria: 'comunicacion',
      activa: false
    },
    {
      id: '4',
      nombre: 'Calendario de Eventos',
      descripcion: 'Programación y recordatorios',
      icono: 'calendar',
      color: '#8B5CF6',
      categoria: 'calendario',
      activa: true
    },
    {
      id: '5',
      nombre: 'Integración POS',
      descripcion: 'Conexión con sistemas de pago',
      icono: 'point-of-sale',
      color: '#3B82F6',
      categoria: 'integracion',
      activa: false
    },
    {
      id: '6',
      nombre: 'API Externa',
      descripcion: 'Conectar con servicios externos',
      icono: 'api',
      color: '#10B981',
      categoria: 'integracion',
      activa: false
    }
  ]);

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'promociones': return { backgroundColor: '#FEF2F2', color: '#EF4444' };
      case 'fidelidad': return { backgroundColor: '#FEF3C7', color: '#F59E0B' };
      case 'comunicacion': return { backgroundColor: '#ECFDF5', color: '#25D366' };
      case 'calendario': return { backgroundColor: '#F3E8FF', color: '#8B5CF6' };
      case 'integracion': return { backgroundColor: '#EBF8FF', color: '#3B82F6' };
      default: return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case 'Bronce': return '#CD7F32';
      case 'Plata': return '#C0C0C0';
      case 'Oro': return '#FFD700';
      case 'Platino': return '#E5E4E2';
      default: return '#6B7280';
    }
  };

  const getTipoEventoColor = (tipo: string) => {
    switch (tipo) {
      case 'mantenimiento': return '#EF4444';
      case 'promocion': return '#10B981';
      case 'capacitacion': return '#3B82F6';
      case 'evento': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const abrirFuncion = (funcion: FuncionAvanzada) => {
    if (!funcion.activa) {
      Alert.alert('Función Deshabilitada', 'Esta función no está disponible actualmente');
      return;
    }

    switch (funcion.id) {
      case '1':
        setModalPromociones(true);
        break;
      case '2':
        setModalFidelidad(true);
        break;
      case '3':
        setModalWhatsApp(true);
        break;
      case '4':
        setModalCalendario(true);
        break;
      case '5':
        Alert.alert('Integración POS', 'Configurar conexión con sistemas de punto de venta');
        break;
      case '6':
        Alert.alert('API Externa', 'Gestionar integraciones con servicios externos');
        break;
      default:
        Alert.alert('Función', `Abrir ${funcion.nombre}`);
    }
  };

  const toggleFuncion = (funcionId: string) => {
    setFuncionesAvanzadas(prev => prev.map(f => 
      f.id === funcionId ? { ...f, activa: !f.activa } : f
    ));
  };

  const crearPromocion = () => {
    const nuevaPromocion: Promocion = {
      id: Date.now().toString(),
      nombre: 'Nueva Promoción',
      descripcion: 'Descripción de la promoción',
      descuento: 10,
      tipo: 'porcentaje',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      activa: true,
      codigoQR: `PROMO${Date.now()}`
    };
    
    setPromociones(prev => [...prev, nuevaPromocion]);
    Alert.alert('✅ Éxito', 'Promoción creada correctamente');
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderFuncion = ({ item }: { item: FuncionAvanzada }) => {
    const categoriaStyle = getCategoriaColor(item.categoria);
    
    return (
      <TouchableOpacity 
        style={[styles.funcionCard, !item.activa && styles.funcionInactiva]}
        onPress={() => abrirFuncion(item)}
      >
        <View style={styles.funcionHeader}>
          <View style={[styles.funcionIcon, { backgroundColor: categoriaStyle.backgroundColor }]}>
            <MaterialCommunityIcons 
              name={item.icono as any} 
              size={24} 
              color={item.activa ? item.color : '#9CA3AF'} 
            />
          </View>
          
          <View style={styles.funcionInfo}>
            <Text style={[styles.funcionNombre, !item.activa && styles.funcionTextoInactivo]}>
              {item.nombre}
            </Text>
            <Text style={[styles.funcionDescripcion, !item.activa && styles.funcionTextoInactivo]}>
              {item.descripcion}
            </Text>
          </View>
        </View>
        
        <View style={styles.funcionActions}>
          <View style={[styles.categoriaTag, categoriaStyle]}>
            <Text style={[styles.categoriaText, { color: categoriaStyle.color }]}>
              {item.categoria}
            </Text>
          </View>
          
          <Switch
            value={item.activa}
            onValueChange={() => toggleFuncion(item.id)}
            trackColor={{ false: '#D1D5DB', true: '#10B981' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderPromocion = ({ item }: { item: Promocion }) => {
    return (
      <View style={styles.promocionCard}>
        <View style={styles.promocionInfo}>
          <Text style={styles.promocionNombre}>{item.nombre}</Text>
          <Text style={styles.promocionDescripcion}>{item.descripcion}</Text>
          <Text style={styles.promocionCodigo}>📱 Código: {item.codigoQR}</Text>
          <Text style={styles.promocionFechas}>
            📅 {formatearFecha(item.fechaInicio)} - {formatearFecha(item.fechaFin)}
          </Text>
        </View>
        
        <View style={styles.promocionMeta}>
          <Text style={styles.promocionDescuento}>
            {item.tipo === 'porcentaje' ? `${item.descuento}%` : `$${item.descuento}`}
          </Text>
          <Switch
            value={item.activa}
            onValueChange={(value) => {
              setPromociones(prev => prev.map(p => 
                p.id === item.id ? { ...p, activa: value } : p
              ));
            }}
            trackColor={{ false: '#D1D5DB', true: '#10B981' }}
            thumbColor="#FFFFFF"
          />
          <TouchableOpacity 
            style={styles.editBtn}
            onPress={() => setPromocionEditando(item)}
          >
            <MaterialCommunityIcons name="pencil" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderClienteFidelidad = ({ item }: { item: ClienteFidelidad }) => {
    const nivelColor = getNivelColor(item.nivel);
    
    return (
      <View style={styles.clienteFidelidadCard}>
        <View style={styles.clienteInfo}>
          <Text style={styles.clienteNombre}>{item.nombre}</Text>
          <Text style={styles.clienteTelefono}>📞 {item.telefono}</Text>
          <View style={styles.nivelContainer}>
            <MaterialCommunityIcons name="star" size={16} color={nivelColor} />
            <Text style={[styles.clienteNivel, { color: nivelColor }]}>{item.nivel}</Text>
          </View>
        </View>
        
        <View style={styles.fidelidadStats}>
          <View style={styles.fidelidadStat}>
            <Text style={styles.fidelidadNumber}>{item.puntos}</Text>
            <Text style={styles.fidelidadLabel}>Puntos</Text>
          </View>
          <View style={styles.fidelidadStat}>
            <Text style={styles.fidelidadNumber}>{item.descuentoActual}%</Text>
            <Text style={styles.fidelidadLabel}>Descuento</Text>
          </View>
          <View style={styles.fidelidadStat}>
            <Text style={styles.fidelidadNumber}>{item.proximaRecompensa}</Text>
            <Text style={styles.fidelidadLabel}>Para Premio</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEvento = ({ item }: { item: EventoCalendario }) => {
    const tipoColor = getTipoEventoColor(item.tipo);
    
    return (
      <View style={styles.eventoCard}>
        <View style={styles.eventoInfo}>
          <View style={styles.eventoHeader}>
            <MaterialCommunityIcons name="circle" size={12} color={tipoColor} />
            <Text style={styles.eventoTitulo}>{item.titulo}</Text>
          </View>
          <Text style={styles.eventoDescripcion}>{item.descripcion}</Text>
          <Text style={styles.eventoFecha}>
            📅 {formatearFecha(item.fecha)} a las {item.hora}
          </Text>
        </View>
        
        <View style={styles.eventoMeta}>
          <Text style={[styles.eventoTipo, { color: tipoColor }]}>{item.tipo}</Text>
          {item.recordatorio && (
            <MaterialCommunityIcons name="bell" size={16} color="#F59E0B" />
          )}
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
        <Text style={styles.headerTitle}>Funciones Avanzadas</Text>
        <TouchableOpacity 
          style={styles.helpBtn} 
          onPress={() => Alert.alert('Ayuda', 'Guía de funciones avanzadas del sistema')}
        >
          <MaterialCommunityIcons name="help-circle" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
        {/* Estadísticas rápidas */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>📊 Estado de Funciones</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="percent" size={24} color="#EF4444" />
              <Text style={styles.statNumber}>{promociones.filter(p => p.activa).length}</Text>
              <Text style={styles.statLabel}>Promociones Activas</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="star" size={24} color="#F59E0B" />
              <Text style={styles.statNumber}>{clientesFidelidad.length}</Text>
              <Text style={styles.statLabel}>Clientes VIP</Text>
            </View>
            
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="calendar" size={24} color="#8B5CF6" />
              <Text style={styles.statNumber}>{eventosCalendario.filter(e => e.recordatorio).length}</Text>
              <Text style={styles.statLabel}>Eventos Próximos</Text>
            </View>
          </View>
        </View>

        {/* Funciones disponibles */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>🚀 Funciones Disponibles</Text>
          <FlatList
            data={funcionesAvanzadas}
            keyExtractor={(item) => item.id}
            renderItem={renderFuncion}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {/* Modal Promociones */}
      <Modal
        visible={modalPromociones}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalPromociones(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🎯 Gestión de Promociones</Text>
              <TouchableOpacity onPress={() => setModalPromociones(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.addBtn} onPress={crearPromocion}>
                <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
                <Text style={styles.addBtnText}>Nueva Promoción</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={promociones}
              keyExtractor={(item) => item.id}
              renderItem={renderPromocion}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Modal Fidelidad */}
      <Modal
        visible={modalFidelidad}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalFidelidad(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>⭐ Programa de Fidelidad</Text>
              <TouchableOpacity onPress={() => setModalFidelidad(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={clientesFidelidad}
              keyExtractor={(item) => item.id}
              renderItem={renderClienteFidelidad}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Modal WhatsApp */}
      <Modal
        visible={modalWhatsApp}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalWhatsApp(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📱 WhatsApp Business</Text>
              <TouchableOpacity onPress={() => setModalWhatsApp(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.whatsappSettings}>
              <View style={styles.whatsappOption}>
                <Text style={styles.whatsappTitle}>Configuración de API</Text>
                <Text style={styles.whatsappDesc}>Conectar con WhatsApp Business API</Text>
                <TouchableOpacity style={styles.configBtn}>
                  <Text style={styles.configBtnText}>🔧 Configurar</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.whatsappOption}>
                <Text style={styles.whatsappTitle}>Mensajes Automáticos</Text>
                <Text style={styles.whatsappDesc}>Notificaciones automáticas a clientes</Text>
                <TouchableOpacity style={styles.configBtn}>
                  <Text style={styles.configBtnText}>📝 Plantillas</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.whatsappOption}>
                <Text style={styles.whatsappTitle}>Campañas Promocionales</Text>
                <Text style={styles.whatsappDesc}>Envío masivo de promociones</Text>
                <TouchableOpacity style={styles.configBtn}>
                  <Text style={styles.configBtnText}>🎯 Crear Campaña</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Calendario */}
      <Modal
        visible={modalCalendario}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalCalendario(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📅 Calendario de Eventos</Text>
              <TouchableOpacity onPress={() => setModalCalendario(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.addBtn} 
                onPress={() => Alert.alert('Nuevo Evento', 'Crear evento en el calendario')}
              >
                <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
                <Text style={styles.addBtnText}>Nuevo Evento</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={eventosCalendario}
              keyExtractor={(item) => item.id}
              renderItem={renderEvento}
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            />
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
  backBtn: {
    padding: 8,
  },
  helpBtn: {
    padding: 8,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  funcionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  funcionInactiva: {
    opacity: 0.6,
  },
  funcionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  funcionIcon: {
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  funcionInfo: {
    flex: 1,
  },
  funcionNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  funcionTextoInactivo: {
    color: '#9CA3AF',
  },
  funcionDescripcion: {
    fontSize: 12,
    color: '#6B7280',
  },
  funcionActions: {
    alignItems: 'center',
    gap: 8,
  },
  categoriaTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoriaText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalActions: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  addBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
  },
  promocionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promocionInfo: {
    flex: 1,
  },
  promocionNombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  promocionDescripcion: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  promocionCodigo: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
    marginBottom: 2,
  },
  promocionFechas: {
    fontSize: 12,
    color: '#6B7280',
  },
  promocionMeta: {
    alignItems: 'center',
    gap: 8,
  },
  promocionDescuento: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EF4444',
  },
  editBtn: {
    padding: 4,
  },
  clienteFidelidadCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clienteInfo: {
    flex: 1,
  },
  clienteNombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  clienteTelefono: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  nivelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clienteNivel: {
    fontSize: 12,
    fontWeight: '600',
  },
  fidelidadStats: {
    flexDirection: 'row',
    gap: 12,
  },
  fidelidadStat: {
    alignItems: 'center',
  },
  fidelidadNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
  },
  fidelidadLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  eventoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventoInfo: {
    flex: 1,
  },
  eventoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  eventoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  eventoDescripcion: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  eventoFecha: {
    fontSize: 12,
    color: '#6B7280',
  },
  eventoMeta: {
    alignItems: 'center',
    gap: 4,
  },
  eventoTipo: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  whatsappSettings: {
    padding: 20,
    gap: 20,
  },
  whatsappOption: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
  },
  whatsappTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  whatsappDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  configBtn: {
    backgroundColor: '#25D366',
    borderRadius: 6,
    padding: 8,
    alignSelf: 'flex-start',
  },
  configBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
