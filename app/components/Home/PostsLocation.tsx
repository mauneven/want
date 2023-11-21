import React, { useState, useEffect, useRef } from 'react';
import { View, Modal, Button, TextInput, StyleSheet, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, Circle } from 'react-native-maps';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';

interface Location {
  latitude: number;
  longitude: number;
}

interface PostsLocationProps {
  onFilterChange: (filter: { latitude: number; longitude: number; radius: number }) => void;
}

const PostsLocation: React.FC<PostsLocationProps> = ({ onFilterChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [radius, setRadius] = useState<number>(1000);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const mapRef = useRef<MapView | null>(null);
  const { colors } = useTheme();

  const fetchLocationByIP = async () => {
    try {
      const { data } = await axios.get('https://ipapi.co/json');
      setCurrentLocation({ latitude: data.latitude, longitude: data.longitude });
      await AsyncStorage.setItem('savedLocation', JSON.stringify(data));
    } catch (error) {
      console.log("Couldn't fetch location by IP: ", error);
    }
  };

  const requestLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        AsyncStorage.setItem('savedLocation', JSON.stringify({ latitude, longitude }));
      },
      (error) => {
        fetchLocationByIP();
        console.log(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchSearchResults = async (query: string) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.log("Couldn't fetch search results: ", error);
    }
  };

  useEffect(() => {
    (async () => {
      const savedLocation = await AsyncStorage.getItem('savedLocation');
      const savedRadius = await AsyncStorage.getItem('savedRadius');

      if (savedLocation) {
        setCurrentLocation(JSON.parse(savedLocation));
      } else {
        setPermissionModalVisible(true);
      }

      if (savedRadius) {
        setRadius(JSON.parse(savedRadius));
      }
    })();
  }, []);

  const handlePermissionResponse = (userResponse: boolean) => {
    if (userResponse) {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
      }
      requestLocation();
    } else {
      fetchLocationByIP();
    }
    setPermissionModalVisible(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    fetchSearchResults(query);
  };

  const handleSearchSelect = async (location: any) => {
    const { lat, lon } = location;
    const newLocation = { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    setCurrentLocation(newLocation);
    await AsyncStorage.setItem('savedLocation', JSON.stringify(newLocation));
    mapRef.current?.animateToRegion(
      { ...newLocation, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
      500
    );
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRadiusChange = async (value: number) => {
    setRadius(value);
    await AsyncStorage.setItem('savedRadius', JSON.stringify(value));
  };

  useEffect(() => {
    if (currentLocation && radius) {
      console.log("onFilterChange called with:", { latitude: currentLocation.latitude, longitude: currentLocation.longitude, radius }); // línea de depuración
      onFilterChange({ latitude: currentLocation.latitude, longitude: currentLocation.longitude, radius });
    }
  }, [currentLocation, radius]);

  return (
    <View>
      <Button title="Mostrar Mapa" onPress={() => setModalVisible(true)} color={colors.primary} />
      <Modal animationType="slide" transparent={false} visible={permissionModalVisible}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button title="Deseas que Want entienda en qué zona de tu país te encuentras?" onPress={() => handlePermissionResponse(true)} />
          <Button title="No" onPress={() => handlePermissionResponse(false)} />
        </View>
      </Modal>
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={{ flex: 1 }}>
          <TextInput
            style={{ height: 40, borderColor: colors.border, borderWidth: 1, color: colors.text, backgroundColor: colors.card }}
            onChangeText={text => handleSearchChange(text)}
            value={searchQuery}
          />
          {searchResults.map((result, index) => (
            <Button key={index} title={result.display_name} onPress={() => handleSearchSelect(result)} />
          ))}
          <Picker selectedValue={radius} onValueChange={(itemValue) => handleRadiusChange(itemValue)}>
            <Picker.Item label="1 km" value={1} />
            <Picker.Item label="5 km" value={5} />
            <Picker.Item label="10 km" value={10} />
            <Picker.Item label="100 km" value={100} />
            <Picker.Item label="All" value={10000000000000000000000000} />
          </Picker>
          {currentLocation && (
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              initialRegion={{
                ...currentLocation,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker coordinate={currentLocation} />
              <Circle center={currentLocation} radius={radius * 1000} />
            </MapView>
          )}
          <Button title="Cerrar Mapa" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default PostsLocation;