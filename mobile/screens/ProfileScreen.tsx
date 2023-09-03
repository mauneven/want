import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import { API_BASE_URL } from '../endpoints/api';

const ProfileScreen = ({ onUpdate }: { onUpdate: () => void }) => {

  const {colors} = useTheme();

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

  return (
    <>
    <Text style={{ fontSize: 60, color: colors.text }}>Bienvenido</Text>
    <TouchableOpacity onPress={handleLogout}>
        <Text>Cerrar sesión</Text>
    </TouchableOpacity>
    </>
  );
};

export default ProfileScreen;
