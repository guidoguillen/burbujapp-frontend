import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FiltrosBusqueda } from '../../services/BusquedaAvanzadaService';

const { width } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
  onAplicar: (filtros: FiltrosBusqueda) => void;
  filtrosIniciales?: Partial<FiltrosBusqueda>;
  tipo: 'ordenes' | 'clientes' | 'turnos';
}

const ESTADOS_ORDEN = [
  { value: 'pendiente', label: 'Pendiente', color: '#F59E0B' },
  { value: 'en_proceso', label: 'En Proceso', color: '#3B82F6' },
  { value: 'completada', label: 'Completada', color: '#059669' },
  { value: 'entregada', label: 'Entregada', color: '#8B5CF6' },
  { value: 'cancelada', label: 'Cancelada', color: '#EF4444' },
];

const TIPOS_SERVICIO = [
  { value: 'lavado', label: 'Lavado', icon: 'washing-machine' },
  { value: 'planchado', label: 'Planchado', icon: 'iron' },
  { value: 'limpieza_seco', label: 'Limpieza en Seco', icon: 'tuxedo' },
  { value: 'especiales', label: 'Especiales', icon: 'star' },
];

const OPCIONES_ORDEN = [
  { value: 'fecha', label: 'Fecha' },
  { value: 'precio', label: 'Precio' },
  { value: 'cliente', label: 'Cliente' },
  { value: 'estado', label: 'Estado' },
];

export const FiltrosBusquedaModal: React.FC<Props> = ({
  visible,
  onClose,
  onAplicar,
  filtrosIniciales = {},
  tipo,
}) => {
  const [filtros, setFiltros] = useState<FiltrosBusqueda>({
    texto: '',
    ordenarPor: 'fecha',
    direccionOrden: 'desc',
    ...filtrosIniciales,
  });

  const [mostrarFechaInicio, setMostrarFechaInicio] = useState(false);
  const [mostrarFechaFin, setMostrarFechaFin] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<string>('general');

  useEffect(() => {
    if (visible) {
      setFiltros({
        texto: '',
        ordenarPor: 'fecha',
        direccionOrden: 'desc',
        ...filtrosIniciales,
      });
    }
  }, [visible, filtrosIniciales]);

  const actualizarFiltro = (campo: keyof FiltrosBusqueda, valor: any) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const toggleEstado = (estado: string) => {
    const estadosActuales = filtros.estado || [];
    const nuevosEstados = estadosActuales.includes(estado)
      ? estadosActuales.filter(e => e !== estado)
      : [...estadosActuales, estado];
    
    actualizarFiltro('estado', nuevosEstados);
  };

  const toggleServicio = (servicio: string) => {
    const serviciosActuales = filtros.servicio || [];
    const nuevosServicios = serviciosActuales.includes(servicio)
      ? serviciosActuales.filter(s => s !== servicio)
      : [...serviciosActuales, servicio];
    
    actualizarFiltro('servicio', nuevosServicios);
  };

  const limpiarFiltros = () => {
    setFiltros({
      texto: '',
      ordenarPor: 'fecha',
      direccionOrden: 'desc',
    });
  };

  const contarFiltrosActivos = (): number => {
    let count = 0;
    if (filtros.texto?.trim()) count++;
    if (filtros.fechaInicio || filtros.fechaFin) count++;
    if (filtros.estado?.length) count++;
    if (filtros.cliente?.trim()) count++;
    if (filtros.servicio?.length) count++;
    if (filtros.precioMin !== undefined || filtros.precioMax !== undefined) count++;
    return count;
  };

  const renderSeccionGeneral = () => (
    <View style={styles.seccion}>
      <Text style={styles.seccionTitulo}>Búsqueda General</Text>
      
      <View style={styles.campo}>
        <Text style={styles.etiqueta}>Texto de búsqueda</Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Buscar en todos los campos..."
            value={filtros.texto}
            onChangeText={(text) => actualizarFiltro('texto', text)}
          />
        </View>
      </View>

      {tipo === 'ordenes' && (
        <View style={styles.campo}>
          <Text style={styles.etiqueta}>Cliente específico</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="account" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Nombre o teléfono del cliente"
              value={filtros.cliente || ''}
              onChangeText={(text) => actualizarFiltro('cliente', text)}
            />
          </View>
        </View>
      )}
    </View>
  );

  const renderSeccionFechas = () => (
    <View style={styles.seccion}>
      <Text style={styles.seccionTitulo}>Rango de Fechas</Text>
      
      <View style={styles.fechasContainer}>
        <View style={styles.fechaCampo}>
          <Text style={styles.etiqueta}>Desde</Text>
          <TouchableOpacity
            style={styles.fechaButton}
            onPress={() => setMostrarFechaInicio(true)}
          >
            <MaterialCommunityIcons name="calendar" size={20} color="#3B82F6" />
            <Text style={styles.fechaTexto}>
              {filtros.fechaInicio ? 
                filtros.fechaInicio.toLocaleDateString('es-ES') : 
                'Seleccionar'
              }
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fechaCampo}>
          <Text style={styles.etiqueta}>Hasta</Text>
          <TouchableOpacity
            style={styles.fechaButton}
            onPress={() => setMostrarFechaFin(true)}
          >
            <MaterialCommunityIcons name="calendar" size={20} color="#3B82F6" />
            <Text style={styles.fechaTexto}>
              {filtros.fechaFin ? 
                filtros.fechaFin.toLocaleDateString('es-ES') : 
                'Seleccionar'
              }
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {(filtros.fechaInicio || filtros.fechaFin) && (
        <TouchableOpacity
          style={styles.limpiarFechasButton}
          onPress={() => {
            actualizarFiltro('fechaInicio', undefined);
            actualizarFiltro('fechaFin', undefined);
          }}
        >
          <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
          <Text style={styles.limpiarFechasTexto}>Limpiar fechas</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSeccionEstados = () => (
    <View style={styles.seccion}>
      <Text style={styles.seccionTitulo}>Estados</Text>
      <View style={styles.opcionesContainer}>
        {ESTADOS_ORDEN.map(estado => (
          <TouchableOpacity
            key={estado.value}
            style={[
              styles.opcionChip,
              (filtros.estado || []).includes(estado.value) && styles.opcionChipActivo,
              { borderColor: estado.color }
            ]}
            onPress={() => toggleEstado(estado.value)}
          >
            <View style={[styles.estadoIndicador, { backgroundColor: estado.color }]} />
            <Text
              style={[
                styles.opcionTexto,
                (filtros.estado || []).includes(estado.value) && styles.opcionTextoActivo,
              ]}
            >
              {estado.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSeccionServicios = () => (
    <View style={styles.seccion}>
      <Text style={styles.seccionTitulo}>Tipos de Servicio</Text>
      <View style={styles.opcionesContainer}>
        {TIPOS_SERVICIO.map(servicio => (
          <TouchableOpacity
            key={servicio.value}
            style={[
              styles.opcionChip,
              (filtros.servicio || []).includes(servicio.value) && styles.opcionChipActivo,
            ]}
            onPress={() => toggleServicio(servicio.value)}
          >
            <MaterialCommunityIcons 
              name={servicio.icon as any} 
              size={16} 
              color={(filtros.servicio || []).includes(servicio.value) ? '#3B82F6' : '#6B7280'} 
            />
            <Text
              style={[
                styles.opcionTexto,
                (filtros.servicio || []).includes(servicio.value) && styles.opcionTextoActivo,
              ]}
            >
              {servicio.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSeccionPrecios = () => (
    <View style={styles.seccion}>
      <Text style={styles.seccionTitulo}>Rango de Precios</Text>
      
      <View style={styles.preciosContainer}>
        <View style={styles.precioCampo}>
          <Text style={styles.etiqueta}>Mínimo</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="currency-usd" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="0.00"
              value={filtros.precioMin?.toString() || ''}
              onChangeText={(text) => actualizarFiltro('precioMin', text ? parseFloat(text) : undefined)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.precioCampo}>
          <Text style={styles.etiqueta}>Máximo</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="currency-usd" size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="999.99"
              value={filtros.precioMax?.toString() || ''}
              onChangeText={(text) => actualizarFiltro('precioMax', text ? parseFloat(text) : undefined)}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderSeccionOrdenamiento = () => (
    <View style={styles.seccion}>
      <Text style={styles.seccionTitulo}>Ordenamiento</Text>
      
      <View style={styles.campo}>
        <Text style={styles.etiqueta}>Ordenar por</Text>
        <View style={styles.opcionesContainer}>
          {OPCIONES_ORDEN.map(opcion => (
            <TouchableOpacity
              key={opcion.value}
              style={[
                styles.opcionChip,
                filtros.ordenarPor === opcion.value && styles.opcionChipActivo,
              ]}
              onPress={() => actualizarFiltro('ordenarPor', opcion.value)}
            >
              <Text
                style={[
                  styles.opcionTexto,
                  filtros.ordenarPor === opcion.value && styles.opcionTextoActivo,
                ]}
              >
                {opcion.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.campo}>
        <View style={styles.direccionContainer}>
          <Text style={styles.etiqueta}>Dirección</Text>
          <View style={styles.direccionButtons}>
            <TouchableOpacity
              style={[
                styles.direccionButton,
                filtros.direccionOrden === 'asc' && styles.direccionButtonActivo,
              ]}
              onPress={() => actualizarFiltro('direccionOrden', 'asc')}
            >
              <MaterialCommunityIcons name="arrow-up" size={16} color={filtros.direccionOrden === 'asc' ? '#fff' : '#6B7280'} />
              <Text style={[
                styles.direccionTexto,
                filtros.direccionOrden === 'asc' && styles.direccionTextoActivo,
              ]}>
                Ascendente
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.direccionButton,
                filtros.direccionOrden === 'desc' && styles.direccionButtonActivo,
              ]}
              onPress={() => actualizarFiltro('direccionOrden', 'desc')}
            >
              <MaterialCommunityIcons name="arrow-down" size={16} color={filtros.direccionOrden === 'desc' ? '#fff' : '#6B7280'} />
              <Text style={[
                styles.direccionTexto,
                filtros.direccionOrden === 'desc' && styles.direccionTextoActivo,
              ]}>
                Descendente
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderNavegacion = () => {
    const secciones = [
      { id: 'general', label: 'General', icon: 'magnify' },
      { id: 'fechas', label: 'Fechas', icon: 'calendar' },
      ...(tipo === 'ordenes' ? [
        { id: 'estados', label: 'Estados', icon: 'flag' },
        { id: 'servicios', label: 'Servicios', icon: 'cog' },
        { id: 'precios', label: 'Precios', icon: 'currency-usd' },
      ] : []),
      { id: 'orden', label: 'Orden', icon: 'sort' },
    ];

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navegacion}>
        {secciones.map(seccion => (
          <TouchableOpacity
            key={seccion.id}
            style={[
              styles.navegacionItem,
              seccionActiva === seccion.id && styles.navegacionItemActivo,
            ]}
            onPress={() => setSeccionActiva(seccion.id)}
          >
            <MaterialCommunityIcons 
              name={seccion.icon as any} 
              size={16} 
              color={seccionActiva === seccion.id ? '#3B82F6' : '#6B7280'} 
            />
            <Text
              style={[
                styles.navegacionTexto,
                seccionActiva === seccion.id && styles.navegacionTextoActivo,
              ]}
            >
              {seccion.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderContenido = () => {
    switch (seccionActiva) {
      case 'general':
        return renderSeccionGeneral();
      case 'fechas':
        return renderSeccionFechas();
      case 'estados':
        return renderSeccionEstados();
      case 'servicios':
        return renderSeccionServicios();
      case 'precios':
        return renderSeccionPrecios();
      case 'orden':
        return renderSeccionOrdenamiento();
      default:
        return renderSeccionGeneral();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.titulo}>
            Filtros Avanzados
            {contarFiltrosActivos() > 0 && (
              <Text style={styles.contadorFiltros}> ({contarFiltrosActivos()})</Text>
            )}
          </Text>
          <TouchableOpacity onPress={limpiarFiltros}>
            <Text style={styles.limpiarTexto}>Limpiar</Text>
          </TouchableOpacity>
        </View>

        {renderNavegacion()}

        <ScrollView style={styles.contenido}>
          {renderContenido()}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.botonSecundario}
            onPress={onClose}
          >
            <Text style={styles.textoBotonSecundario}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botonPrimario}
            onPress={() => {
              onAplicar(filtros);
              onClose();
            }}
          >
            <Text style={styles.textoBotonPrimario}>Aplicar Filtros</Text>
          </TouchableOpacity>
        </View>

        {mostrarFechaInicio && (
          <DateTimePicker
            value={filtros.fechaInicio || new Date()}
            mode="date"
            display="default"
            onChange={(event: any, selectedDate: any) => {
              setMostrarFechaInicio(false);
              if (selectedDate) {
                actualizarFiltro('fechaInicio', selectedDate);
              }
            }}
          />
        )}

        {mostrarFechaFin && (
          <DateTimePicker
            value={filtros.fechaFin || new Date()}
            mode="date"
            display="default"
            onChange={(event: any, selectedDate: any) => {
              setMostrarFechaFin(false);
              if (selectedDate) {
                actualizarFiltro('fechaFin', selectedDate);
              }
            }}
          />
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  contadorFiltros: {
    color: '#3B82F6',
    fontSize: 16,
  },
  limpiarTexto: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },
  navegacion: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  navegacionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  navegacionItemActivo: {
    backgroundColor: '#EBF8FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  navegacionTexto: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  navegacionTextoActivo: {
    color: '#3B82F6',
  },
  contenido: {
    flex: 1,
    paddingHorizontal: 16,
  },
  seccion: {
    paddingVertical: 16,
  },
  seccionTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  campo: {
    marginBottom: 16,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1F2937',
  },
  fechasContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  fechaCampo: {
    flex: 1,
  },
  fechaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  fechaTexto: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1F2937',
  },
  limpiarFechasButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  limpiarFechasTexto: {
    marginLeft: 4,
    fontSize: 12,
    color: '#EF4444',
  },
  opcionesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  opcionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  opcionChipActivo: {
    backgroundColor: '#EBF8FF',
    borderColor: '#3B82F6',
  },
  opcionTexto: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginLeft: 4,
  },
  opcionTextoActivo: {
    color: '#3B82F6',
  },
  estadoIndicador: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  preciosContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  precioCampo: {
    flex: 1,
  },
  direccionContainer: {
    marginTop: 8,
  },
  direccionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  direccionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  direccionButtonActivo: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  direccionTexto: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  direccionTextoActivo: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  botonSecundario: {
    flex: 1,
    paddingVertical: 12,
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
    flex: 2,
    paddingVertical: 12,
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
