import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/context/AuthContext';
import { initializeServices, showEnvironmentInfo } from './src/utils/ServiceInitializer';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { DashboardScreen } from './src/screens/dashboard/DashboardScreen';
import { SelectClienteScreen } from './src/screens/orders/SelectClienteScreen';
import { SelectArticulosScreen } from './src/screens/orders/SelectArticulosScreen';
import { ReviewOrdenScreen } from './src/screens/orders/ReviewOrdenScreen';
import { MisOrdenesScreen } from './src/screens/orders/MisOrdenesScreen';
import { DetalleOrdenScreen } from './src/screens/orders/DetalleOrdenScreen';
import { TurnoScreen } from './src/screens/scheduling/TurnoScreen';
import { MisTurnosScreen } from './src/screens/scheduling/MisTurnosScreen';
import { HistorialTurnosScreen } from './src/screens/scheduling/HistorialTurnosScreen';
import { GestionUsuariosScreen } from './src/screens/admin/GestionUsuariosScreen';
import { ControlFinancieroScreen } from './src/screens/admin/ControlFinancieroScreen';
import { ReportesAnalyticsScreen } from './src/screens/admin/ReportesAnalyticsScreen';
import { ConfiguracionSistemaScreen } from './src/screens/admin/ConfiguracionSistemaScreen';
import { FuncionesAvanzadasScreen } from './src/screens/admin/FuncionesAvanzadasScreen';
import { ActividadLogsScreen } from './src/screens/admin/ActividadLogsScreen';
import { GestionHorariosScreen } from './src/screens/admin/GestionHorariosScreen';
import { GestionPermisosScreen } from './src/screens/admin/GestionPermisosScreen';
import { WhatsAppAdminScreen } from './src/screens/admin/WhatsAppAdminScreen';
import { WhatsAppTemplatesScreen } from './src/screens/admin/WhatsAppTemplatesScreen';
import { 
  WhatsAppConfigScreen, 
  WhatsAppContactsScreen, 
  WhatsAppCampaignsScreen, 
  WhatsAppAutomationScreen, 
  WhatsAppAnalyticsScreen 
} from './src/screens/admin/WhatsAppOtherScreens';
import { View, Text } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  // Inicializar servicios al cargar la app
  useEffect(() => {
    const init = async () => {
      showEnvironmentInfo();
      await initializeServices();
    };
    
    init();
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="SelectCliente" component={SelectClienteScreen} />
          <Stack.Screen name="SelectArticulos" component={SelectArticulosScreen} />
          <Stack.Screen name="ReviewOrden" component={ReviewOrdenScreen} />
          <Stack.Screen name="MisOrdenes" component={MisOrdenesScreen} />
          <Stack.Screen name="DetalleOrden" component={DetalleOrdenScreen} />
          <Stack.Screen name="Turnos" component={MisTurnosScreen} />
          <Stack.Screen name="Turno" component={TurnoScreen} />
          <Stack.Screen name="HistorialTurnos" component={HistorialTurnosScreen} />
          <Stack.Screen name="GestionUsuarios" component={GestionUsuariosScreen} />
          <Stack.Screen name="ControlFinanciero" component={ControlFinancieroScreen} />
          <Stack.Screen name="ReportesAnalytics" component={ReportesAnalyticsScreen} />
          <Stack.Screen name="ConfiguracionSistema" component={ConfiguracionSistemaScreen} />
          <Stack.Screen name="FuncionesAvanzadas" component={FuncionesAvanzadasScreen} />
          <Stack.Screen name="ActividadLogs" component={ActividadLogsScreen} />
          <Stack.Screen name="GestionHorarios" component={GestionHorariosScreen} />
          <Stack.Screen name="GestionPermisos" component={GestionPermisosScreen} />
          <Stack.Screen name="WhatsAppAdmin" component={WhatsAppAdminScreen} />
          <Stack.Screen name="WhatsAppConfig" component={WhatsAppConfigScreen} />
          <Stack.Screen name="WhatsAppTemplates" component={WhatsAppTemplatesScreen} />
          <Stack.Screen name="WhatsAppContacts" component={WhatsAppContactsScreen} />
          <Stack.Screen name="WhatsAppCampaigns" component={WhatsAppCampaignsScreen} />
          <Stack.Screen name="WhatsAppAutomation" component={WhatsAppAutomationScreen} />
          <Stack.Screen name="WhatsAppAnalytics" component={WhatsAppAnalyticsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
