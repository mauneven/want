'use client'
import React, { useState, useRef } from "react";
import { Button, Menu, Group, Input, Modal, Stack, Text } from "@mantine/core";
import { GoogleMap, LoadScript, MarkerF, Circle } from "@react-google-maps/api";

const AppWithGoogleMap: React.FC<{ onLocationSelect?: Function }> = ({ onLocationSelect }) => {
  const [opened, setOpened] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const defaultRadius = 5; // Radio por defecto
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedRadius, setSelectedRadius] = useState<number>(defaultRadius);
  const [query, setQuery] = useState("");
  const radiiOptions = [1, 5, 10, 20, 10000000000000000000000000000000000000000000000000000000];

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setOpened(true);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
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
    <LoadScript
      googleMapsApiKey="AIzaSyD7noZo9tRRp0iHN5BQClJBEtOP6E8uoCc"
      libraries={["places"]}
    >
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
        <GoogleMap
          center={location || { lat: -34.397, lng: 150.644 }}
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
            <Circle
              center={location}
              radius={selectedRadius * 1000}
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
              }}
            />
          )}
        </GoogleMap>
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
    </LoadScript>
  );
};

export default AppWithGoogleMap;