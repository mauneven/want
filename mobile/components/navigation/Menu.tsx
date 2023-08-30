import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/HomeScreen';
import LoginScreen from '../../screens/LoginScreen';
import ProfileScreen from '../../screens/ProfileScreen';

type MenuProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};;

const Tab = createBottomTabNavigator();

const Menu: React.FC<MenuProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      {isLoggedIn ? (
        <Tab.Screen name="Perfil" component={ProfileScreen} />
      ) : (
        <Tab.Screen name="Login" component={LoginScreen} />
      )}
    </Tab.Navigator>
  );
};

export default Menu;
