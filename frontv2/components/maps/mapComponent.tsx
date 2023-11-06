'use client'

import React, { useState, useRef, useEffect } from "react";
import { Button, Menu, Group, Input, Modal, Stack, Text } from "@mantine/core";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import "./maps.css";
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

const AppWithGoogleMap: React.FC<{ onLocationSelect?: Function }> = ({ onLocationSelect }) => {
  const [opened, setOpened] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedRadius, setSelectedRadius] = useState<number>(5);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY ?? "";
  const radiiOptions = [1, 5, 10, 20, 50];

  const SECRET_KEY = 'your_secret_key_here';
  function decryptData(encryptedData:any) {
    const bytes = AES.decrypt(encryptedData, SECRET_KEY);
    return JSON.parse(bytes.toString(Utf8));
  }
  const calculateCircleDiameter = (radiusInKm: number, lat: number, zoom: number) => {
    const metersPerPixel = 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom);
    return 2 * radiusInKm * 1000 / metersPerPixel;
  };

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [googleApiLoaded, setGoogleApiLoaded] = useState(false);

  useEffect(() => {
    const encryptedLocation = localStorage.getItem('location');
    if (encryptedLocation) {
      const decryptedLocation = decryptData(encryptedLocation);
      setLocation({ lat: decryptedLocation.latitude, lng: decryptedLocation.longitude });
      setSelectedRadius(decryptedLocation.radio || 5);
    }
  }, []);

  useEffect(() => {
    if (!googleApiLoaded) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGoogleApiLoaded(true);
      };
      document.head.appendChild(script);
    }
  }, [googleApiLoaded, apiKey]);

  const fetchLocation = () => {
    setOpened(true);
  };

  const getZoomLevel = (radius: number) => {
    switch (radius) {
      case 1:
        return 14;
      case 5:
        return 12;
      case 10:
        return 11;
      case 20:
        return 10;
      default:
        return 1;
    }
  };

  const handleLocationSelect = () => {
    if (location && onLocationSelect) {
      onLocationSelect(location.lat, location.lng, selectedRadius);
      const encryptedLocation = AES.encrypt(JSON.stringify({
        latitude: location.lat,
        longitude: location.lng,
        radio: selectedRadius
      }), SECRET_KEY).toString();
      localStorage.setItem('location', encryptedLocation);

      setOpened(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const autocompleteService = new google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions(
      { input: value },
      (predictions, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setSearchResults(
            predictions.slice(0, 3).map((pred) => pred.description)
          );
        }
      }
    );
  };

  const handleSearchSelect = (value: string) => {
    setQuery(value);
    setSearchResults([]);

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: value }, (results, status) => {
      if (status === "OK" && results) {
        const coords = results[0].geometry.location;
        setLocation({ lat: coords.lat(), lng: coords.lng() });
      }
    });
  };

  return (
    <div>
      <Button onClick={fetchLocation} variant="light">
        Location
      </Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Tu ubicación actual"
        size="90%"
      >
        <Input
          type="text"
          value={query}
          onChange={handleSearchChange}
          style={{ width: "100%", marginBottom: "1em" }}
        />
        {searchResults.map((result) => (
          <Stack key={result}>
            <Button
              variant="light"
              style={{ marginBottom: "0.5em", cursor: "pointer" }}
              onClick={() => handleSearchSelect(result)}
            >
              <Text>{result}</Text>
            </Button>
          </Stack>
        ))}
        {googleApiLoaded && (
          <GoogleMap
            center={location ?? { lat: -34.397, lng: 150.644 }}
            zoom={getZoomLevel(selectedRadius)}
            mapContainerStyle={{ width: "100%", height: "400px" }}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              zoomControl: false,
              scrollwheel: false,
              draggable: false
            }}
          >
            {location && <MarkerF position={location} />}
            {location && (
              <div
                className="circle"
                style={{
                  top: '50%',
                  left: '50%',
                  width: `${calculateCircleDiameter(selectedRadius, location.lat, getZoomLevel(selectedRadius))}px`,
                  height: `${calculateCircleDiameter(selectedRadius, location.lat, getZoomLevel(selectedRadius))}px`,
                }}
              ></div>
            )}
          </GoogleMap>
        )}
        <Group pt={10} justify="end">
          <Menu shadow="md" width={150}>
            <Menu.Target>
              <Button variant="light">{selectedRadius} km</Button>
            </Menu.Target>
            <Menu.Dropdown>
              {radiiOptions.map((radius) => (
                <Menu.Item key={radius} onClick={() => setSelectedRadius(radius)}>
                  {radius} km
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
          <Button onClick={handleLocationSelect} variant="light">
            Select Location
          </Button>
        </Group>
      </Modal>
    </div>
  );
};

export default AppWithGoogleMap;