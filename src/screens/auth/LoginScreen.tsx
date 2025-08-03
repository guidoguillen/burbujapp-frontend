import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../../styles';

export const LoginScreen: React.FC = () => {
  return (
    <View style={globalStyles.centerContainer}>
      <Text style={globalStyles.heading1}>Login</Text>
      <Text style={globalStyles.bodyText}>Pantalla de inicio de sesión</Text>
    </View>
  );
};
