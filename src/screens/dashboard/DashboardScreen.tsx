import React from 'react';
import { View, Text } from 'react-native';
import { globalStyles } from '../../styles';

export const DashboardScreen: React.FC = () => {
  return (
    <View style={globalStyles.containerPadded}>
      <Text style={globalStyles.heading1}>Dashboard</Text>
      <Text style={globalStyles.bodyText}>Panel principal de la aplicación</Text>
    </View>
  );
};
