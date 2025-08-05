import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { DashboardScreen } from './src/screens/dashboard/DashboardScreen';
import { SelectClienteScreen } from './src/screens/orders/SelectClienteScreen';
import { SelectArticulosScreen } from './src/screens/orders/SelectArticulosScreen';
import { ReviewOrdenScreen } from './src/screens/orders/ReviewOrdenScreen';
import { TurnoScreen } from './src/screens/scheduling/TurnoScreen';
import { MisTurnosScreen } from './src/screens/scheduling/MisTurnosScreen';
import { HistorialTurnosScreen } from './src/screens/scheduling/HistorialTurnosScreen';
import { View, Text } from 'react-native';
// Pantallas dummy para navegación del operador
const MisOrdenesScreen = () => <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text>Mis Órdenes</Text></View>;

const Stack = createStackNavigator();

export default function App() {
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
          <Stack.Screen name="Turnos" component={MisTurnosScreen} />
          <Stack.Screen name="Turno" component={TurnoScreen} />
          <Stack.Screen name="HistorialTurnos" component={HistorialTurnosScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
