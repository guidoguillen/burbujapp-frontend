import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from './LoginScreen';

// Mock del hook useAuth
const mockLogin = jest.fn();
const mockUseAuth = {
  login: mockLogin,
};

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth,
}));

// Mock de navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock para react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(component => component),
    Directions: {},
  };
});

const renderLoginScreen = () => {
  return render(<LoginScreen />);
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar correctamente todos los elementos básicos', () => {
    const { getByPlaceholderText, getByText } = renderLoginScreen();
    
    expect(getByText('BurbujaApp')).toBeTruthy();
    expect(getByText('Gestión empresarial integral')).toBeTruthy();
    expect(getByPlaceholderText('Usuario')).toBeTruthy();
    expect(getByPlaceholderText('Contraseña')).toBeTruthy();
    expect(getByText('¿No tienes una cuenta?')).toBeTruthy();
  });

  it('debe permitir ingresar usuario y contraseña', () => {
    const { getByPlaceholderText } = renderLoginScreen();
    
    const usernameInput = getByPlaceholderText('Usuario');
    const passwordInput = getByPlaceholderText('Contraseña');
    
    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'testpass');
    
    expect(usernameInput.props.value).toBe('testuser');
    expect(passwordInput.props.value).toBe('testpass');
  });

  it('debe ejecutar login con credenciales válidas', async () => {
    mockLogin.mockResolvedValue(undefined);
    
    const { getByPlaceholderText, getAllByText } = renderLoginScreen();
    
    const usernameInput = getByPlaceholderText('Usuario');
    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButtons = getAllByText('Iniciar Sesión');
    const loginButton = loginButtons[1]; // El segundo es el botón, el primero es el título
    
    fireEvent.changeText(usernameInput, 'adm');
    fireEvent.changeText(passwordInput, '123');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('adm', '123');
    });
  });

  it('debe tener el campo de contraseña como secureTextEntry', () => {
    const { getByPlaceholderText } = renderLoginScreen();
    
    const passwordInput = getByPlaceholderText('Contraseña');
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it('debe mostrar estado inicial correctamente', () => {
    const { getByPlaceholderText } = renderLoginScreen();
    
    const usernameInput = getByPlaceholderText('Usuario');
    const passwordInput = getByPlaceholderText('Contraseña');
    
    // Los campos deben estar vacíos inicialmente
    expect(usernameInput.props.value).toBe('');
    expect(passwordInput.props.value).toBe('');
  });

  it('debe tener el botón de login visible', () => {
    const { getAllByText } = renderLoginScreen();
    
    const loginButtons = getAllByText('Iniciar Sesión');
    expect(loginButtons.length).toBeGreaterThan(0);
    expect(loginButtons[1]).toBeTruthy(); // El botón
  });

  it('debe permitir interactuar con los campos de entrada', () => {
    const { getByPlaceholderText } = renderLoginScreen();
    
    const usernameInput = getByPlaceholderText('Usuario');
    const passwordInput = getByPlaceholderText('Contraseña');
    
    // Simular focus en los campos
    fireEvent(usernameInput, 'focus');
    fireEvent(passwordInput, 'focus');
    
    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
  });

  it('debe manejar cambios de texto correctamente', () => {
    const { getByPlaceholderText } = renderLoginScreen();
    
    const usernameInput = getByPlaceholderText('Usuario');
    
    fireEvent.changeText(usernameInput, 'a');
    expect(usernameInput.props.value).toBe('a');
    
    fireEvent.changeText(usernameInput, 'admin');
    expect(usernameInput.props.value).toBe('admin');
  });
});
