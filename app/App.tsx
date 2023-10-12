import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import Menu from './components/navigation/Menu';
import { enableScreens } from 'react-native-screens';
enableScreens();

const App = () => {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme: DarkTheme}>
      <Menu />
    </NavigationContainer>
  );
};

export default App;