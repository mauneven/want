import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import { API_BASE_URL, BASE_URL } from '../endpoints/api';
import { dynamicStyles, ProfileThemeColors } from '../styles/ProfileScreenStyles';
import MyPostsCard from '../components/Profile/MyPostsCard';

interface User {
  firstName: string;
  lastName: string;
  phone: string;
  birthdate: string;
  photo: string;
}

interface Post {
  _id: string;
  title: string;
  price: number;
  photos: string[];
}

const ProfileScreen = ({ onUpdate }: { onUpdate: () => void }) => {
  const { colors } = useTheme();
  const extendedColors: ProfileThemeColors = {
    background: colors.background,
    text: colors.text,
    border: colors.border,
    buttonText: colors.text,
    buttonBackground: colors.primary // Ajusta según tus necesidades
  };
  const styles = dynamicStyles(extendedColors);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);


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

    const fetchMyPosts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/my-posts`, {
          headers: { Cookie: await AsyncStorage.getItem("cookie") },
        });
        
        if (response.data) {
          setPosts(response.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchUserData();
    fetchMyPosts();
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

  const handleDeletePost = async (postId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/posts/${postId}`, {
        headers: { Cookie: await AsyncStorage.getItem("cookie") },
      });
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const photoUrl = user && user.photo ? `${BASE_URL}/${user.photo}` : undefined;

  return (
    <View style={styles.container}>
      <View style={[styles.header, {backgroundColor: colors.card}]}>
        <Image source={{ uri: photoUrl }} style={styles.userImage} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={{ color: colors.text }}>Editar Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={{ color: colors.text }}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={posts}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <MyPostsCard post={item} handleDeletePost={handleDeletePost} />
        )}
      />
    </View>
  );

};

export default ProfileScreen;