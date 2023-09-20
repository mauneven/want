import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import { API_BASE_URL, BASE_URL } from '../endpoints/api';

interface User {
  firstName: string;
  lastName: string;
  phone: string;
  birthdate: string;
  photo: string;
}

const ProfileScreen = ({ onUpdate }: { onUpdate: () => void }) => {
  const { colors } = useTheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user`, {
          headers: { Cookie: await AsyncStorage.getItem("cookie") },
        });
        
        if (response.data) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout`, {}, {
        headers: { Cookie: await AsyncStorage.getItem("cookie") },
      });
      await AsyncStorage.removeItem("cookie");
      onUpdate();
    } catch (e) {
      console.error("Error al cerrar sesión:", e);
    }
  };

  const photoUrl = user && user.photo ? `${BASE_URL}/${user.photo}` : undefined;

  return (
    <View style={styles.container}>
      {user && (
        <>
          <Image 
            source={{ uri: photoUrl }}
            style={styles.userImage}
          />
          <Text style={{ ...styles.userInfoText, color: colors.text }}>{user.firstName} {user.lastName}</Text>
          <Text style={{ ...styles.userInfoText, color: colors.text }}>{user.phone}</Text>
          <Text style={{ ...styles.userInfoText, color: colors.text }}>{new Date(user.birthdate).toLocaleDateString()}</Text>
        </>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 8
  },
  logoutButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5
  }
});

export default ProfileScreen;