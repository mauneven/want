import React, { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import Menu from './components/navigation/Menu';

const App = () => {
  const scheme = useColorScheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Menu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </NavigationContainer>
  );
};

export default App;