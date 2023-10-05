
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';
import { API_BASE_URL } from '../endpoints/api';

const MAX_PHOTO_SIZE_MB = 5;
const MAX_TOTAL_PHOTOS_MB = 20;

export const CreatePostScreen = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [mainCategory, setMainCategory] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string>('');
  const [thirdCategory, setThirdCategory] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]); // Using string for URIs of photos

  const handleTitleChange = (value: string) => {
    setTitle(value.slice(0, 60));
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value.slice(0, 600));
  };

  const handlePriceChange = (value: string) => {
    setPrice(value.slice(0, 11));
  };

  const handleDeletePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const validateForm = (): boolean => {
    if (!title || !description || !mainCategory || !subCategory || !thirdCategory || !price) {
      Alert.alert('Error', 'Por favor, complete todos los campos requeridos.');
      return false;
    }
    return true;
  };

  const handleCreatePost = async () => {
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('latitude', '4.4414232');
    formData.append('longitude', '-75.1895462');
    formData.append('mainCategory', mainCategory);
    formData.append('subCategory', subCategory);
    formData.append('thirdCategory', thirdCategory);
    formData.append('price', price);
    photos.forEach((photo, index) => {
      formData.append('photos[]', photo);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      Alert.alert('Éxito', 'Publicación creada con éxito.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Crear Publicación</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={handleTitleChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={handleDescriptionChange}
        multiline={true}
      />
      {/* Asumiendo que quieres inputs para las categorías */}
      <TextInput
        style={styles.input}
        placeholder="Categoría Principal"
        value={mainCategory}
        onChangeText={setMainCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Subcategoría"
        value={subCategory}
        onChangeText={setSubCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Tercera Categoría"
        value={thirdCategory}
        onChangeText={setThirdCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={price}
        onChangeText={handlePriceChange}
        keyboardType="number-pad"
      />
      {/* Aquí deberías agregar la lógica para subir imágenes */}
      {photos.map((photo, index) => (
        <View key={photo[index]} style={styles.photoContainer}>
          <Image source={{ uri: photo }} style={styles.photo} />
          <TouchableOpacity onPress={() => handleDeletePhoto(index)}>
            <Text style={styles.deletePhotoText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Button title="Crear Publicación" onPress={handleCreatePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 15,
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  photo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  deletePhotoText: {
    color: 'red',
  },
});