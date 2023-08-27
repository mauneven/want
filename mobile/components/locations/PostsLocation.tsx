import React, { useState, useEffect, useRef } from 'react';
import { View, Modal, Button, TextInput, StyleSheet } from 'react-native';
import MapView, { Marker, Circle, Region } from 'react-native-maps';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@react-navigation/native';

interface Location {
  latitude: number;
  longitude: number;
}

interface PostsLocationProps {
  onFilterChange: (filter: { latitude: number; longitude: number; radius: number }) => void;
}

const PostsLocation: React.FC<PostsLocationProps> = ({ onFilterChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [radius, setRadius] = useState<number>(1000); // Default radius in meters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const mapRef = useRef<MapView | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    // Get initial location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
        },
        error => console.log(error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    }
  }, []);

  const fetchSearchResults = async (query: string) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    fetchSearchResults(query);
  };

  const handleSearchSelect = (location: any) => {
    const { lat, lon } = location;
    const newLocation = { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    setCurrentLocation(newLocation);
    if (mapRef.current) {
      const newRegion: Region = {
        ...newLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      mapRef.current.animateToRegion(newRegion, 500);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRadiusChange = (value: number) => {
    setRadius(value);
  };

  useEffect(() => {
    if (currentLocation && radius) {
      onFilterChange({ latitude: currentLocation.latitude, longitude: currentLocation.longitude, radius });
    }
  }, [currentLocation, radius]);

  return (
    <View>
      <Button title="Mostrar Mapa" onPress={() => setModalVisible(true)} color={colors.primary} />
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <TextInput
            style={{ height: 40, borderColor: colors.border, borderWidth: 1, color: colors.text, backgroundColor: colors.card }}
            onChangeText={text => handleSearchChange(text)}
            value={searchQuery}
            placeholder="Buscar ubicación"
            placeholderTextColor={colors.text}  // Añadir esta línea
          />
          {searchResults.map((result, index) => (
            <Button key={index} title={result.display_name} onPress={() => handleSearchSelect(result)} />
          ))}
          <Picker
            selectedValue={radius}
            onValueChange={(itemValue) => handleRadiusChange(itemValue)}
          >
            <Picker.Item label="1 km" value={1} />
            <Picker.Item label="5 km" value={5} />
            <Picker.Item label="10 km" value={10} />
            <Picker.Item label="100 km" value={100} />
            {/* Add more as needed */}
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
              <Circle center={currentLocation} radius={radius} />
            </MapView>
          )}
          <Button title="Cerrar Mapa" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default PostsLocation;