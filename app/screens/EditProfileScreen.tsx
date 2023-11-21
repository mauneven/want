import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, BASE_URL } from '../endpoints/api';
import { launchImageLibrary } from 'react-native-image-picker';
import { UniversalStyles } from '../styles/UniversalStyles';

const EditProfileScreen: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [photo, setPhoto] = useState<any>(null);
  const [newPhoto, setNewPhoto] = useState<any>(null);
  const styles = UniversalStyles();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user`, {
          headers: { Cookie: await AsyncStorage.getItem('cookie') },
        });

        if (response.data) {
          setUser(response.data.user);
          setFirstName(response.data.user.firstName);
          setLastName(response.data.user.lastName);
          setPhone(response.data.user.phone);
          setBirthdate(response.data.user.birthdate);
          setPhoto(response.data.user.photo);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteAccount = async () => {
    // Implement the logic for deleting the account here
  };

  const handlePhotoChange = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
        if (!response.didCancel && response.assets && response.assets.length > 0) {
          setNewPhoto(response.assets[0]);
        }
      }
    );
  };

  const handleProfileSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('phone', phone);
      formData.append('birthdate', birthdate);

      if (newPhoto) {
        formData.append('photo', {
          name: newPhoto.fileName,
          type: newPhoto.type,
          uri: newPhoto.uri,
        });
      }

      const response = await axios.put(`${API_BASE_URL}/users/me`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Cookie: await AsyncStorage.getItem('cookie'),
        },
      });

      if (response.status === 200) {
        if (newPhoto) {
          setPhoto(newPhoto);
          setNewPhoto(null);
        }
        Alert.alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error updating profile. Please check your internet connection and try again.');
    }
  };

  const photoUrl = photo?.uri || (user?.photo ? `${BASE_URL}/${user.photo}` : undefined);

  return (
    <View style={styles.container}>
      
      <Image source={{ uri: newPhoto?.uri || photoUrl }} style={{ width: 150, height: 150, borderRadius: 75, display: 'flex', alignItems: 'center' }} />
      <TouchableOpacity onPress={handlePhotoChange}>
        <Text style={styles.buttonText}>Change Profile Photo</Text>
      </TouchableOpacity>
      
      {newPhoto && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button title="Confirm Photo" onPress={handleProfileSubmit} />
          <Button title="Cancel Photo" onPress={() => setNewPhoto(null)} />
        </View>
      )}

      <TextInput style={styles.inputField} value={firstName} onChangeText={setFirstName} placeholder="First Name" />
      <TextInput style={styles.inputField} value={lastName} onChangeText={setLastName} placeholder="Last Name" />
      <TextInput style={styles.inputField} value={phone} onChangeText={setPhone} placeholder="Phone" />
      <TextInput style={styles.inputField} value={birthdate} onChangeText={setBirthdate} placeholder="Birthdate" />

      <Button title="Save changes" onPress={handleProfileSubmit} />

      <TouchableOpacity onPress={handleDeleteAccount}>
        <Text style={{ color: 'red' }}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileScreen;