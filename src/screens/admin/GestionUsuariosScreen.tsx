import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Modal, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: 'admin' | 'operator';
  estado: 'activo' | 'inactivo';
  fechaCreacion: string;
  ultimaConexion: string;
  ventasDelMes: number;
  ordenesAsignadas: number;
}

interface Permiso {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: 'ordenes' | 'clientes' | 'reportes' | 'configuracion';
  activo: boolean;
}

export const GestionUsuariosScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPermisos, setModalPermisos] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rol: 'operator' as 'admin' | 'operator'
  });

  // Mock de usuarios
  const [usuarios] = useState<Usuario[]>([
    {
      id: '1',
      nombre: 'María',
      apellido: 'González',
      email: 'maria@burbujapp.com',
      telefono: '77712345',
      rol: 'operator',
      estado: 'activo',
      fechaCreacion: '2025-01-15',
      ultimaConexion: '2025-08-07T14:30:00',
      ventasDelMes: 2450,
      ordenesAsignadas: 45
    },
    {
      id: '2',
      nombre: 'Carlos',
      apellido: 'Mendoza',
      email: 'carlos@burbujapp.com',
      telefono: '68823456',
      rol: 'operator',
      estado: 'activo',
      fechaCreacion: '2025-02-10',
      ultimaConexion: '2025-08-07T10:15:00',
      ventasDelMes: 1890,
      ordenesAsignadas: 32
    },
    {
      id: '3',
      nombre: 'Ana',
      apellido: 'Vargas',
      email: 'ana@burbujapp.com',
      telefono: '79934567',
      rol: 'operator',
      estado: 'inactivo',
      fechaCreacion: '2025-03-05',
      ultimaConexion: '2025-08-05T16:45:00',
      ventasDelMes: 950,
      ordenesAsignadas: 18
    }
  ]);

  // Mock de permisos
  const [permisos] = useState<Permiso[]>([
    { id: '1', nombre: 'Crear Órdenes', descripcion: 'Permite crear nuevas órdenes', categoria: 'ordenes', activo: true },
    { id: '2', nombre: 'Editar Órdenes', descripcion: 'Permite modificar órdenes existentes', categoria: 'ordenes', activo: true },
    { id: '3', nombre: 'Eliminar Órdenes', descripcion: 'Permite eliminar órdenes', categoria: 'ordenes', activo: false },
    { id: '4', nombre: 'Gestionar Clientes', descripcion: 'Crear y editar información de clientes', categoria: 'clientes', activo: true },
    { id: '5', nombre: 'Ver Reportes', descripcion: 'Acceso a reportes básicos', categoria: 'reportes', activo: true },
    { id: '6', nombre: 'Exportar Datos', descripcion: 'Exportar reportes y datos', categoria: 'reportes', activo: false },
    { id: '7', nombre: 'Configurar Precios', descripcion: 'Modificar tarifas de servicios', categoria: 'configuracion', activo: false },
    { id: '8', nombre: 'Configurar Sistema', descripcion: 'Acceso a configuraciones avanzadas', categoria: 'configuracion', activo: false }
  ]);

  const getRolColor = (rol: 'admin' | 'operator') => {
    return rol === 'admin' 
      ? { backgroundColor: '#FEE2E2', color: '#DC2626', icon: 'shield-crown' as const }
      : { backgroundColor: '#DBEAFE', color: '#1E40AF', icon: 'account' as const };
  };

  const getEstadoColor = (estado: 'activo' | 'inactivo') => {
    return estado === 'activo'
      ? { backgroundColor: '#D1FAE5', color: '#065F46', icon: 'check-circle' as const }
      : { backgroundColor: '#FEE2E2', color: '#DC2626', icon: 'close-circle' as const };
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'ordenes': return { backgroundColor: '#EBF8FF', color: '#3B82F6' };
      case 'clientes': return { backgroundColor: '#F3E8FF', color: '#8B5CF6' };
      case 'reportes': return { backgroundColor: '#ECFDF5', color: '#10B981' };
      case 'configuracion': return { backgroundColor: '#FEF3C7', color: '#F59E0B' };
      default: return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatearUltimaConexion = (fecha: string) => {
    const ahora = new Date();
    const conexion = new Date(fecha);
    const diffMs = ahora.getTime() - conexion.getTime();
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHoras < 1) return 'Hace menos de 1 hora';
    if (diffHoras < 24) return `Hace ${diffHoras} horas`;
    return `Hace ${Math.floor(diffHoras / 24)} días`;
  };

  const crearUsuario = () => {
    Alert.alert('✅ Usuario Creado', `Se ha creado el usuario ${nuevoUsuario.nombre} ${nuevoUsuario.apellido}`);
    setModalVisible(false);
    setNuevoUsuario({ nombre: '', apellido: '', email: '', telefono: '', rol: 'operator' });
  };

  const toggleEstadoUsuario = (usuario: Usuario) => {
    const nuevoEstado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
    Alert.alert(
      'Cambiar Estado',
      `¿Desea ${nuevoEstado === 'activo' ? 'activar' : 'desactivar'} al usuario ${usuario.nombre} ${usuario.apellido}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => Alert.alert('✅ Estado Actualizado', `Usuario ${nuevoEstado}`) }
      ]
    );
  };

  const renderUsuario = ({ item }: { item: Usuario }) => {
    const rolStyle = getRolColor(item.rol);
    const estadoStyle = getEstadoColor(item.estado);
    
    return (
      <View style={styles.usuarioCard}>
        <View style={styles.usuarioHeader}>
          <View style={styles.usuarioInfo}>
            <Text style={styles.usuarioNombre}>{item.nombre} {item.apellido}</Text>
            <Text style={styles.usuarioEmail}>{item.email}</Text>
            <Text style={styles.usuarioTelefono}>📞 {item.telefono}</Text>
          </View>
          
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: rolStyle.backgroundColor }]}>
              <MaterialCommunityIcons name={rolStyle.icon} size={12} color={rolStyle.color} />
              <Text style={[styles.badgeText, { color: rolStyle.color }]}>
                {item.rol === 'admin' ? 'Admin' : 'Operador'}
              </Text>
            </View>
            
            <View style={[styles.badge, { backgroundColor: estadoStyle.backgroundColor }]}>
              <MaterialCommunityIcons name={estadoStyle.icon} size={12} color={estadoStyle.color} />
              <Text style={[styles.badgeText, { color: estadoStyle.color }]}>
                {item.estado}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.usuarioStats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>${item.ventasDelMes}</Text>
            <Text style={styles.statLabel}>Ventas del mes</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{item.ordenesAsignadas}</Text>
            <Text style={styles.statLabel}>Órdenes asignadas</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{formatearUltimaConexion(item.ultimaConexion)}</Text>
            <Text style={styles.statLabel}>Última conexión</Text>
          </View>
        </View>

        <View style={styles.usuarioActions}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => {
              setUsuarioSeleccionado(item);
              setModalPermisos(true);
            }}
          >
            <MaterialCommunityIcons name="shield-edit" size={16} color="#3B82F6" />
            <Text style={styles.actionBtnText}>Permisos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => toggleEstadoUsuario(item)}
          >
            <MaterialCommunityIcons 
              name={item.estado === 'activo' ? 'pause' : 'play'} 
              size={16} 
              color={item.estado === 'activo' ? '#EF4444' : '#10B981'} 
            />
            <Text style={[styles.actionBtnText, { 
              color: item.estado === 'activo' ? '#EF4444' : '#10B981' 
            }]}>
              {item.estado === 'activo' ? 'Desactivar' : 'Activar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPermiso = ({ item }: { item: Permiso }) => {
    const categoriaStyle = getCategoriaColor(item.categoria);
    
    return (
      <View style={styles.permisoCard}>
        <View style={styles.permisoHeader}>
          <View style={styles.permisoInfo}>
            <Text style={styles.permisoNombre}>{item.nombre}</Text>
            <Text style={styles.permisoDescripcion}>{item.descripcion}</Text>
          </View>
          
          <View style={styles.permisoControls}>
            <View style={[styles.categoriaTag, { backgroundColor: categoriaStyle.backgroundColor }]}>
              <Text style={[styles.categoriaText, { color: categoriaStyle.color }]}>
                {item.categoria}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.toggleBtn, { 
                backgroundColor: item.activo ? '#10B981' : '#6B7280' 
              }]}
              onPress={() => Alert.alert('Permiso', `${item.activo ? 'Desactivar' : 'Activar'} permiso: ${item.nombre}`)}
            >
              <MaterialCommunityIcons 
                name={item.activo ? 'check' : 'close'} 
                size={16} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </View>
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
        <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
        <TouchableOpacity 
          style={styles.addBtn} 
          onPress={() => setModalVisible(true)}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#10B981" />
        </TouchableOpacity>
      </View>

      {/* Stats resumen */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{usuarios.length}</Text>
          <Text style={styles.statLabel}>Total Usuarios</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{usuarios.filter(u => u.estado === 'activo').length}</Text>
          <Text style={styles.statLabel}>Activos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{usuarios.filter(u => u.rol === 'operator').length}</Text>
          <Text style={styles.statLabel}>Operadores</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>${usuarios.reduce((sum, u) => sum + u.ventasDelMes, 0)}</Text>
          <Text style={styles.statLabel}>Ventas Totales</Text>
        </View>
      </View>

      {/* Lista de usuarios */}
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        renderItem={renderUsuario}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal Crear Usuario */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>👤 Crear Nuevo Usuario</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  value={nuevoUsuario.nombre}
                  onChangeText={(text) => setNuevoUsuario(prev => ({ ...prev, nombre: text }))}
                  placeholder="Ingrese el nombre"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Apellido</Text>
                <TextInput
                  style={styles.input}
                  value={nuevoUsuario.apellido}
                  onChangeText={(text) => setNuevoUsuario(prev => ({ ...prev, apellido: text }))}
                  placeholder="Ingrese el apellido"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={nuevoUsuario.email}
                  onChangeText={(text) => setNuevoUsuario(prev => ({ ...prev, email: text }))}
                  placeholder="usuario@ejemplo.com"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Teléfono</Text>
                <TextInput
                  style={styles.input}
                  value={nuevoUsuario.telefono}
                  onChangeText={(text) => setNuevoUsuario(prev => ({ ...prev, telefono: text }))}
                  placeholder="77712345"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Rol</Text>
                <View style={styles.rolContainer}>
                  <TouchableOpacity 
                    style={[styles.rolBtn, nuevoUsuario.rol === 'operator' && styles.rolBtnActive]}
                    onPress={() => setNuevoUsuario(prev => ({ ...prev, rol: 'operator' }))}
                  >
                    <MaterialCommunityIcons name="account" size={20} color="#1E40AF" />
                    <Text style={styles.rolBtnText}>Operador</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.rolBtn, nuevoUsuario.rol === 'admin' && styles.rolBtnActive]}
                    onPress={() => setNuevoUsuario(prev => ({ ...prev, rol: 'admin' }))}
                  >
                    <MaterialCommunityIcons name="shield-crown" size={20} color="#DC2626" />
                    <Text style={styles.rolBtnText}>Administrador</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.createBtn} onPress={crearUsuario}>
                <MaterialCommunityIcons name="account-plus" size={20} color="#FFFFFF" />
                <Text style={styles.createBtnText}>Crear Usuario</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Permisos */}
      <Modal
        visible={modalPermisos}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalPermisos(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                🛡️ Permisos - {usuarioSeleccionado?.nombre} {usuarioSeleccionado?.apellido}
              </Text>
              <TouchableOpacity onPress={() => setModalPermisos(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={permisos}
              keyExtractor={(item) => item.id}
              renderItem={renderPermiso}
              contentContainerStyle={styles.permisosContainer}
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
  addBtn: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 8,
    gap: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
  listContainer: {
    padding: 16,
  },
  usuarioCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  usuarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  usuarioInfo: {
    flex: 1,
  },
  usuarioNombre: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  usuarioEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  usuarioTelefono: {
    fontSize: 14,
    color: '#6B7280',
  },
  badges: {
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  usuarioStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  usuarioActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 4,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
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
    padding: 0,
    width: '100%',
    maxHeight: '90%',
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  rolContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  rolBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    gap: 6,
  },
  rolBtnActive: {
    backgroundColor: '#EBF8FF',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  rolBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  createBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  permisosContainer: {
    padding: 20,
  },
  permisoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  permisoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  permisoInfo: {
    flex: 1,
    marginRight: 12,
  },
  permisoNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  permisoDescripcion: {
    fontSize: 12,
    color: '#6B7280',
  },
  permisoControls: {
    alignItems: 'flex-end',
    gap: 6,
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
  toggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
