import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking, Share, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ReviewOrden'>;
type RoutePropType = RouteProp<RootStackParamList, 'ReviewOrden'>;

const tiposServicio = [
  { id: 'lavado', label: 'Lavado', icon: 'washing-machine', color: '#3B82F6' },
  { id: 'planchado', label: 'Planchado', icon: 'iron', color: '#F59E0B' },
  { id: 'otros', label: 'Otros', icon: 'cog', color: '#8B5CF6' },
];

export const ReviewOrdenScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { cliente, articulos, total } = route.params;

  const [ordenCreada, setOrdenCreada] = useState(false);
  const [codigoOrden, setCodigoOrden] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const qrRef = useRef<ViewShot>(null);

  // Calcular fecha mínima de entrega (48 horas desde ahora)
  const calcularFechaMinima = () => {
    const ahora = new Date();
    ahora.setHours(ahora.getHours() + 48);
    return ahora;
  };

  // Calcular fecha sugerida de entrega (72 horas desde ahora)
  const calcularFechaSugerida = () => {
    const ahora = new Date();
    ahora.setHours(ahora.getHours() + 72);
    return ahora;
  };

  // Inicializar con fecha recomendada
  useEffect(() => {
    setFechaEntrega(calcularFechaSugerida());
  }, []);

  // Manejar cambio de fecha
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Mantener la hora actual si ya hay una fecha seleccionada
      const newDate = new Date(selectedDate);
      if (fechaEntrega) {
        newDate.setHours(fechaEntrega.getHours());
        newDate.setMinutes(fechaEntrega.getMinutes());
      } else {
        // Si no hay fecha previa, usar hora sugerida (14:00)
        newDate.setHours(14, 0, 0, 0);
      }
      setFechaEntrega(newDate);
    }
  };

  // Manejar cambio de hora
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime && fechaEntrega) {
      const newDate = new Date(fechaEntrega);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setFechaEntrega(newDate);
    }
  };

  const generateOrdenCode = () => {
    const timestamp = new Date().getTime();
    const code = `ORD-${timestamp.toString().slice(-6)}`;
    return code;
  };

  const handleProcesarOrden = () => {
    // Validar que se haya seleccionado una fecha de entrega
    if (!fechaEntrega) {
      Alert.alert(
        'Fecha de Entrega Requerida',
        'Por favor selecciona cuándo estará lista la orden.',
        [{ text: 'Entendido' }]
      );
      return;
    }

    const codigo = generateOrdenCode();
    const fechaCreacion = new Date().toLocaleString('es-ES');
    
    // Datos de la orden para el QR
    const ordenData = {
      codigo,
      cliente: `${cliente.nombre} ${cliente.apellido}`,
      telefono: cliente.telefono,
      fecha: fechaCreacion,
      fechaEntrega: fechaEntrega.toLocaleString('es-ES'),
      articulos: articulos.length,
      total: total.toFixed(2),
      estado: 'Pendiente'
    };

    const qrData = JSON.stringify(ordenData);
    
    setCodigoOrden(codigo);
    setQrValue(qrData);
    setOrdenCreada(true);
  };

  const handleCompartirWhatsApp = async () => {
    try {
      let qrImageUri = null;
      
      // Intentar capturar el QR como imagen
      try {
        if (qrRef.current && qrRef.current.capture) {
          console.log('🎯 Intentando capturar QR...');
          qrImageUri = await qrRef.current.capture();
          console.log('✅ QR capturado exitosamente:', qrImageUri);
        }
      } catch (qrError) {
        console.log('❌ Error capturando QR:', qrError);
      }

      // Crear resumen detallado de artículos
      const articulosResumen = articulos.map((articulo, index) => {
        const servicio = tiposServicio.find(s => s.id === articulo.tipoServicio)?.label || 'Servicio';
        const subtotal = (articulo.cantidad * articulo.precio).toFixed(2);
        return `${index + 1}. ${articulo.nombre}\n   ${servicio} - ${articulo.cantidad} ${articulo.unidadCobro === 'kilo' ? 'kg' : 'und'} × $${articulo.precio} = $${subtotal}`;
      }).join('\n\n');

      const fecha = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const mensaje = `🧺 *ORDEN DE LAVANDERÍA* 🧺

¡Hola ${cliente.nombre}! 👋

Tu orden ha sido creada exitosamente:

📋 *Código:* ${codigoOrden}
📅 *Fecha de Orden:* ${fecha}
🎯 *Fecha de Entrega:* ${fechaEntrega?.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
👤 *Cliente:* ${cliente.nombre} ${cliente.apellido}
📞 *Teléfono:* ${cliente.telefono}

📦 *ARTÍCULOS (${articulos.length}):*
${articulosResumen}

💰 *TOTAL: $${total.toFixed(2)}*
📱 *Estado:* Pendiente

${qrImageUri ? '📊 *Ver código QR adjunto para seguimiento*' : '🔍 *Código QR disponible en la aplicación*'}

¡Te notificaremos cuando esté lista! ✨

---
🏪 *Lavandería Burbuja*`;
      
      // Intentar compartir con imagen del QR
      if (qrImageUri) {
        try {
          console.log('📤 Intentando compartir con imagen:', qrImageUri);
          await Share.share({
            title: 'Orden de Lavandería - Código QR',
            message: mensaje,
            url: qrImageUri,
          });
          console.log('✅ Compartido exitosamente con QR');
          return;
        } catch (shareError) {
          console.log('❌ Error compartiendo con imagen:', shareError);
        }
      }
      
      // Fallback: abrir WhatsApp directamente
      console.log('📱 Fallback: Abriendo WhatsApp directamente');
      const whatsappUrl = `https://wa.me/${cliente.telefono.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(mensaje)}`;
      
      const supported = await Linking.canOpenURL(whatsappUrl);
      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('Error', 'No se puede abrir WhatsApp. ¿Está instalado?');
      }
    } catch (error) {
      console.log('💥 Error general en compartir WhatsApp:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      Alert.alert('Error', `No se pudo compartir: ${errorMessage}`);
    }
  };

  const handleCompartirQR = async () => {
    try {
      let qrImageUri = null;
      
      // Intentar capturar el QR como imagen
      try {
        if (qrRef.current && qrRef.current.capture) {
          qrImageUri = await qrRef.current.capture();
        }
      } catch (qrError) {
        console.log('Error capturando QR para compartir:', qrError);
      }

      const mensaje = `📱 Código QR de la orden ${codigoOrden} para ${cliente.nombre} ${cliente.apellido}. Total: $${total.toFixed(2)}`;

      if (qrImageUri) {
        await Share.share({
          title: 'Código QR - Orden de Lavandería',
          message: mensaje,
          url: qrImageUri,
        });
      } else {
        await Share.share({
          message: mensaje,
          title: 'Código QR - Orden de Lavandería'
        });
      }
    } catch (error) {
      console.log('Error compartiendo QR:', error);
      Alert.alert('Error', 'No se pudo compartir el código QR');
    }
  };

  const handleImprimirQR = () => {
    Alert.alert(
      '🖨️ Imprimir QR',
      'Función de impresión disponible. Se enviará a la impresora configurada.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Imprimir',
          onPress: () => {
            // Aquí iría la lógica de impresión
            Alert.alert('✅ Éxito', 'Etiqueta enviada a impresora');
          }
        }
      ]
    );
  };

  const calcularSubtotal = (articulo: any) => {
    return articulo.precio * articulo.cantidad;
  };

  if (ordenCreada) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Dashboard')}>
            <MaterialCommunityIcons name="home" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Orden Creada</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Código de orden */}
          <View style={styles.section}>
            <View style={styles.successHeader}>
              <MaterialCommunityIcons name="check-circle" size={48} color="#059669" />
              <Text style={styles.successTitle}>¡Orden Creada Exitosamente!</Text>
              <Text style={styles.codigoOrden}>Código: {codigoOrden}</Text>
            </View>
          </View>

          {/* Código QR */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📱 Código QR de la Orden</Text>
            <View style={styles.qrContainer}>
              <ViewShot 
                ref={qrRef} 
                options={{ format: "jpg", quality: 0.9 }}
                style={{ backgroundColor: '#FFFFFF', padding: 20, borderRadius: 10 }}
              >
                <QRCode
                  value={qrValue}
                  size={200}
                  backgroundColor="#FFFFFF"
                  color="#111827"
                  logo={require('../../../assets/icon.png')}
                  logoSize={30}
                  logoBackgroundColor="transparent"
                />
              </ViewShot>
              <Text style={styles.qrHelp}>
                Escanea este código para ver los detalles de la orden
              </Text>
            </View>
          </View>

          {/* Acciones */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚀 Acciones Disponibles</Text>
            
            <TouchableOpacity style={styles.actionBtn} onPress={handleCompartirWhatsApp}>
              <View style={styles.actionIcon}>
                <MaterialCommunityIcons name="whatsapp" size={24} color="#25D366" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Enviar por WhatsApp</Text>
                <Text style={styles.actionDesc}>Compartir detalles con el cliente</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={handleCompartirQR}>
              <View style={styles.actionIcon}>
                <MaterialCommunityIcons name="share-variant" size={24} color="#3B82F6" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Compartir QR</Text>
                <Text style={styles.actionDesc}>Enviar código QR por otras apps</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={handleImprimirQR}>
              <View style={styles.actionIcon}>
                <MaterialCommunityIcons name="printer" size={24} color="#8B5CF6" />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Imprimir Etiqueta</Text>
                <Text style={styles.actionDesc}>Etiquetar ropa con código QR</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Resumen de la orden */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Resumen de la Orden</Text>
            
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Cliente:</Text>
                <Text style={styles.summaryValue}>{cliente.nombre} {cliente.apellido}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Teléfono:</Text>
                <Text style={styles.summaryValue}>{cliente.telefono}</Text>
              </View>
              
              {fechaEntrega && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Entrega:</Text>
                  <Text style={styles.summaryValue}>
                    {fechaEntrega.toLocaleDateString('es-ES', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
              )}
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Artículos:</Text>
                <Text style={styles.summaryValue}>{articulos.length} prendas</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total:</Text>
                <Text style={styles.summaryTotal}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.nuevoBtn} 
            onPress={() => navigation.navigate('SelectCliente')}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
            <Text style={styles.nuevoBtnText}>Nueva Orden</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Revisar Orden</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Indicador de progreso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={[styles.progressCircle, styles.progressCircleCompleted]}>
            <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.progressLabel}>Cliente</Text>
        </View>
        
        <View style={[styles.progressLine, styles.progressLineActive]} />
        
        <View style={styles.progressStep}>
          <View style={[styles.progressCircle, styles.progressCircleCompleted]}>
            <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.progressLabel}>Artículos</Text>
        </View>

        <View style={[styles.progressLine, styles.progressLineActive]} />
        
        <View style={styles.progressStep}>
          <View style={[styles.progressCircle, styles.progressCircleActive]}>
            <Text style={[styles.progressText, styles.progressTextActive]}>3</Text>
          </View>
          <Text style={styles.progressLabel}>Revisar</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Datos del cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Datos del Cliente</Text>
          <View style={styles.clienteCard}>
            <View style={styles.clienteHeader}>
              <MaterialCommunityIcons name="account" size={24} color="#3B82F6" />
              <Text style={styles.clienteNombre}>{cliente.nombre} {cliente.apellido}</Text>
            </View>
            <View style={styles.clienteDetails}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="phone" size={16} color="#6B7280" />
                <Text style={styles.detailText}>{cliente.telefono}</Text>
              </View>
              {cliente.direccion && (
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="map-marker" size={16} color="#6B7280" />
                  <Text style={styles.detailText}>{cliente.direccion}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Resumen de artículos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧺 Resumen de Artículos ({articulos.length})</Text>
          
          {articulos.map((item, index) => (
            <View key={item.id} style={styles.articuloItem}>
              <View style={styles.articuloHeader}>
                <Text style={styles.articuloNombre}>{item.nombre}</Text>
                <Text style={styles.articuloSubtotal}>
                  ${calcularSubtotal(item).toFixed(2)}
                </Text>
              </View>
              <View style={styles.articuloDetails}>
                <View style={styles.articuloTag}>
                  <MaterialCommunityIcons 
                    name={tiposServicio.find(s => s.id === item.tipoServicio)?.icon as any} 
                    size={14} 
                    color="#6B7280" 
                  />
                  <Text style={styles.tagText}>
                    {tiposServicio.find(s => s.id === item.tipoServicio)?.label}
                  </Text>
                </View>
                <Text style={styles.articuloDetalle}>
                  {item.cantidad} {item.unidadCobro === 'kilo' ? 'kg' : 'und'} × ${item.precio}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Fecha de entrega */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Fecha de Entrega</Text>
          
          <View style={styles.fechaContainer}>
            <Text style={styles.fechaLabel}>Selecciona cuándo estará lista:</Text>
            
            {/* Opciones rápidas */}
            <View style={styles.opcionesRapidas}>
              <TouchableOpacity
                style={styles.opcionRapida}
                onPress={() => setFechaEntrega(calcularFechaMinima())}
              >
                <MaterialCommunityIcons name="clock-fast" size={16} color="#F59E0B" />
                <Text style={styles.opcionRapidaText}>48h (Express)</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.opcionRapida}
                onPress={() => setFechaEntrega(calcularFechaSugerida())}
              >
                <MaterialCommunityIcons name="star" size={16} color="#059669" />
                <Text style={styles.opcionRapidaText}>72h (Recomendado)</Text>
              </TouchableOpacity>
            </View>

            {/* Selectores de fecha y hora */}
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <MaterialCommunityIcons name="calendar" size={20} color="#3B82F6" />
                <View style={styles.dateTimeText}>
                  <Text style={styles.dateTimeLabel}>Fecha</Text>
                  <Text style={styles.dateTimeValue}>
                    {fechaEntrega?.toLocaleDateString('es-ES', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }) || 'Seleccionar fecha'}
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#6B7280" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <MaterialCommunityIcons name="clock" size={20} color="#3B82F6" />
                <View style={styles.dateTimeText}>
                  <Text style={styles.dateTimeLabel}>Hora</Text>
                  <Text style={styles.dateTimeValue}>
                    {fechaEntrega?.toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }) || 'Seleccionar hora'}
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {fechaEntrega && (
              <View style={styles.fechaSeleccionada}>
                <MaterialCommunityIcons name="calendar-check" size={16} color="#059669" />
                <Text style={styles.fechaSeleccionadaTexto}>
                  Entrega programada: {fechaEntrega.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            )}

            {/* DateTimePickers */}
            {showDatePicker && (
              <DateTimePicker
                value={fechaEntrega || calcularFechaSugerida()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                minimumDate={calcularFechaMinima()}
                onChange={handleDateChange}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={fechaEntrega || calcularFechaSugerida()}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
              />
            )}
          </View>
        </View>

        {/* Totales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Resumen de Costos</Text>
          
          <View style={styles.totalesContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Descuentos:</Text>
              <Text style={styles.totalValue}>$0.00</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.totalRow}>
              <Text style={styles.totalFinalLabel}>Total a Pagar:</Text>
              <Text style={styles.totalFinalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Espacio para el footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.procesarBtn} onPress={handleProcesarOrden}>
          <MaterialCommunityIcons name="qrcode" size={24} color="#FFFFFF" />
          <Text style={styles.procesarBtnText}>Procesar Orden</Text>
        </TouchableOpacity>
      </View>
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
    width: 32,
    height: 32,
    borderRadius: 16,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressTextActive: {
    color: '#FFFFFF',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  progressLineActive: {
    backgroundColor: '#059669',
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
    marginBottom: 16,
  },
  clienteCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
  },
  clienteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  clienteNombre: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
  },
  clienteDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
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
    marginBottom: 8,
  },
  articuloNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  articuloSubtotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  articuloDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articuloTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  articuloDetalle: {
    fontSize: 14,
    color: '#6B7280',
  },
  totalesContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalFinalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  totalFinalValue: {
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
  procesarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  procesarBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  successHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  codigoOrden: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  qrHelp: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    maxWidth: 200,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  orderSummary: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  nuevoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  nuevoBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  // Estilos para fecha de entrega
  fechaContainer: {
    gap: 16,
  },
  fechaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  opcionesRapidas: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  opcionRapida: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  opcionRapidaText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  dateTimeContainer: {
    gap: 12,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  dateTimeText: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  fechaSeleccionada: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 8,
    padding: 12,
    gap: 8,
    marginTop: 16,
  },
  fechaSeleccionadaTexto: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
    flex: 1,
  },
});
