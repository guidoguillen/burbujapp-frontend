import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, TextInput, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { whatsappApiService, WhatsAppTemplate } from '../../services/WhatsAppApiService';

type NavigationProp = StackNavigationProp<RootStackParamList, 'WhatsAppTemplates'>;

interface TemplateComponent {
  type: 'header' | 'body' | 'footer' | 'buttons';
  format?: 'text' | 'image' | 'video' | 'document';
  text?: string;
  example?: object;
}

export const WhatsAppTemplatesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>('all');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('all');
  
  // Modal para crear/editar plantilla
  const [modalVisible, setModalVisible] = useState(false);
  const [plantillaEditando, setPlantillaEditando] = useState<Partial<WhatsAppTemplate> | null>(null);
  const [nombrePlantilla, setNombrePlantilla] = useState('');
  const [categoriaPlantilla, setCategoriaPlantilla] = useState<'marketing' | 'utility' | 'authentication'>('utility');
  const [componentes, setComponentes] = useState<TemplateComponent[]>([
    { type: 'body', text: '' }
  ]);

  useEffect(() => {
    cargarPlantillas();
  }, [filtroEstado, filtroCategoria]);

  const cargarPlantillas = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (filtroEstado !== 'all') filters.status = filtroEstado;
      if (filtroCategoria !== 'all') filters.category = filtroCategoria;
      
      const response = await whatsappApiService.getTemplates(filters);
      
      if (response.success && response.data) {
        setTemplates(response.data);
      } else {
        Alert.alert('Error', response.error || 'No se pudieron cargar las plantillas');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al cargar las plantillas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const actualizarPlantillas = async () => {
    setRefreshing(true);
    await cargarPlantillas();
  };

  const abrirModalCrear = () => {
    setPlantillaEditando(null);
    setNombrePlantilla('');
    setCategoriaPlantilla('utility');
    setComponentes([{ type: 'body', text: '' }]);
    setModalVisible(true);
  };

  const abrirModalEditar = (plantilla: WhatsAppTemplate) => {
    setPlantillaEditando(plantilla);
    setNombrePlantilla(plantilla.name);
    setCategoriaPlantilla(plantilla.category);
    setComponentes(plantilla.components || [{ type: 'body', text: '' }]);
    setModalVisible(true);
  };

  const crearPlantilla = async () => {
    if (!nombrePlantilla.trim()) {
      Alert.alert('Error', 'El nombre de la plantilla es requerido');
      return;
    }

    if (!componentes.some(c => c.type === 'body' && c.text?.trim())) {
      Alert.alert('Error', 'El cuerpo del mensaje es requerido');
      return;
    }

    try {
      const templateData: Partial<WhatsAppTemplate> = {
        name: nombrePlantilla.toLowerCase().replace(/\s+/g, '_'),
        category: categoriaPlantilla,
        language: 'es',
        components: componentes.filter(c => c.text?.trim())
      };

      const response = await whatsappApiService.createTemplate(templateData);

      if (response.success) {
        Alert.alert('Éxito', 'Plantilla enviada para aprobación a Meta');
        setModalVisible(false);
        cargarPlantillas();
      } else {
        Alert.alert('Error', response.error || 'No se pudo crear la plantilla');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al crear la plantilla');
    }
  };

  const agregarComponente = (tipo: 'header' | 'footer') => {
    const nuevoComponente: TemplateComponent = { type: tipo, text: '' };
    setComponentes(prev => [...prev, nuevoComponente]);
  };

  const actualizarComponente = (index: number, texto: string) => {
    setComponentes(prev => prev.map((comp, i) => 
      i === index ? { ...comp, text: texto } : comp
    ));
  };

  const eliminarComponente = (index: number) => {
    if (componentes[index].type === 'body') {
      Alert.alert('Error', 'No se puede eliminar el cuerpo del mensaje');
      return;
    }
    setComponentes(prev => prev.filter((_, i) => i !== index));
  };

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'approved': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'rejected': return '#F44336';
      default: return '#666';
    }
  };

  const obtenerIconoEstado = (estado: string) => {
    switch (estado) {
      case 'approved': return 'check-circle';
      case 'pending': return 'clock-outline';
      case 'rejected': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const obtenerColorCategoria = (categoria: string) => {
    switch (categoria) {
      case 'marketing': return '#E91E63';
      case 'utility': return '#2196F3';
      case 'authentication': return '#FF5722';
      default: return '#666';
    }
  };

  const renderTemplate = (template: WhatsAppTemplate) => (
    <TouchableOpacity 
      key={template.id} 
      style={styles.templateCard}
      onPress={() => abrirModalEditar(template)}
    >
      <View style={styles.templateHeader}>
        <View style={styles.templateInfo}>
          <Text style={styles.templateName}>{template.name}</Text>
          <View style={styles.templateLabels}>
            <View style={[styles.categoryBadge, { backgroundColor: obtenerColorCategoria(template.category) }]}>
              <Text style={styles.categoryText}>{template.category}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: obtenerColorEstado(template.status) }]}>
              <MaterialCommunityIcons 
                name={obtenerIconoEstado(template.status) as any} 
                size={12} 
                color="white" 
              />
              <Text style={styles.statusText}>{template.status}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <MaterialCommunityIcons name="pencil" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.templatePreview}>
        {template.components.map((component, index) => (
          <View key={index} style={styles.componentPreview}>
            {component.type === 'header' && (
              <Text style={styles.headerText}>{component.text}</Text>
            )}
            {component.type === 'body' && (
              <Text style={styles.bodyText}>{component.text}</Text>
            )}
            {component.type === 'footer' && (
              <Text style={styles.footerText}>{component.text}</Text>
            )}
          </View>
        ))}
      </View>

      <View style={styles.templateFooter}>
        <Text style={styles.templateDate}>
          Creada: {new Date(template.createdAt).toLocaleDateString('es-BO')}
        </Text>
        <Text style={styles.templateLanguage}>Idioma: {template.language}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#25D366" />
        <Text style={styles.loadingText}>Cargando plantillas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plantillas WhatsApp</Text>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={abrirModalCrear}
        >
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Estado:</Text>
            {['all', 'approved', 'pending', 'rejected'].map(estado => (
              <TouchableOpacity
                key={estado}
                style={[
                  styles.filterChip,
                  filtroEstado === estado && styles.filterChipActive
                ]}
                onPress={() => setFiltroEstado(estado)}
              >
                <Text style={[
                  styles.filterChipText,
                  filtroEstado === estado && styles.filterChipTextActive
                ]}>
                  {estado === 'all' ? 'Todos' : estado}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Categoría:</Text>
            {['all', 'marketing', 'utility', 'authentication'].map(categoria => (
              <TouchableOpacity
                key={categoria}
                style={[
                  styles.filterChip,
                  filtroCategoria === categoria && styles.filterChipActive
                ]}
                onPress={() => setFiltroCategoria(categoria)}
              >
                <Text style={[
                  styles.filterChipText,
                  filtroCategoria === categoria && styles.filterChipTextActive
                ]}>
                  {categoria === 'all' ? 'Todas' : categoria}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Lista de plantillas */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={actualizarPlantillas}
            colors={['#25D366']}
          />
        }
      >
        {templates.length > 0 ? (
          templates.map(renderTemplate)
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="file-document-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>No hay plantillas</Text>
            <Text style={styles.emptySubtitle}>
              Crea tu primera plantilla para enviar mensajes personalizados
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={abrirModalCrear}
            >
              <Text style={styles.emptyButtonText}>Crear Plantilla</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal para crear/editar plantilla */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {plantillaEditando ? 'Editar Plantilla' : 'Nueva Plantilla'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Nombre de la plantilla */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nombre de la Plantilla</Text>
                <TextInput
                  style={styles.textInput}
                  value={nombrePlantilla}
                  onChangeText={setNombrePlantilla}
                  placeholder="ej: confirmacion_orden"
                />
              </View>

              {/* Categoría */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Categoría</Text>
                <View style={styles.categorySelector}>
                  {(['marketing', 'utility', 'authentication'] as const).map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryOption,
                        categoriaPlantilla === cat && styles.categoryOptionActive
                      ]}
                      onPress={() => setCategoriaPlantilla(cat)}
                    >
                      <Text style={[
                        styles.categoryOptionText,
                        categoriaPlantilla === cat && styles.categoryOptionTextActive
                      ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Componentes */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contenido del Mensaje</Text>
                
                {componentes.map((componente, index) => (
                  <View key={index} style={styles.componentInput}>
                    <View style={styles.componentHeader}>
                      <Text style={styles.componentLabel}>
                        {componente.type === 'header' ? 'Encabezado' :
                         componente.type === 'body' ? 'Cuerpo' : 'Pie de página'}
                        {componente.type === 'body' && <Text style={styles.required}> *</Text>}
                      </Text>
                      {componente.type !== 'body' && (
                        <TouchableOpacity onPress={() => eliminarComponente(index)}>
                          <MaterialCommunityIcons name="delete-outline" size={20} color="#F44336" />
                        </TouchableOpacity>
                      )}
                    </View>
                    <TextInput
                      style={[styles.textInput, styles.multilineInput]}
                      value={componente.text}
                      onChangeText={(text) => actualizarComponente(index, text)}
                      placeholder={
                        componente.type === 'header' ? 'Encabezado del mensaje' :
                        componente.type === 'body' ? 'Contenido principal (usa {{1}}, {{2}} para variables)' :
                        'Pie de página'
                      }
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                ))}

                <View style={styles.addComponentButtons}>
                  {!componentes.some(c => c.type === 'header') && (
                    <TouchableOpacity 
                      style={styles.addComponentButton}
                      onPress={() => agregarComponente('header')}
                    >
                      <MaterialCommunityIcons name="plus" size={16} color="#4CAF50" />
                      <Text style={styles.addComponentText}>Agregar Encabezado</Text>
                    </TouchableOpacity>
                  )}
                  
                  {!componentes.some(c => c.type === 'footer') && (
                    <TouchableOpacity 
                      style={styles.addComponentButton}
                      onPress={() => agregarComponente('footer')}
                    >
                      <MaterialCommunityIcons name="plus" size={16} color="#4CAF50" />
                      <Text style={styles.addComponentText}>Agregar Pie de Página</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Información */}
              <View style={styles.infoBox}>
                <MaterialCommunityIcons name="information-outline" size={20} color="#2196F3" />
                <Text style={styles.infoText}>
                  Las plantillas deben ser aprobadas por Meta antes de usarse. 
                  Usa {'{{'} {'1}'} {'}}'}, {'{{'} {'2}'} {'}}'} para variables dinámicas.
                </Text>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={crearPlantilla}
              >
                <Text style={styles.saveButtonText}>
                  {plantillaEditando ? 'Actualizar' : 'Crear Plantilla'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#25D366',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#25D366',
  },
  filterChipText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  filterChipTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  templateCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  templateLabels: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  editButton: {
    padding: 4,
  },
  templatePreview: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  componentPreview: {
    marginBottom: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  templateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateDate: {
    fontSize: 12,
    color: '#666',
  },
  templateLanguage: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 32,
  },
  emptyButton: {
    backgroundColor: '#25D366',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 16,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    maxHeight: 400,
    paddingHorizontal: 16,
  },
  inputGroup: {
    marginVertical: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#F44336',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  categoryOptionActive: {
    backgroundColor: '#25D366',
  },
  categoryOptionText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  categoryOptionTextActive: {
    color: 'white',
  },
  componentInput: {
    marginBottom: 16,
  },
  componentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  componentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  addComponentButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  addComponentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
    gap: 6,
  },
  addComponentText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#1565C0',
    lineHeight: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#25D366',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});
