import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import Menu from './components/navigation/Menu';

const App = () => {
  const scheme = useColorScheme(); // Obtiene el tema actual del sistema

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Menu />
    </NavigationContainer>
  );
};

export default App;