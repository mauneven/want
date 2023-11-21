import { createStackNavigator } from '@react-navigation/stack';
import EditProfileScreen from '../../screens/EditProfileScreen';
import checkUserSession from '../requests/userInfo';
import { CreatePostScreen } from '../../screens/CreatePostScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import HomeScreen from '../../screens/HomeScreen';
import { useEffect, useState, useCallback } from 'react';
import LoginScreen from '../../screens/LoginScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();

const ProfileStackNavigator = ({ onUpdate }: { onUpdate: () => void }) => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Perfil"
        children={(props) => <ProfileScreen {...props} onUpdate={onUpdate} />}
      />
      <ProfileStack.Screen name="Editar Perfil" component={EditProfileScreen} />
    </ProfileStack.Navigator>
  );
};

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
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      {isLoggedIn ? (
        <>
          <Tab.Screen name="Crear Post" component={CreatePostScreen} />
          <Tab.Screen
            name="Perfil"
            children={() => <ProfileStackNavigator onUpdate={checkAndUpdateUserSession} />}
          />
        </>
      ) : (
        <Tab.Screen
          name="Login"
          children={() => <LoginScreen onUpdate={checkAndUpdateUserSession} />}
        />
      )}
    </Tab.Navigator>
  );
};

export default Menu;