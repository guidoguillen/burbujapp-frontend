import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const WhatsAppConfigScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración WhatsApp</Text>
      </View>

      <View style={styles.content}>
        <MaterialCommunityIcons name="cog-outline" size={80} color="#25D366" />
        <Text style={styles.title}>Configuración WhatsApp Business</Text>
        <Text style={styles.subtitle}>Próximamente: Configuración de API y webhook</Text>
      </View>
    </View>
  );
};

export const WhatsAppContactsScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contactos WhatsApp</Text>
      </View>

      <View style={styles.content}>
        <MaterialCommunityIcons name="contacts-outline" size={80} color="#25D366" />
        <Text style={styles.title}>Gestión de Contactos</Text>
        <Text style={styles.subtitle}>Próximamente: Importar/exportar contactos y segmentación</Text>
      </View>
    </View>
  );
};

export const WhatsAppCampaignsScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Campañas WhatsApp</Text>
      </View>

      <View style={styles.content}>
        <MaterialCommunityIcons name="bullhorn-outline" size={80} color="#25D366" />
        <Text style={styles.title}>Campañas y Mensajería Masiva</Text>
        <Text style={styles.subtitle}>Próximamente: Creador de campañas y programación de envíos</Text>
      </View>
    </View>
  );
};

export const WhatsAppAutomationScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Automatización WhatsApp</Text>
      </View>

      <View style={styles.content}>
        <MaterialCommunityIcons name="robot-outline" size={80} color="#25D366" />
        <Text style={styles.title}>Automatización y Chatbots</Text>
        <Text style={styles.subtitle}>Próximamente: Flujos automatizados y respuestas inteligentes</Text>
      </View>
    </View>
  );
};

export const WhatsAppAnalyticsScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Análíticas WhatsApp</Text>
      </View>

      <View style={styles.content}>
        <MaterialCommunityIcons name="chart-line" size={80} color="#25D366" />
        <Text style={styles.title}>Análíticas y Reportes</Text>
        <Text style={styles.subtitle}>Próximamente: Métricas detalladas y dashboards interactivos</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
});
