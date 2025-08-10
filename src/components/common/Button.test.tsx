import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from './Button';

describe('Button Component', () => {
  it('debe renderizar correctamente con título', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('debe ejecutar onPress cuando se presiona', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Click Me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('debe estar deshabilitado cuando disabled es true', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Disabled Button" onPress={mockOnPress} disabled={true} />
    );
    
    const button = getByText('Disabled Button');
    fireEvent.press(button);
    
    // No debe ejecutar onPress cuando está deshabilitado
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('debe renderizar con estado habilitado por defecto', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Enabled Button" onPress={mockOnPress} />
    );
    
    const button = getByText('Enabled Button');
    fireEvent.press(button);
    
    // Debe ejecutar onPress cuando está habilitado
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('debe manejar múltiples presiones cuando está habilitado', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Multi Press Button" onPress={mockOnPress} />
    );
    
    const button = getByText('Multi Press Button');
    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(3);
  });

  it('debe renderizar texto con estilo correcto', () => {
    const { getByText } = render(
      <Button title="Styled Text Button" onPress={() => {}} />
    );
    
    const buttonText = getByText('Styled Text Button');
    expect(buttonText).toBeTruthy();
    expect(buttonText.props.style).toBeTruthy();
  });

  it('debe tener el comportamiento TouchableOpacity', () => {
    const { getByText } = render(
      <Button title="Touchable Button" onPress={() => {}} />
    );
    
    const button = getByText('Touchable Button');
    expect(button.parent).toBeTruthy();
  });

  it('debe manejar onPress asíncrono', async () => {
    const mockAsyncOnPress = jest.fn().mockResolvedValue('success');
    const { getByText } = render(
      <Button title="Async Button" onPress={mockAsyncOnPress} />
    );
    
    fireEvent.press(getByText('Async Button'));
    expect(mockAsyncOnPress).toHaveBeenCalledTimes(1);
  });
});
