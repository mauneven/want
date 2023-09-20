import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, Alert } from 'react-native';
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

interface Post {
  _id: string;
  title: string;
  price: number;
  photos: string[];
}

const ProfileScreen = ({ onUpdate }: { onUpdate: () => void }) => {
  const { colors } = useTheme();
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
      <View style={styles.header}>
        <Image source={{ uri: photoUrl }} style={styles.userImage} />
        <View style={styles.userInfo}>
          <Text style={{ ...styles.userName, color: colors.text }}>{user?.firstName} {user?.lastName}</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text>Editar Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={posts}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Image source={{ uri: `${BASE_URL}/${item.photos[0]}` }} style={styles.postImage} />
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postPrice}>${item.price.toLocaleString()}</Text>
            <TouchableOpacity onPress={() => Alert.alert("Eliminar", "¿Quieres eliminar este post?", [
              { text: "Cancelar" },
              { text: "Eliminar", onPress: () => handleDeletePost(item._id) }
            ])}>
              <Text>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfo: {
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 18,
    marginBottom: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    marginBottom: 8,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  postContainer: {
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 5,
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  postPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;