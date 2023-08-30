import { useEffect, useState, useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/HomeScreen';
import LoginScreen from '../../screens/LoginScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import checkUserSession from '../requests/userInfo';

const Tab = createBottomTabNavigator();

const Menu: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAndUpdateUserSession = useCallback(async () => {
    const userSession = await checkUserSession();
    setIsLoggedIn(userSession);
  }, []);

  useEffect(() => {
    checkAndUpdateUserSession();
  }, [checkAndUpdateUserSession]);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      {isLoggedIn ? (
        <Tab.Screen name="Perfil">
          {() => <ProfileScreen onUpdate={checkAndUpdateUserSession} />}
        </Tab.Screen>
      ) : (
        <Tab.Screen name="Login">
          {() => <LoginScreen onUpdate={checkAndUpdateUserSession} />}
        </Tab.Screen>
      )}
    </Tab.Navigator>
  );
};

export default Menu;