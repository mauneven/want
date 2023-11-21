import React, { useState } from 'react';
import {
  View,
  Button,
  Alert,
  ScrollView
} from 'react-native';
import { API_BASE_URL } from '../endpoints/api';
import { dynamicStyles } from '../styles/CreatePostScreenStyles';
import { UniversalStyles } from '../styles/UniversalStyles';
import { CreatePostInputs } from '../components/CreatePost/CreatePostInputs';

export const CreatePostScreen = () => {

  const styles = dynamicStyles();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [mainCategory, setMainCategory] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string>('');
  const [thirdCategory, setThirdCategory] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);

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
      const photoObj = {
        uri: photo,
        type: 'image/jpeg',
        name: `photo_${index}.jpg`,
      };
      formData.append('photos[]', photoObj);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      Alert.alert('Success', 'Created.');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView >
      <View style={styles.container}>

        <CreatePostInputs
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          mainCategory={mainCategory}
          setMainCategory={setMainCategory}
          subCategory={subCategory}
          setSubCategory={setSubCategory}
          thirdCategory={thirdCategory}
          setThirdCategory={setThirdCategory}
          price={price}
          setPrice={setPrice}
          photos={photos}
          setPhotos={setPhotos}
          styles={styles}
        />
        <Button title="Crear Publicación" onPress={handleCreatePost} />
      </View>
    </ScrollView>
  );
};