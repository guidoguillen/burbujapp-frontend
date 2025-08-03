// Archivo de configuración de navegación
export interface NavigationConfig {
  initialRouteName: string;
  screenOptions: {
    headerShown: boolean;
  };
}

export const mainNavigationConfig: NavigationConfig = {
  initialRouteName: 'Dashboard',
  screenOptions: {
    headerShown: false,
  },
};

export const authNavigationConfig: NavigationConfig = {
  initialRouteName: 'Login',
  screenOptions: {
    headerShown: false,
  },
};
